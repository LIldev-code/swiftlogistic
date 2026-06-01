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
          <div className="loader-text">SL</div>
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

  return (
    <>
      <main ref={printRef} style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "30px", paddingBottom: "60px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }}>

          {/* Header bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "4px" }}>Tracking Number</p>
              <h1 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, color: "#0f172a" }}>{trackingNumber}</h1>
            </div>
            <button onClick={handlePrint} className="hide-when-printing" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1e40af", color: "white", border: "none", borderRadius: "8px", padding: "12px 22px", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}>
              <i className="fas fa-print"></i> Print Result
            </button>
          </div>

          {/* Status badge */}
          <div style={{ background: statusMeta.bg, borderRadius: "14px", padding: "20px 28px", display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
            <div style={{ width: "52px", height: "52px", background: statusMeta.color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className={`fas ${statusMeta.icon}`} style={{ color: "white", fontSize: "20px" }}></i>
            </div>
            <div>
              <p style={{ color: "#64748b", fontSize: "12px", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "1px" }}>Current Status</p>
              <p style={{ color: statusMeta.color, fontWeight: 800, fontSize: "20px", textTransform: "uppercase" }}>{shipments.status}</p>
            </div>
          </div>

          {/* Barcode + logo strip */}
          <div style={{ background: "white", borderRadius: "14px", padding: "24px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <img src="/images/swiftargo.png" alt="SwiftCargo" style={{ height: "60px", objectFit: "contain" }} />
            <div style={{ flex: 1 }}>
              <Barcode trackingNumber={trackingNumber} />
            </div>
          </div>

          {/* Two-column: Shipper + Receiver */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            {[
              { title: "Shipper Information", icon: "fa-user-tie", data: [shipments.sender, shipments.senderAddress, shipments.senderNumber, shipments.senderEmail] },
              { title: "Receiver Information", icon: "fa-user", data: [shipments.receiver, shipments.receiverEmail, shipments.receiverNumber, shipments.receiverAddress] },
            ].map((col, i) => (
              <div key={i} style={{ background: "white", borderRadius: "14px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "14px", borderBottom: "2px solid #f1f5f9" }}>
                  <div style={{ width: "36px", height: "36px", background: "rgba(30,64,175,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className={`fas ${col.icon}`} style={{ color: "#1e40af", fontSize: "15px" }}></i>
                  </div>
                  <h3 style={{ fontWeight: 700, color: "#0f172a", fontSize: "16px" }}>{col.title}</h3>
                </div>
                {col.data.map((val, j) => val && (
                  <p key={j} style={{ color: "#374151", fontSize: "14px", marginBottom: "8px", lineHeight: 1.5 }}>{val}</p>
                ))}
              </div>
            ))}
          </div>

          {/* Shipment Details */}
          <div style={{ background: "white", borderRadius: "14px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "14px", borderBottom: "2px solid #f1f5f9" }}>
              <div style={{ width: "36px", height: "36px", background: "rgba(30,64,175,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fas fa-info-circle" style={{ color: "#1e40af", fontSize: "15px" }}></i>
              </div>
              <h3 style={{ fontWeight: 700, color: "#0f172a", fontSize: "16px" }}>Shipment Information</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
              <InfoRow label="Origin" value={shipments.origin} />
              <InfoRow label="Destination" value={shipments.destination} />
              <InfoRow label="Shipment Type" value={shipments.shipmentType} />
              <InfoRow label="Weight" value={shipments.weight ? `${shipments.weight} kg` : null} />
              <InfoRow label="Packages" value={shipments.packages} />
              <InfoRow label="Shipping Mode" value={shipments.mode} />
              <InfoRow label="Carrier" value={shipments.carrier} />
              <InfoRow label="Payment Method" value={shipments.paymentMethod} />
              <InfoRow label="Total Freight" value={shipments.totalFreight} />
              <InfoRow label="Expected Delivery" value={shipments.expectedDeliveryDate} />
              <InfoRow label="Pickup Date" value={shipments.pickupDate} />
              <InfoRow label="Carrier Ref No." value={shipments.carrierReferenceNo} />
              <InfoRow label="Departure Date" value={shipments.departureDate} hide />
              <InfoRow label="Departure Time" value={shipments.departureTime} hide />
              <InfoRow label="Pickup Time" value={shipments.pickupTime} hide />
              {shipments.comments && <InfoRow label="Comments" value={shipments.comments} />}
            </div>
          </div>

          {/* Package Dimensions */}
          {((shipments.length && shipments.length !== "3") || (shipments.width && shipments.width !== "4") || (shipments.height && shipments.height !== "4") || (shipments.productWeight && shipments.productWeight !== "0.3")) && (
            <div style={{ background: "white", borderRadius: "14px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "14px", borderBottom: "2px solid #f1f5f9" }}>
                <div style={{ width: "36px", height: "36px", background: "rgba(30,64,175,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fas fa-box" style={{ color: "#1e40af", fontSize: "15px" }}></i>
                </div>
                <h3 style={{ fontWeight: 700, color: "#0f172a", fontSize: "16px" }}>Package Details</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
                {shipments.productQuantity && shipments.productQuantity !== "3" && <InfoRow label="Quantity" value={shipments.productQuantity} />}
                {shipments.description && shipments.description !== "GOOD" && <InfoRow label="Description" value={shipments.description} />}
                {shipments.length && shipments.length !== "3" && <InfoRow label="Length (cm)" value={shipments.length} />}
                {shipments.width && shipments.width !== "4" && <InfoRow label="Width (cm)" value={shipments.width} />}
                {shipments.height && shipments.height !== "4" && <InfoRow label="Height (cm)" value={shipments.height} />}
                {shipments.productWeight && shipments.productWeight !== "0.3" && <InfoRow label="Weight (g)" value={shipments.productWeight} />}
              </div>
            </div>
          )}

          {/* Map */}
          {senderCoords && receiverCoords && (
            <div style={{ background: "white", borderRadius: "14px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "14px", borderBottom: "2px solid #f1f5f9" }}>
                <div style={{ width: "36px", height: "36px", background: "rgba(30,64,175,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fas fa-map-marked-alt" style={{ color: "#1e40af", fontSize: "15px" }}></i>
                </div>
                <h3 style={{ fontWeight: 700, color: "#0f172a", fontSize: "16px" }}>Package Route</h3>
              </div>
              <MapComponent senderCoords={senderCoords} receiverCoords={receiverCoords} trackingNumber={trackingNumber} />
            </div>
          )}

          {/* Shipment History */}
          <div style={{ background: "white", borderRadius: "14px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "14px", borderBottom: "2px solid #f1f5f9" }}>
              <div style={{ width: "36px", height: "36px", background: "rgba(30,64,175,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fas fa-history" style={{ color: "#1e40af", fontSize: "15px" }}></i>
              </div>
              <h3 style={{ fontWeight: 700, color: "#0f172a", fontSize: "16px" }}>Shipment History</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "12px", height: "12px", background: "#1e40af", borderRadius: "50%", marginTop: "4px", flexShrink: 0 }}></div>
                <div>
                  <p style={{ fontWeight: 600, color: "#0f172a", textTransform: "uppercase", marginBottom: "2px" }}>{shipments.status}</p>
                  <p className="hide-when-printing" style={{ color: "#64748b", fontSize: "13px" }}>{shipments.historyTime ? shipments.historyTime : shipments.departureTime}</p>
                  {shipments.heldInCountry && <p style={{ color: "#1e40af", fontSize: "13px", fontWeight: 600 }}>Location: {shipments.heldInCountry}</p>}
                  <p style={{ color: "#94a3b8", fontSize: "12px" }}>Updated by: William Fred</p>
                </div>
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
          <div className="loader-text">SL</div>
        </div>
      </div>
    }>
      <PageContent />
    </Suspense>
  );
}

export default Page;
