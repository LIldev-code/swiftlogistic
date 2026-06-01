"use client";
import Banner from "@/components/Banner/Banner";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import React, { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

function Page() {
  useEffect(() => {
    Aos.init({ duration: 600, once: false });
  }, []);

  const features = [
    { img: "/images/YOUR-PRODUCTS-ARE-INSURED.webp", icon: "fa-shield-alt", title: "Fully Insured Goods", desc: "Every item stored in our facilities is covered by our active cargo insurance policy, giving you complete peace of mind." },
    { img: "/images/22.000-SQM-STORAGE-SPACE.webp", icon: "fa-warehouse", title: "22,000 SQM Storage", desc: "Our vast warehousing capacity can store cargo of any size and type, organized by perishability and storage requirements." },
    { img: "/images/724-PRIVATE-SECURITY.webp", icon: "fa-lock", title: "24/7 Private Security", desc: "Round-the-clock security personnel and CCTV surveillance keep your goods safe at every hour of the day." },
  ];

  const containerTypes = [
    { icon: "fa-box", label: "General Purpose", desc: "Standard dry containers for most types of cargo." },
    { icon: "fa-boxes", label: "High Cube", desc: "Extra height for bulky or oversized goods." },
    { icon: "fa-snowflake", label: "Refrigerated", desc: "Temperature-controlled for perishable cargo." },
    { icon: "fa-arrow-up", label: "Open Top", desc: "For tall cargo loaded from the top." },
    { icon: "fa-th-large", label: "Flat Racks", desc: "For heavy or wide machinery and equipment." },
    { icon: "fa-water", label: "Tank Containers", desc: "For liquids, gases, and bulk chemicals." },
  ];

  const services = [
    { icon: "fa-boxes", title: "Inventory Management", desc: "Real-time tracking and management of all stored goods with full visibility into stock levels and movements." },
    { icon: "fa-dolly", title: "Pick & Pack", desc: "Professional picking, packing and labelling services with same-day dispatch capability." },
    { icon: "fa-shipping-fast", title: "Same-Day Fulfilment", desc: "Orders placed before cut-off time are picked, packed and dispatched on the same business day." },
    { icon: "fa-thermometer-half", title: "Climate Control", desc: "Temperature and humidity-controlled zones for sensitive pharmaceuticals, food, and electronics." },
  ];

  return (
    <>
      <Navbar />
      <Banner img={"/images/pexels-tomfisk-3076002.jpg"} content={"WAREHOUSE"} />

      {/* ── INTRO ── */}
      <section style={{ padding: "90px 24px", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <div data-aos="fade-right">
            <p style={{ color: "#1e40af", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "12px" }}>Storage Solutions</p>
            <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.2, marginBottom: "22px" }}>
              Secure, Flexible Warehousing for Any Business
            </h2>
            <p style={{ color: "#64748b", lineHeight: 1.8, marginBottom: "18px", fontSize: "15px" }}>
              Swift Logistic offers comprehensive warehousing solutions for businesses of all sizes. Whether you need short-term storage during a move, or long-term bonded warehouse facilities, we have you covered.
            </p>
            <p style={{ color: "#64748b", lineHeight: 1.8, marginBottom: "32px", fontSize: "15px" }}>
              Our modern facilities span 22,000 SQM across strategic locations, equipped with the latest inventory management systems and staffed by experienced logistics professionals around the clock.
            </p>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#1e40af", color: "white", padding: "14px 28px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "15px" }}>
              Request Storage Quote <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <div data-aos="fade-left" style={{ position: "relative", height: "460px" }}>
            <img src="/images/pexels-tomfisk-3076002.jpg" alt="Warehouse operations" style={{ position: "absolute", top: 0, left: 0, width: "68%", height: "74%", objectFit: "cover", borderRadius: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }} />
            <img src="/images/pexels-tima-miroshnichenko-6169057.jpg" alt="Storage facility" style={{ position: "absolute", bottom: 0, right: 0, width: "56%", height: "50%", objectFit: "cover", borderRadius: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }} />
          </div>
        </div>
      </section>

      {/* ── KEY FEATURES ── */}
      <section style={{ padding: "100px 24px", background: "#f0f7ff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ color: "#1e40af", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "10px" }}>Why Store With Us</p>
            <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, color: "#0f172a" }}>What Sets Our Facilities Apart</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "28px" }}>
            {features.map((f, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 100}
                style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", transition: "transform 0.3s, box-shadow 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(30,64,175,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)"; }}
              >
                <div style={{ height: "190px", overflow: "hidden", position: "relative" }}>
                  <img src={f.img} alt={f.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: "16px", left: "16px", background: "#1e40af", color: "white", width: "42px", height: "42px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className={`fas ${f.icon}`} style={{ fontSize: "17px" }}></i>
                  </div>
                </div>
                <div style={{ padding: "26px" }}>
                  <h3 style={{ fontWeight: 700, color: "#0f172a", fontSize: "19px", marginBottom: "10px" }}>{f.title}</h3>
                  <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: "14px" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULFILMENT SERVICES ── */}
      <section style={{ padding: "100px 24px", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ color: "#1e40af", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "10px" }}>Full Service</p>
            <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, color: "#0f172a" }}>Warehousing & Fulfilment Services</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "24px" }}>
            {services.map((s, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 80}
                style={{ padding: "30px 24px", borderRadius: "14px", border: "2px solid #e2e8f0", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#1e40af"; e.currentTarget.style.background = "#f0f7ff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "white"; }}
              >
                <div style={{ width: "56px", height: "56px", background: "rgba(30,64,175,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
                  <i className={`fas ${s.icon}`} style={{ color: "#1e40af", fontSize: "22px" }}></i>
                </div>
                <h3 style={{ fontWeight: 700, color: "#0f172a", fontSize: "17px", marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: "14px" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOVING & STORAGE + CONTAINER TYPES ── */}
      <section style={{ padding: "100px 24px", background: "#0f172a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "70px", alignItems: "start" }}>
          <div data-aos="fade-right">
            <p style={{ color: "#60a5fa", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "12px" }}>Moving & Storage</p>
            <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: "white", marginBottom: "20px" }}>Storage-in-Transit Solutions</h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.8, marginBottom: "18px", fontSize: "15px" }}>
              Planning a move but your new residence is not ready yet? Swift Logistic provides secure storage-in-transit options as part of our complete moving service.
            </p>
            <p style={{ color: "#94a3b8", lineHeight: 1.8, marginBottom: "30px", fontSize: "15px" }}>
              We store your belongings at our secure facilities and move them into your new space the moment you are ready — at no extra hassle to you.
            </p>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#1e40af", color: "white", padding: "13px 26px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "14px" }}>
              Book Storage <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <div data-aos="fade-left">
            <p style={{ color: "#60a5fa", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "12px" }}>Container Types</p>
            <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: "white", marginBottom: "24px" }}>We Have the Right Container</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {containerTypes.map((c, i) => (
                <div key={i} data-aos="fade-up" data-aos-delay={i * 60}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "18px 16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <i className={`fas ${c.icon}`} style={{ color: "#60a5fa", fontSize: "18px", marginTop: "2px", flexShrink: 0 }}></i>
                  <div>
                    <p style={{ color: "white", fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>{c.label}</p>
                    <p style={{ color: "#94a3b8", fontSize: "12px", lineHeight: 1.5 }}>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "linear-gradient(135deg,#1e40af 0%,#1e3a8a 100%)", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "660px", margin: "0 auto" }}>
          <h2 style={{ color: "white", fontSize: "clamp(24px,3vw,38px)", fontWeight: 800, marginBottom: "16px" }}>Need Flexible Storage?</h2>
          <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: "36px" }}>
            Contact our warehousing team for a free consultation and custom storage quote tailored to your business needs.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ background: "white", color: "#1e40af", padding: "14px 32px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "15px" }}>Get a Free Quote</Link>
            <Link href="/logistics" style={{ background: "rgba(255,255,255,0.15)", color: "white", padding: "14px 32px", borderRadius: "8px", fontWeight: 600, textDecoration: "none", fontSize: "15px", border: "1px solid rgba(255,255,255,0.3)" }}>View All Services</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Page;
