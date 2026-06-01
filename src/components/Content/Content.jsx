"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./Content.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ShipmentContext from "@/contexts/ShipmentContext";

const Counter = ({ start, end, duration }) => {
  const [count, setCount] = useState(start);
  const ref = useRef();
  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [start, end, duration]);
  return <span ref={ref}>{count.toLocaleString()}</span>;
};

const galleryImages = [
  "/images/pexels-tima-miroshnichenko-6169650.jpg",
  "/images/pexels-tima-miroshnichenko-6169591.jpg",
  "/images/pexels-rdne-7363161.jpg",
  "/images/pexels-thom-gonzalez-3126166-6026765.jpg",
  "/images/pexels-pat-whelen-2913248-5615436.jpg",
  "/images/pexels-tima-miroshnichenko-6169668.jpg",
  "/images/pexels-carloscruz-artegrafia-172084181-11087837.jpg",
];

const testimonials = [
  { img: "/images/Faces-400x400px-1_1_07-thegem-person.webp", name: "James Okonkwo", role: "Business Owner", text: "SwiftCargo delivered my cargo ahead of schedule. Pricing was transparent and their team was always reachable. Genuinely the best logistics partner I have worked with." },
  { img: "/images/Faces-400x400px-1_1_18-thegem-person.webp", name: "Sarah Mitchell", role: "E-Commerce Merchant", text: "Moving my business inventory across continents was daunting, but SwiftCargo made it seamless. Every step was communicated clearly. Highly recommend for international freight." },
  { img: "/images/Faces-400x400px-1_1_28-thegem-person.webp", name: "Carlos Mendes", role: "Import/Export Manager", text: "I have used SwiftCargo for over two years. Their service is top-notch with prompt deliveries, excellent support, and reliable tracking at every stage." },
  { img: "/images/gettyimages-1219356771-640x640.jpg", name: "Fatima Al-Hassan", role: "Supply Chain Director", text: "SwiftCargo transported our vehicle fleet from the USA to Europe with zero damage and ahead of schedule. Smooth, stress-free, and great value." },
];

function Content() {
  const navigate = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef();
  const [loading, setLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [activeTesti, setActiveTesti] = useState(0);
  const { setShipments } = useContext(ShipmentContext);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError(null);
    setShipments(null);
    try {
      const res = await fetch("/api/getShipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber }),
      });
      if (res.status === 200) {
        const data = await res.json();
        setShipments(data.shipmentData);
        navigate.push(`/shipment?num=${trackingNumber}`);
      } else if (res.status === 400) {
        setError("Invalid tracking number. Please check and try again.");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Shipment not found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    if (statsRef.current) observer.observe(statsRef.current);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTesti((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ── TRACKING SECTION ── */}
      <section id="track" style={{ background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)", padding: "80px 0 60px", position: "relative" }}>
        {loading && (
          <div className="loadingStuff">
            <div className="loader">
              <svg className="loader-circle" viewBox="25 25 50 50">
                <circle className="loader-circle-path" cx="50" cy="50" r="20" fill="none" />
              </svg>
              <div className="loader-text">SL</div>
            </div>
          </div>
        )}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <p style={{ color: "#1e40af", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "10px" }}>Real-Time Tracking</p>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: "#0f172a", marginBottom: "14px" }}>Track Your Shipment Instantly</h2>
            <p style={{ color: "#64748b", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>Enter your tracking number below to get live updates on your package location and estimated delivery.</p>
          </div>
          <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 20px 60px rgba(30,64,175,0.12)", padding: "40px", maxWidth: "700px", margin: "0 auto 60px" }}>
            <form onSubmit={handleTrack} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#f1f5f9", borderRadius: "10px", padding: "0 16px", minWidth: "220px" }}>
                <i className="fas fa-search" style={{ color: "#94a3b8", marginRight: "10px" }}></i>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter Tracking Number (e.g. SL-123456)"
                  required
                  style={{ border: "none", background: "transparent", outline: "none", padding: "16px 0", width: "100%", fontSize: "14px", color: "#0f172a" }}
                />
              </div>
              <button type="submit" style={{ background: "#1e40af", color: "white", border: "none", borderRadius: "10px", padding: "0 32px", fontWeight: 700, fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", minHeight: "54px" }}>
                <i className="fas fa-satellite-dish"></i> Track
              </button>
            </form>
            {error && <p style={{ color: "#ef4444", marginTop: "12px", fontSize: "13px" }}><i className="fas fa-exclamation-circle" style={{ marginRight: "6px" }}></i>{error}</p>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "24px" }}>
            {[
              { icon: "fa-globe-americas", title: "Global Coverage", desc: "Track shipments in 150+ countries with our worldwide logistics network." },
              { icon: "fa-clock", title: "Real-Time Updates", desc: "Live status updates at every stage, from pickup to final delivery." },
              { icon: "fa-shield-alt", title: "Secure & Insured", desc: "All shipments are protected with advanced security and full insurance options." },
            ].map((card, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 100} style={{ background: "white", borderRadius: "12px", padding: "28px", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", borderTop: "4px solid #1e40af" }}>
                <div style={{ width: "54px", height: "54px", background: "rgba(30,64,175,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <i className={`fas ${card.icon}`} style={{ color: "#1e40af", fontSize: "22px" }}></i>
                </div>
                <h3 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "8px", fontSize: "17px" }}>{card.title}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: "14px" }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section ref={statsRef} style={{ background: "#0f172a", color: "white", padding: "60px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "40px", textAlign: "center" }}>
          {[
            { end: 9004360, label: "Packages Delivered", icon: "fa-box" },
            { end: 8029976, label: "Satisfied Customers", icon: "fa-users" },
            { end: 150, label: "Countries Covered", icon: "fa-globe" },
            { end: 990909, label: "Commercial Goods", icon: "fa-cubes" },
          ].map((stat, i) => (
            <div key={i}>
              <i className={`fas ${stat.icon}`} style={{ fontSize: "32px", color: "#60a5fa", marginBottom: "12px" }}></i>
              <div style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, color: "white", marginBottom: "6px" }}>
                {isVisible ? <Counter start={0} end={stat.end} duration={2500} /> : "0"}+
              </div>
              <p style={{ color: "#94a3b8", fontSize: "15px", fontWeight: 500 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section style={{ padding: "100px 24px", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <div data-aos="fade-right" style={{ position: "relative", height: "520px" }}>
            <img src="/images/pexels-tima-miroshnichenko-6169137.jpg" alt="Operations" style={{ position: "absolute", top: 0, left: 0, width: "70%", height: "75%", objectFit: "cover", borderRadius: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }} />
            <img src="/images/pexels-bernard-foss-3049419-4620555.jpg" alt="Shipping" style={{ position: "absolute", bottom: 0, right: 0, width: "60%", height: "55%", objectFit: "cover", borderRadius: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }} />
            <div style={{ position: "absolute", bottom: "28%", left: "50%", background: "#1e40af", color: "white", borderRadius: "12px", padding: "16px 20px", textAlign: "center", zIndex: 2, minWidth: "130px", boxShadow: "0 10px 30px rgba(30,64,175,0.4)" }}>
              <div style={{ fontSize: "26px", fontWeight: 800 }}>15+</div>
              <div style={{ fontSize: "12px", opacity: 0.85 }}>Years Experience</div>
            </div>
          </div>
          <div data-aos="fade-left">
            <p style={{ color: "#1e40af", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "12px" }}>Why Choose Us</p>
            <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.25, marginBottom: "20px" }}>We Are Your Trusted Global Logistics Partner</h2>
            <p style={{ color: "#64748b", lineHeight: 1.8, marginBottom: "30px" }}>SwiftCargo delivers fast, secure and reliable freight solutions by air, sea and road. With coverage in over 150 countries, our expert team ensures your cargo arrives on time, every time.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "36px" }}>
              {[
                "Door-to-door delivery across 150+ countries",
                "Real-time shipment tracking 24/7",
                "Fully insured cargo for your peace of mind",
                "Customs clearance handled by our experts",
                "Dedicated account manager for every client",
              ].map((point, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ width: "24px", height: "24px", background: "rgba(30,64,175,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                    <i className="fas fa-check" style={{ color: "#1e40af", fontSize: "11px" }}></i>
                  </div>
                  <p style={{ color: "#374151", lineHeight: 1.5 }}>{point}</p>
                </div>
              ))}
            </div>
            <Link href="/about" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#1e40af", color: "white", padding: "14px 28px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "15px" }}>
              Learn More <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section style={{ padding: "100px 24px", background: "#f0f7ff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ color: "#1e40af", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "10px" }}>What We Offer</p>
            <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, color: "#0f172a", marginBottom: "14px" }}>Our Logistics Services</h2>
            <p style={{ color: "#64748b", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>From a single parcel to full container loads, we have a service for every shipping need.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "28px" }}>
            {[
              { img: "/images/pexels-pixabay-358319.jpg", icon: "fa-plane", title: "Air Freight", desc: "Express and economy air cargo to over 150 destinations. Fast, traceable, fully insured." },
              { img: "/images/pexels-tomfisk-3057960.jpg", icon: "fa-ship", title: "Ocean Freight", desc: "FCL and LCL container services on all major global sea routes. Affordable and reliable." },
              { img: "/images/pexels-lara-jameson-8828616.jpg", icon: "fa-truck", title: "Road Freight", desc: "FTL and LTL trucking solutions across domestic and cross-border routes." },
              { img: "/images/pexels-tima-miroshnichenko-6169057.jpg", icon: "fa-warehouse", title: "Warehousing", desc: "Secure storage with inventory management and fulfilment at major hubs." },
              { img: "/images/pexels-janamparikh-15947631.jpg", icon: "fa-file-invoice", title: "Customs Clearance", desc: "Expert customs brokerage for smooth and compliant cross-border shipments." },
              { img: "/images/pexels-carlo-junemann-156928830-16015233.jpg", icon: "fa-project-diagram", title: "Project Cargo", desc: "Specialized handling for oversized, heavy-lift and high-value shipments." },
            ].map((svc, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", transition: "transform 0.3s, box-shadow 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(30,64,175,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)"; }}
              >
                <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                  <img src={svc.img} alt={svc.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: "16px", left: "16px", background: "#1e40af", color: "white", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className={`fas ${svc.icon}`} style={{ fontSize: "16px" }}></i>
                  </div>
                </div>
                <div style={{ padding: "24px" }}>
                  <h3 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "10px", fontSize: "18px" }}>{svc.title}</h3>
                  <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: "14px", marginBottom: "16px" }}>{svc.desc}</p>
                  <Link href="/logistics" style={{ color: "#1e40af", fontWeight: 600, fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    Learn More <i className="fas fa-arrow-right" style={{ fontSize: "11px" }}></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section style={{ padding: "100px 24px", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <p style={{ color: "#1e40af", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "10px" }}>Our Operations</p>
            <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, color: "#0f172a" }}>A Glimpse Into Our World</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", gridAutoRows: "220px" }}>
            {galleryImages.map((src, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 60}
                style={{ gridColumn: (i === 0 || i === 4) ? "span 2" : "span 1", borderRadius: "12px", overflow: "hidden", position: "relative" }}
              >
                <img
                  src={src}
                  alt={`operations-${i}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s", display: "block" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,23,42,0.35) 0%,transparent 60%)" }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "100px 24px", background: "#0f172a" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ color: "#60a5fa", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "10px" }}>Client Stories</p>
            <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, color: "white" }}>What Our Customers Say</h2>
          </div>
          <div style={{ position: "relative", minHeight: "260px" }}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  position: i === activeTesti ? "relative" : "absolute",
                  opacity: i === activeTesti ? 1 : 0,
                  transition: "opacity 0.6s ease",
                  pointerEvents: i === activeTesti ? "auto" : "none",
                  top: 0, left: 0, width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "20px",
                  padding: "40px 48px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <i className="fas fa-quote-left" style={{ color: "#1e40af", fontSize: "36px", marginBottom: "20px" }}></i>
                <p style={{ color: "#cbd5e1", lineHeight: 1.8, fontSize: "16px", marginBottom: "28px" }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <img src={t.img} alt={t.name} style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", border: "3px solid #1e40af" }} />
                  <div>
                    <p style={{ color: "white", fontWeight: 700, marginBottom: "2px" }}>{t.name}</p>
                    <p style={{ color: "#60a5fa", fontSize: "13px" }}>{t.role}</p>
                  </div>
                  <div style={{ marginLeft: "auto", color: "#fbbf24", fontSize: "18px" }}>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "36px" }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTesti(i)}
                style={{ width: activeTesti === i ? "28px" : "10px", height: "10px", borderRadius: "5px", background: activeTesti === i ? "#1e40af" : "rgba(255,255,255,0.3)", border: "none", cursor: "pointer", transition: "all 0.4s", padding: 0 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ background: "linear-gradient(135deg,#1e40af 0%,#1e3a8a 100%)", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ color: "white", fontSize: "clamp(26px,3vw,40px)", fontWeight: 800, marginBottom: "16px" }}>Ready to Ship With Confidence?</h2>
          <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: "36px", fontSize: "16px" }}>Get a free quote today and experience why thousands of businesses trust SwiftCargo for their global freight needs.</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ background: "white", color: "#1e40af", padding: "14px 32px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "15px" }}>Get a Free Quote</Link>
            <Link href="/about" style={{ background: "rgba(255,255,255,0.15)", color: "white", padding: "14px 32px", borderRadius: "8px", fontWeight: 600, textDecoration: "none", fontSize: "15px", border: "1px solid rgba(255,255,255,0.3)" }}>Learn About Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Content;
