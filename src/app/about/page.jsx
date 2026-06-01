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
    Aos.init({ duration: 800, once: false, mirror: true });
  }, []);

  const stats = [
    { value: "15+", label: "Years in Business" },
    { value: "150+", label: "Countries Covered" },
    { value: "9M+", label: "Packages Delivered" },
    { value: "99%", label: "On-Time Delivery" },
  ];

  const values = [
    { icon: "fa-bullseye", title: "Our Mission", text: "To simplify global freight for every business and individual by delivering fast, secure and reliable logistics solutions worldwide." },
    { icon: "fa-eye", title: "Our Vision", text: "To become the most trusted logistics partner across every continent, powered by technology and driven by people." },
    { icon: "fa-handshake", title: "Our Values", text: "Integrity, innovation, and customer obsession guide every decision we make — from pickup to final delivery." },
  ];

  const services = [
    { icon: "fa-plane", label: "Air Freight" },
    { icon: "fa-ship", label: "Ocean Freight" },
    { icon: "fa-truck", label: "Road Freight" },
    { icon: "fa-train", label: "Rail Freight" },
    { icon: "fa-warehouse", label: "Warehousing" },
    { icon: "fa-file-alt", label: "Customs Clearance" },
    { icon: "fa-box-open", label: "Project Cargo" },
    { icon: "fa-shield-alt", label: "Cargo Insurance" },
  ];

  const team = [
    { img: "/images/pexels-olly-3769138.jpg", name: "Operations Team", desc: "Our global ops team coordinates thousands of shipments daily across 150+ countries." },
    { img: "/images/pexels-tima-miroshnichenko-6169137.jpg", name: "Warehouse Team", desc: "Expert warehouse staff handling storage, sorting and fulfilment at major logistics hubs." },
    { img: "/images/pexels-rdne-7363161.jpg", name: "Customer Support", desc: "Dedicated agents available around the clock to keep you updated every step of the way." },
  ];

  return (
    <>
      <Navbar />
      <Banner img={"/images/pexels-pixabay-262353.jpg"} content={"ABOUT US"} height={"30vh"} />

      {/* ── INTRO ── */}
      <section style={{ padding: "90px 24px", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <div data-aos="fade-right">
            <p style={{ color: "#1e40af", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "12px" }}>Who We Are</p>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.2, marginBottom: "24px" }}>
              Connecting the World Through Smarter Logistics
            </h2>
            <p style={{ color: "#64748b", lineHeight: 1.8, marginBottom: "18px", fontSize: "15px" }}>
              Swift Logistic was founded with a vision to simplify global freight for businesses and individuals. Operating as a fully licensed customs clearing and logistics company, we have expanded to offer a full suite of freight services across air, sea, road and rail.
            </p>
            <p style={{ color: "#64748b", lineHeight: 1.8, marginBottom: "32px", fontSize: "15px" }}>
              Our logistics network spans major ports and airports across Africa, Europe, Asia, and the Americas. We operate a modern fleet serving thousands of shipments per year, trusted by businesses for reliable, on-time global delivery.
            </p>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#1e40af", color: "white", padding: "14px 28px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "15px" }}>
              Get In Touch <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <div data-aos="fade-left" style={{ position: "relative", height: "480px" }}>
            <img src="/images/pexels-bernard-foss-3049419-4620555.jpg" alt="Swift Logistic operations" style={{ position: "absolute", top: 0, left: 0, width: "72%", height: "78%", objectFit: "cover", borderRadius: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }} />
            <img src="/images/pexels-tima-miroshnichenko-6169057.jpg" alt="Warehouse" style={{ position: "absolute", bottom: 0, right: 0, width: "58%", height: "50%", objectFit: "cover", borderRadius: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }} />
            <div style={{ position: "absolute", bottom: "27%", left: "52%", background: "#1e40af", color: "white", borderRadius: "12px", padding: "16px 20px", textAlign: "center", zIndex: 2, minWidth: "130px", boxShadow: "0 10px 30px rgba(30,64,175,0.4)" }}>
              <div style={{ fontSize: "26px", fontWeight: 800 }}>15+</div>
              <div style={{ fontSize: "12px", opacity: 0.85 }}>Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: "#0f172a", padding: "60px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "40px", textAlign: "center" }}>
          {stats.map((s, i) => (
            <div key={i} data-aos="fade-up" data-aos-delay={i * 100}>
              <div style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 800, color: "white", marginBottom: "8px" }}>{s.value}</div>
              <p style={{ color: "#94a3b8", fontSize: "15px", fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSION / VISION / VALUES ── */}
      <section style={{ padding: "100px 24px", background: "#f0f7ff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ color: "#1e40af", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "10px" }}>What Drives Us</p>
            <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, color: "#0f172a" }}>Mission, Vision & Values</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "28px" }}>
            {values.map((v, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 100} style={{ background: "white", borderRadius: "16px", padding: "36px 28px", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", borderTop: "4px solid #1e40af" }}>
                <div style={{ width: "60px", height: "60px", background: "rgba(30,64,175,0.1)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <i className={`fas ${v.icon}`} style={{ color: "#1e40af", fontSize: "24px" }}></i>
                </div>
                <h3 style={{ fontWeight: 700, color: "#0f172a", fontSize: "20px", marginBottom: "12px" }}>{v.title}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.7 }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES WE OFFER ── */}
      <section style={{ padding: "100px 24px", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ color: "#1e40af", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "10px" }}>Full Suite of Services</p>
            <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, color: "#0f172a" }}>What We Do</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "20px" }}>
            {services.map((svc, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 60} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "28px 16px", borderRadius: "14px", border: "2px solid #e2e8f0", textAlign: "center", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#1e40af"; e.currentTarget.style.background = "#f0f7ff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "white"; }}
              >
                <div style={{ width: "56px", height: "56px", background: "rgba(30,64,175,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className={`fas ${svc.icon}`} style={{ color: "#1e40af", fontSize: "22px" }}></i>
                </div>
                <p style={{ fontWeight: 600, color: "#0f172a", fontSize: "15px" }}>{svc.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM / OPERATIONS ── */}
      <section style={{ padding: "100px 24px", background: "#f0f7ff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ color: "#1e40af", fontWeight: 700, letterSpacing: "3px", fontSize: "13px", textTransform: "uppercase", marginBottom: "10px" }}>The People Behind Swift Logistic</p>
            <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, color: "#0f172a" }}>Our Teams</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "28px" }}>
            {team.map((t, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 100} style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
                <div style={{ height: "220px", overflow: "hidden" }}>
                  <img src={t.img} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  />
                </div>
                <div style={{ padding: "24px" }}>
                  <h3 style={{ fontWeight: 700, color: "#0f172a", fontSize: "18px", marginBottom: "10px" }}>{t.name}</h3>
                  <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: "14px" }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "linear-gradient(135deg,#1e40af 0%,#1e3a8a 100%)", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "660px", margin: "0 auto" }}>
          <h2 style={{ color: "white", fontSize: "clamp(24px,3vw,38px)", fontWeight: 800, marginBottom: "16px" }}>Ready to Work With Us?</h2>
          <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: "36px" }}>
            Contact our team today and discover why businesses across the globe choose Swift Logistic as their freight partner.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ background: "white", color: "#1e40af", padding: "14px 32px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "15px" }}>Contact Us</Link>
            <Link href="/" style={{ background: "rgba(255,255,255,0.15)", color: "white", padding: "14px 32px", borderRadius: "8px", fontWeight: 600, textDecoration: "none", fontSize: "15px", border: "1px solid rgba(255,255,255,0.3)" }}>Back to Home</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Page;
