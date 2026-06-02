"use client";

import Banner from "@/components/Banner/Banner";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import React, { useState } from "react";

function Page() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setSubmitted(true);
      setFormData({ firstName: "", lastName: "", email: "", address: "", message: "" });
    } catch (err) {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSending(false);
    }
  };

  const infoItems = [
    { icon: "fa-envelope", label: "Email Us", value: "hello@swiftcargo.com", href: "mailto:hello@swiftcargo.com" },
    { icon: "fa-globe", label: "Website", value: "swiftcargo.com", href: "https://swiftcargo.com" },
    { icon: "fa-clock", label: "Support Hours", value: "Mon–Fri, 8am – 6pm", href: null },
    { icon: "fa-shipping-fast", label: "Track a Shipment", value: "Use our live tracker on the homepage", href: "/#track" },
  ];


  const inputStyle = {
    width: "100%",
    padding: "9px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "#1e40af";
    e.target.style.boxShadow = "0 0 0 3px rgba(30,64,175,0.1)";
    e.target.style.background = "white";
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.boxShadow = "none";
    e.target.style.background = "#f8fafc";
  };

  return (
    <>
      <Navbar />
      <Banner img={"/images/pexels-pixabay-269790.jpg"} content={"CONTACT US"} />

      {/* ── INFO STRIP ── */}
      <section style={{ background: "#0f172a", padding: "0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
          {infoItems.map((item, i) => (
            <div key={i} style={{
              padding: "28px 24px",
              borderRight: i < infoItems.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              display: "flex", alignItems: "flex-start", gap: "16px",
            }}>
              <div style={{ width: "44px", height: "44px", background: "rgba(30,64,175,0.3)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={`fas ${item.icon}`} style={{ color: "#60a5fa", fontSize: "18px" }}></i>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{item.label}</p>
                {item.href ? (
                  <a href={item.href} style={{ color: "white", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>{item.value}</a>
                ) : (
                  <p style={{ color: "white", fontSize: "14px", fontWeight: 500 }}>{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN CONTACT SECTION ── */}
      <section style={{ background: "#f0f7ff", padding: "50px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "40px", alignItems: "stretch" }}>

          {/* LEFT — Info card */}
          <div style={{ background: "linear-gradient(160deg,#1e3a8a 0%,#1e40af 100%)", borderRadius: "20px", padding: "32px 28px", color: "white" }}>
            <p style={{ color: "#93c5fd", fontWeight: 700, letterSpacing: "3px", fontSize: "12px", textTransform: "uppercase", marginBottom: "8px" }}>Reach Out</p>
            <h2 style={{ fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 800, marginBottom: "10px", lineHeight: 1.2 }}>
              We Are Here to Help You
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7, fontSize: "14px", marginBottom: "24px" }}>
              Have questions or need a freight quote? Fill the form and we will respond within one business day.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "0" }}>
              {infoItems.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.12)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className={`fas ${item.icon}`} style={{ color: "#93c5fd", fontSize: "16px" }}></i>
                  </div>
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "3px" }}>{item.label}</p>
                    {item.href ? (
                      <a href={item.href} style={{ color: "white", fontSize: "14px", textDecoration: "none", fontWeight: 500 }}>{item.value}</a>
                    ) : (
                      <p style={{ color: "white", fontSize: "14px", fontWeight: 500 }}>{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT — Form card */}
          <div style={{ background: "white", borderRadius: "24px", padding: "32px 36px", boxShadow: "0 20px 60px rgba(0,0,0,0.10)", border: "1px solid #e8f0fe" }}>

            {/* Form header */}
            <div style={{ marginBottom: "16px" }}>
              <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 800, color: "#0f172a", marginBottom: "4px", lineHeight: 1.2 }}>Send Us a Message</h2>
              <p style={{ color: "#64748b", fontSize: "13px", lineHeight: 1.5, margin: 0 }}>We will respond within one business day.</p>
            </div>

            {submitted && (
              <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <i className="fas fa-check-circle" style={{ color: "#16a34a", fontSize: "16px" }}></i>
                <p style={{ color: "#15803d", fontWeight: 600, fontSize: "13px", margin: 0 }}>Message sent! We will get back to you within 24 hours.</p>
              </div>
            )}

            {error && (
              <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <i className="fas fa-exclamation-circle" style={{ color: "#dc2626", fontSize: "16px" }}></i>
                <p style={{ color: "#b91c1c", fontWeight: 600, fontSize: "13px", margin: 0 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Name row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    First Name <span style={{ color: "#1e40af" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <i className="fas fa-user" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "13px", pointerEvents: "none" }}></i>
                    <input type="text" name="firstName" required value={formData.firstName}
                      style={{ ...inputStyle, paddingLeft: "40px" }} onFocus={handleFocus} onBlur={handleBlur}
                      onChange={handleChange} placeholder="John" />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Last Name <span style={{ color: "#1e40af" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <i className="fas fa-user" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "13px", pointerEvents: "none" }}></i>
                    <input type="text" name="lastName" required value={formData.lastName}
                      style={{ ...inputStyle, paddingLeft: "40px" }} onFocus={handleFocus} onBlur={handleBlur}
                      onChange={handleChange} placeholder="Doe" />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Email Address <span style={{ color: "#1e40af" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <i className="fas fa-envelope" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "13px", pointerEvents: "none" }}></i>
                  <input type="email" name="email" required value={formData.email}
                    style={{ ...inputStyle, paddingLeft: "40px" }} onFocus={handleFocus} onBlur={handleBlur}
                    onChange={handleChange} placeholder="john@example.com" />
                </div>
              </div>

              {/* Address */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Address / State
                </label>
                <div style={{ position: "relative" }}>
                  <i className="fas fa-map-marker-alt" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "13px", pointerEvents: "none" }}></i>
                  <input type="text" name="address" value={formData.address}
                    style={{ ...inputStyle, paddingLeft: "40px" }} onFocus={handleFocus} onBlur={handleBlur}
                    onChange={handleChange} placeholder="City, Country" />
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Message <span style={{ color: "#1e40af" }}>*</span>
                </label>
                <textarea name="message" required rows={3} value={formData.message}
                  style={{ ...inputStyle, resize: "vertical", minHeight: "80px", paddingTop: "9px" }}
                  onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange}
                  placeholder="Tell us about your shipment needs, ask a question, or leave a comment..."
                ></textarea>
              </div>

              {/* Submit */}
              <button type="submit" disabled={sending} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                background: sending ? "#93c5fd" : "linear-gradient(135deg,#1e40af,#2563eb)",
                color: "white", border: "none", borderRadius: "12px",
                padding: "16px", fontSize: "15px", fontWeight: 700,
                cursor: sending ? "not-allowed" : "pointer",
                fontFamily: "inherit", transition: "opacity 0.2s, transform 0.2s",
                width: "100%", boxShadow: sending ? "none" : "0 4px 20px rgba(30,64,175,0.35)",
              }}
                onMouseEnter={e => { if (!sending) e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { if (!sending) e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {sending
                  ? <><span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }}></span>&nbsp;Sending...</>
                  : <><i className="fas fa-paper-plane"></i>&nbsp;Send Message</>}
              </button>


            </form>
          </div>

        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "linear-gradient(135deg,#1e40af 0%,#1e3a8a 100%)", padding: "70px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <h2 style={{ color: "white", fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, marginBottom: "14px" }}>Need an Instant Shipment Quote?</h2>
          <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: "30px" }}>Use our tracking system or head back to the homepage to track an existing shipment in real time.</p>
          <a href="/" style={{ background: "white", color: "#1e40af", padding: "13px 30px", borderRadius: "8px", fontWeight: 700, textDecoration: "none", fontSize: "15px" }}>Back to Home</a>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Page;
