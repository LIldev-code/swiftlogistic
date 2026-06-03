"use client";
import React, { useContext, useEffect, useState, Suspense, useRef } from "react";
import style from "./page.module.css";
import useMediaQuery from "@/components/UseMediaQuery";
import { useRouter, useSearchParams } from "next/navigation";
import ShipmentContext from "@/contexts/ShipmentContext";
import dynamic from "next/dynamic";
import { geocodeAddress } from "@/utils/geocode";
import Footer from "@/components/Footer/Footer";
import Barcode from "@/components/Barcode";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

const generateDate = (daysToAdd = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0];
};

const calculateEstimatedDeliveryTime = (distance, method) => {
  const speeds = { road: 20, sea: 15, rail: 60, air: 700 };
  if (!method) method = "road";
  try {
    const speed = speeds[method.toLowerCase()] || speeds.road;
    return (distance / speed).toFixed(2);
  } catch {
    return "48.00";
  }
};

const statusColors = {
  "In Transit": { bg: "#dbeafe", color: "#1e40af", icon: "fa-shipping-fast" },
  "Delivered": { bg: "#dcfce7", color: "#16a34a", icon: "fa-check-circle" },
  "On Hold": { bg: "#fef9c3", color: "#ca8a04", icon: "fa-pause-circle" },
  "Pending": { bg: "#f1f5f9", color: "#64748b", icon: "fa-clock" },
  "Out for Delivery": { bg: "#ede9fe", color: "#7c3aed", icon: "fa-truck" },
};

function InfoRow({ label, value, hide }) {
  if (!value) return null;
  return (
    <div className={`${style.liner} ${hide ? "hide-when-printing" : ""}`}>
      <span style={{ fontWeight: 600, color: "#374151", fontSize: "14px" }}>{label}</span>
      <span style={{ color: "#0f172a", fontSize: "14px", textAlign: "right", maxWidth: "55%" }}>{value}</span>
    </div>
  );
}

function PageContent() {
  const mobile = useMediaQuery("(max-width:740px)");
  const navigate = useRouter();
  const { shipments, setShipments, shipmentStatus, setShipmentStatus, setShipmentPosition } = useContext(ShipmentContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const trackingNumber = searchParams.get("num");
  const [senderCoords, setSenderCoords] = useState(null);
  const [receiverCoords, setReceiverCoords] = useState(null);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState("");
  const printRef = useRef();

  useEffect(() => {
    const fetchLatestShipment = async () => {
      const L = await import("leaflet");
      if (trackingNumber) {
        try {
          const res = await fetch("/api/getShipment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ trackingNumber }),
          });
          if (res.status === 200) {
            const data = await res.json();
            const processedData = { ...data.shipmentData };
            if (!processedData.departureDate && processedData.departureTime && processedData.departureTime.includes("-")) {
              processedData.departureDate = processedData.departureTime;
              processedData.departureTime = "";
            }
            setShipments(processedData);
            if (data.shipmentData.status !== shipmentStatus) {
              await fetch("/api/sendEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiverEmail: data.shipmentData.receiverEmail, trackingNumber, status: data.shipmentData.status }),
              });
              setShipmentStatus(data.shipmentData.status);
            }
            setShipmentPosition(data.shipmentData.currentPosition);
            const sCoords = await geocodeAddress(data.shipmentData.senderAddress);
            const rCoords = await geocodeAddress(data.shipmentData.receiverAddress);
            if (sCoords && rCoords) {
              setSenderCoords(sCoords);
              setReceiverCoords(rCoords);
              const dist = L.latLng(sCoords).distanceTo(L.latLng(rCoords)) / 1000;
              setEstimatedDeliveryTime(calculateEstimatedDeliveryTime(dist, data.shipmentData.shippingMethod));
            }
            setLoading(false);
          } else {
            const errorData = await res.json();
            throw new Error(errorData.message || "Shipment not found");
          }
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchLatestShipment();
  }, [trackingNumber, setShipments, setShipmentStatus, setShipmentPosition, shipmentStatus]);

  const handlePrint = () => {
    const styleEl = document.createElement("style");
    styleEl.id = "print-style";
    styleEl.innerHTML = `@media print { .hide-when-printing { display: none !important; } }`;
    document.head.appendChild(styleEl);
    setTimeout(() => {
      window.print();
      const s = document.getElementById("print-style");
      if (s) document.head.removeChild(s);
    }, 800);
  };

  if (loading) {
    return (
      <div className="loadingStuff">
        <div className="loader">
          <svg className="loader-circle" viewBox="25 25 50 50">
            <circle className="loader-circle-path" cx="50" cy="50" r="20" fill="none" />
          </svg>
          <div className="loader-text">SC</div>
        </div>
      </div>
    );
  }

  if (!shipments) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f0f7ff", gap: "20px" }}>
        <div style={{ width: "80px", height: "80px", background: "rgba(30,64,175,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className="fas fa-box-open" style={{ fontSize: "32px", color: "#1e40af" }}></i>
        </div>
        <h2 style={{ color: "#0f172a", fontWeight: 700 }}>No Shipment Found</h2>
        <p style={{ color: "#64748b" }}>We could not find any shipment matching your tracking number.</p>
        <a href="/" style={{ background: "#1e40af", color: "white", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 600 }}>Back to Home</a>
      </div>
    );
  }

  const statusMeta = statusColors[shipments.status] || statusColors["Pending"];

  const cardHeader = (icon, title) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px", paddingBottom: "14px", borderBottom: "2px solid #f1f5f9" }}>
      <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg,#1e40af,#2563eb)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <i className={`fas ${icon}`} style={{ color: "white", fontSize: "14px" }}></i>
      </div>
      <h3 style={{ fontWeight: 700, color: "#0f172a", fontSize: "15px", margin: 0 }}>{title}</h3>
    </div>
  );

  const Field = ({ label, value }) => !value ? null : (
    <div style={{ display: "flex", flexDirection: "column", gap: "3px", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
      <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</span>
      <span style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a", lineHeight: 1.5 }}>{value}</span>
    </div>
  );

  return (
    <>
      <main ref={printRef} style={{ background: "#f0f4f8", minHeight: "100vh", paddingTop: "32px", paddingBottom: "60px" }}>
        <div style={{ maxWidth: "1020px", margin: "0 auto", padding: "0 20px" }}>

          {/* ── Top bar ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ color: "#64748b", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Tracking Number</p>
              <h1 style={{ fontSize: "clamp(18px,3vw,26px)", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>{trackingNumber}</h1>
            </div>
            <button onClick={handlePrint} className="hide-when-printing" style={{ display: "flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg,#1e40af,#2563eb)", color: "white", border: "none", borderRadius: "10px", padding: "11px 22px", fontWeight: 700, cursor: "pointer", fontSize: "13px", boxShadow: "0 4px 14px rgba(30,64,175,0.3)" }}>
              <i className="fas fa-print"></i> Print
            </button>
          </div>

          {/* ── Status + Logo/Barcode row ── */}
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "16px", marginBottom: "20px", alignItems: "stretch" }}>
            {/* Status */}
            <div style={{ background: statusMeta.bg, borderRadius: "14px", padding: "20px 28px", display: "flex", alignItems: "center", gap: "14px", border: `1.5px solid ${statusMeta.color}22` }}>
              <div style={{ width: "48px", height: "48px", background: statusMeta.color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={`fas ${statusMeta.icon}`} style={{ color: "white", fontSize: "18px" }}></i>
              </div>
              <div>
                <p style={{ color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px" }}>Current Status</p>
                <p style={{ color: statusMeta.color, fontWeight: 800, fontSize: "18px", textTransform: "uppercase", margin: 0 }}>{shipments.status}</p>
              </div>
            </div>
            {/* Logo + Barcode */}
            <div style={{ background: "white", borderRadius: "14px", padding: "20px 24px", display: "flex", alignItems: "center", gap: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", flexWrap: "wrap" }}>
              <img src="/images/swiftargo.png" alt="SwiftCargo" style={{ height: "48px", objectFit: "contain" }} />
              <div style={{ flex: 1, minWidth: "200px" }}><Barcode trackingNumber={trackingNumber} /></div>
            </div>
          </div>

          {/* ── Shipper & Receiver ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            {[
              { title: "Shipper Information", icon: "fa-user-tie", fields: [
                { label: "Name", value: shipments.sender },
                { label: "Address", value: shipments.senderAddress },
                { label: "Phone", value: shipments.senderNumber },
              ]},
              { title: "Receiver Information", icon: "fa-user", fields: [
                { label: "Name", value: shipments.receiver },
                { label: "Address", value: shipments.receiverAddress },
                { label: "Phone", value: shipments.receiverNumber },
              ]},
            ].map((col, i) => (
              <div key={i} style={{ background: "white", borderRadius: "14px", padding: "22px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                {cardHeader(col.icon, col.title)}
                {col.fields.map((f, j) => <Field key={j} label={f.label} value={f.value} />)}
              </div>
            ))}
          </div>

          {/* ── Shipment Details ── */}
          <div style={{ background: "white", borderRadius: "14px", padding: "22px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
            {cardHeader("fa-info-circle", "Shipment Information")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
              {/* Route */}
              <Field label="Origin" value={shipments.origin} />
              <Field label="Destination" value={shipments.destination} />
              {/* Departure */}
              <Field label="Departure Date" value={shipments.departureDate} />
              <Field label="Departure Time" value={shipments.departureTime} />
              {/* Pickup */}
              <Field label="Pickup Date" value={shipments.pickupDate} />
              <Field label="Pickup Time" value={shipments.pickupTime} />
              {/* Delivery */}
              <Field label="Expected Delivery" value={shipments.expectedDeliveryDate} />
              <Field label="Carrier Ref No." value={shipments.carrierReferenceNo} />
              {/* Shipment details */}
              <Field label="Shipment Type" value={shipments.shipmentType} />
              <Field label="Shipping Mode" value={shipments.mode} />
              <Field label="Weight" value={shipments.weight ? `${shipments.weight} kg` : null} />
              <Field label="Packages" value={shipments.packages} />
              {/* Commercial */}
              <Field label="Carrier" value={shipments.carrier} />
              <Field label="Payment Method" value={shipments.paymentMethod} />
              <Field label="Total Freight" value={shipments.totalFreight} />
              {shipments.comments && <div style={{ gridColumn: "1/-1" }}><Field label="Comments" value={shipments.comments} /></div>}
            </div>
          </div>

          {/* ── Package Details ── */}
          {((shipments.length && shipments.length !== "3") || (shipments.width && shipments.width !== "4") || (shipments.height && shipments.height !== "4") || (shipments.productWeight && shipments.productWeight !== "0.3")) && (
            <div style={{ background: "white", borderRadius: "14px", padding: "22px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
              {cardHeader("fa-box", "Package Details")}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 24px" }}>
                {shipments.productQuantity && shipments.productQuantity !== "3" && <Field label="Quantity" value={shipments.productQuantity} />}
                {shipments.description && shipments.description !== "GOOD" && <Field label="Description" value={shipments.description} />}
                {shipments.length && shipments.length !== "3" && <Field label="Length (cm)" value={shipments.length} />}
                {shipments.width && shipments.width !== "4" && <Field label="Width (cm)" value={shipments.width} />}
                {shipments.height && shipments.height !== "4" && <Field label="Height (cm)" value={shipments.height} />}
                {shipments.productWeight && shipments.productWeight !== "0.3" && <Field label="Weight (g)" value={shipments.productWeight} />}
              </div>
            </div>
          )}

          {/* ── Map ── */}
          {senderCoords && receiverCoords && (
            <div style={{ background: "white", borderRadius: "14px", padding: "22px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
              {cardHeader("fa-map-marked-alt", "Package Route")}
              <MapComponent senderCoords={senderCoords} receiverCoords={receiverCoords} trackingNumber={trackingNumber} />
            </div>
          )}

          {/* ── Shipment History ── */}
          <div style={{ background: "white", borderRadius: "14px", padding: "22px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {cardHeader("fa-history", "Shipment History")}
            <div style={{ position: "relative", paddingLeft: "28px" }}>
              <div style={{ position: "absolute", left: "7px", top: "8px", bottom: "8px", width: "2px", background: "#e2e8f0" }}></div>
              <div style={{ position: "relative" }}>
                <div style={{ width: "16px", height: "16px", background: statusMeta.color, borderRadius: "50%", position: "absolute", left: "-31px", top: "2px", border: "3px solid white", boxShadow: `0 0 0 2px ${statusMeta.color}` }}></div>

                {/* Status */}
                <p style={{ fontWeight: 700, color: "#0f172a", fontSize: "14px", textTransform: "uppercase", margin: "0 0 10px" }}>{shipments.status}</p>

                {/* Date + Time row */}
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "8px" }}>
                  {(shipments.historyDate) && (
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#374151", fontSize: "13px", background: "#f1f5f9", padding: "5px 12px", borderRadius: "20px" }}>
                      <i className="fas fa-calendar-alt" style={{ color: "#1e40af", fontSize: "12px" }}></i>
                      {shipments.historyDate}
                    </span>
                  )}
                  {(shipments.historyTime) && (
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#374151", fontSize: "13px", background: "#f1f5f9", padding: "5px 12px", borderRadius: "20px" }}>
                      <i className="fas fa-clock" style={{ color: "#1e40af", fontSize: "12px" }}></i>
                      {shipments.historyTime}
                    </span>
                  )}
                </div>

                {/* Current Location — always show if set */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", padding: "10px 14px", marginBottom: "8px" }}>
                  <i className="fas fa-map-marker-alt" style={{ color: "#1e40af", fontSize: "14px" }}></i>
                  <div>
                    <p style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>Current Location</p>
                    <p style={{ color: "#1e40af", fontWeight: 600, fontSize: "14px", margin: 0 }}>
                      {shipments.heldInCountry || "In Transit"}
                    </p>
                  </div>
                </div>

                <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>
                  <i className="fas fa-user-check" style={{ marginRight: "6px" }}></i>Updated by: Brisa Mullen
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function Page() {
  return (
    <Suspense fallback={
      <div className="loadingStuff">
        <div className="loader">
          <svg className="loader-circle" viewBox="25 25 50 50">
            <circle className="loader-circle-path" cx="50" cy="50" r="20" fill="none" />
          </svg>
          <div className="loader-text">SC</div>
        </div>
      </div>
    }>
      <PageContent />
    </Suspense>
  );
}

export default Page;
