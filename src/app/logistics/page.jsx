"use client";
import Banner from "@/components/Banner/Banner";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import React, { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

function Page() {
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    Aos.init({ duration: 600 });
  }, []);

  const services = [
    { img: "/images/pexels-pixabay-358319.jpg", icon: "fa-plane", title: "Air Freight", desc: "Express and economy air cargo solutions to 150+ destinations worldwide. Real-time tracking, door-to-door delivery, and full insurance included." },
    { img: "/images/pexels-tomfisk-3057960.jpg", icon: "fa-ship", title: "Ocean Freight", desc: "FCL and LCL container shipping across all major global sea routes. Competitive rates, reliable transit times, and expert customs handling." },
    { img: "/images/pexels-lara-jameson-8828616.jpg", icon: "fa-truck", title: "Road Freight", desc: "FTL and LTL trucking solutions spanning domestic and international cross-border routes, with GPS tracking and flexible scheduling." },
    { img: "/images/pexels-tima-miroshnichenko-6169057.jpg", icon: "fa-warehouse", title: "Warehousing", desc: "Secure, temperature-controlled storage facilities with full inventory management, pick-and-pack, and same-day fulfilment services." },
    { img: "/images/pexels-janamparikh-15947631.jpg", icon: "fa-file-invoice", title: "Customs Clearance", desc: "Our licensed customs brokers handle all documentation, duties, and compliance requirements to ensure smooth cross-border shipments." },
    { img: "/images/pexels-carlo-junemann-156928830-16015233.jpg", icon: "fa-project-diagram", title: "Project Cargo", desc: "Specialized end-to-end management for oversized, heavy-lift, and high-value project shipments requiring bespoke logistics planning." },
  ];

  const accordion = [
    { title: "Parcel Delivery", body: "SwiftCargo has been moving your goods since 2010 and is committed to providing a great service every time. We handle everything from small documents to large commercial freight." },
    { title: "International Freight", body: "Send freight internationally with our global network. From Europe to Asia, Americas to Africa — we have partnerships with carriers on every major trade lane offering the best possible rates." },
    { title: "Customs & Compliance", body: "Our expert customs brokerage team handles all documentation, import/export compliance, and duty payments so your cargo clears borders without delays." },
    { title: "Fulfilment Services", body: "We store your inventory at our depots and ship directly to your customers. Flexible, scalable fulfilment that grows with your business — including same-day dispatch." },
    { title: "Supply Chain Visibility", body: "Our digital platform gives you end-to-end supply chain visibility with live dashboards, automated alerts, and data analytics to help you make smarter logistics decisions." },
  ];

  const process = [
    { icon: "fa-clipboard-list", step: "01", title: "Get a Quote", desc: "Submit your shipment details and receive a competitive quote within hours." },
    { icon: "fa-box", step: "02", title: "Book & Prepare", desc: "Confirm your booking and our team prepares all documentation and pickup." },
    { icon: "fa-shipping-fast", step: "03", title: "Shipment in Transit", desc: "Your cargo moves through our global network with full real-time tracking." },
    { icon: "fa-check-circle", step: "04", title: "Delivered", desc: "Safe, on-time delivery to the final destination with proof of delivery." },
  ];

  return (
    <>
      <Navbar />
      <Banner img={"/images/pexels-olly-3769138.jpg"} content={"LOGISTICS"} height={"30vh"} />

      {/* ── INTRO ── */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#1e40af", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "12px" }}>Our Logistics Solutions</p>
          <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: "#0f172a", marginBottom: "20px" }}>
            End-to-End Freight Services for Every Need
          </h2>
          <p style={{ color: "#64748b", lineHeight: 1.8, fontSize: "15px", maxWidth: "700px", margin: "0 auto" }}>
            Whether you need road, air, ocean, or rail — SwiftCargo provides optimised, cost-effective freight solutions with real-time visibility. Our experienced team ensures your cargo moves efficiently from origin to destination.
          </p>
        </div>
      </section>

      {/* ── SERVICE CARDS ── */}
      <section style={{ padding: "20px 24px 100px", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "28px" }}>
          {services.map((svc, i) => (
            <div key={i} data-aos="fade-up" data-aos-delay={i * 80}
              style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", background: "white", transition: "transform 0.3s, box-shadow 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(30,64,175,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)"; }}
            >
              <div style={{ height: "210px", overflow: "hidden", position: "relative" }}>
                <img src={svc.img} alt={svc.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,23,42,0.5) 0%,transparent 60%)" }}></div>
                <div style={{ position: "absolute", top: "16px", left: "16px", background: "#1e40af", color: "white", width: "42px", height: "42px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className={`fas ${svc.icon}`} style={{ fontSize: "17px" }}></i>
                </div>
              </div>
              <div style={{ padding: "26px" }}>
                <h3 style={{ fontWeight: 700, color: "#0f172a", fontSize: "19px", marginBottom: "10px" }}>{svc.title}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: "14px", marginBottom: "18px" }}>{svc.desc}</p>
                <Link href="/contact" style={{ color: "#1e40af", fontWeight: 600, fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  Get a Quote <i className="fas fa-arrow-right" style={{ fontSize: "11px" }}></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "100px 24px", background: "#f0f7ff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ color: "#1e40af", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "10px" }}>Simple Process</p>
            <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, color: "#0f172a" }}>How It Works</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "32px" }}>
            {process.map((p, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 100} style={{ textAlign: "center", position: "relative" }}>
                <div style={{ width: "80px", height: "80px", background: "#1e40af", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 8px 30px rgba(30,64,175,0.3)" }}>
                  <i className={`fas ${p.icon}`} style={{ color: "white", fontSize: "28px" }}></i>
                </div>
                <div style={{ position: "absolute", top: "28px", left: "0", width: "28px", height: "28px", background: "#0f172a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "white", fontSize: "11px", fontWeight: 700 }}>{p.step}</span>
                </div>
                <h3 style={{ fontWeight: 700, color: "#0f172a", fontSize: "18px", marginBottom: "10px" }}>{p.title}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: "14px" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARALLAX IMAGE + FAQ ACCORDION ── */}
      <section style={{ padding: "100px 24px", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>
          <div data-aos="fade-right" style={{ borderRadius: "16px", overflow: "hidden", height: "520px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>
            <img src="/images/pexels-dibert-1117211.jpg" alt="Logistics operations" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div data-aos="fade-left">
            <p style={{ color: "#1e40af", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "12px" }}>Common Questions</p>
            <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: "#0f172a", marginBottom: "30px" }}>What We Handle</h2>
            {accordion.map((item, i) => (
              <div key={i} style={{ borderBottom: "1px solid #e2e8f0", marginBottom: "4px" }}>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <span style={{ fontWeight: 600, color: "#0f172a", fontSize: "16px" }}>{item.title}</span>
                  <i className={`fas fa-${activeAccordion === i ? "minus" : "plus"}`} style={{ color: "#1e40af", fontSize: "14px", flexShrink: 0 }}></i>
                </button>
                {activeAccordion === i && (
                  <p style={{ color: "#64748b", lineHeight: 1.7, paddingBottom: "18px", fontSize: "14px" }}>{item.body}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "linear-gradient(135deg,#1e40af 0%,#1e3a8a 100%)", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "660px", margin: "0 auto" }}>
          <h2 style={{ color: "white", fontSize: "clamp(24px,3vw,38px)", fontWeight: 800, marginBottom: "16px" }}>Ship Smarter With SwiftCargo</h2>
          <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: "36px" }}>Get a tailored freight solution from our logistics experts today.</p>
          <Link href="/contact" style={{ background: "white", color: "#1e40af", padding: "14px 36px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "15px" }}>Request a Quote</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Page;
