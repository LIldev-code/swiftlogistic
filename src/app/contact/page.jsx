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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, address, message } = formData;
    const mailtoLink = `mailto:hello@swiftcargo.com?subject=Contact%20Form%20Submission&body=Name:%20${firstName}%20${lastName}%0AEmail:%20${email}%0AAddress/State:%20${address}%0AMessage/Comment:%20${message}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  const infoItems = [
    { icon: "fa-envelope", label: "Email Us", value: "hello@swiftcargo.com", href: "mailto:hello@swiftcargo.com" },
    { icon: "fa-globe", label: "Website", value: "swiftcargo.com", href: "https://swiftcargo.com" },
    { icon: "fa-clock", label: "Support Hours", value: "Mon–Fri, 8am – 6pm", href: null },
    { icon: "fa-shipping-fast", label: "Track a Shipment", value: "Use our live tracker on the homepage", href: "/#track" },
  ];

  const socials = [
    { icon: "fab fa-facebook-f", href: "#" },
    { icon: "fab fa-twitter", href: "#" },
    { icon: "fab fa-linkedin-in", href: "#" },
    { icon: "fab fa-instagram", href: "#" },
  ];

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
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
      <section style={{ background: "#f0f7ff", padding: "90px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "40px", alignItems: "start" }}>

          {/* LEFT — Info card */}
          <div style={{ background: "linear-gradient(160deg,#1e3a8a 0%,#1e40af 100%)", borderRadius: "20px", padding: "44px 36px", color: "white" }}>
            <p style={{ color: "#93c5fd", fontWeight: 700, letterSpacing: "3px", fontSize: "12px", textTransform: "uppercase", marginBottom: "12px" }}>Reach Out</p>
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, marginBottom: "16px", lineHeight: 1.2 }}>
              We Are Here to Help You
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.8, fontSize: "15px", marginBottom: "40px" }}>
              Have questions about our logistics services, need a freight quote, or want to track a shipment? Fill in the form and our team will respond within one business day.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "44px" }}>
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

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "28px" }}>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Follow Us</p>
              <div style={{ display: "flex", gap: "12px" }}>
                {socials.map((s, i) => (
                  <a key={i} href={s.href} style={{
                    width: "38px", height: "38px", background: "rgba(255,255,255,0.12)", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                    textDecoration: "none", fontSize: "15px", transition: "background 0.3s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                  >
                    <i className={s.icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Form card */}
          <div style={{ background: "white", borderRadius: "20px", padding: "44px 40px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
            <p style={{ color: "#1e40af", fontWeight: 700, letterSpacing: "3px", fontSize: "12px", textTransform: "uppercase", marginBottom: "10px" }}>Send a Message</p>
            <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>How Can We Help?</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "32px", lineHeight: 1.6 }}>Complete the form below and we will get back to you within 24 hours.</p>

            {submitted && (
              <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: "10px", padding: "14px 18px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px", color: "#16a34a", fontSize: "14px", fontWeight: 500 }}>
                <i className="fas fa-check-circle"></i> Message sent! We will be in touch soon.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                    First Name <span style={{ color: "#1e40af" }}>*</span>
                  </label>
                  <input
                    type="text" name="firstName" required
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                    onChange={handleChange} placeholder="John"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                    Last Name <span style={{ color: "#1e40af" }}>*</span>
                  </label>
                  <input
                    type="text" name="lastName" required
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                    onChange={handleChange} placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                  Email Address <span style={{ color: "#1e40af" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <i className="fas fa-envelope" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "14px", pointerEvents: "none" }}></i>
                  <input
                    type="email" name="email" required
                    style={{ ...inputStyle, paddingLeft: "40px" }}
                    onFocus={handleFocus} onBlur={handleBlur}
                    onChange={handleChange} placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                  Address / State
                </label>
                <div style={{ position: "relative" }}>
                  <i className="fas fa-map-marker-alt" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "14px", pointerEvents: "none" }}></i>
                  <input
                    type="text" name="address"
                    style={{ ...inputStyle, paddingLeft: "40px" }}
                    onFocus={handleFocus} onBlur={handleBlur}
                    onChange={handleChange} placeholder="City, Country"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                  Message <span style={{ color: "#1e40af" }}>*</span>
                </label>
                <textarea
                  name="message" required rows={5}
                  style={{ ...inputStyle, resize: "vertical", minHeight: "130px" }}
                  onFocus={handleFocus} onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Tell us about your shipment needs, ask a question, or leave a comment..."
                ></textarea>
              </div>

              <button
                type="submit"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  background: "#1e40af", color: "white", border: "none", borderRadius: "10px",
                  padding: "15px 32px", fontSize: "15px", fontWeight: 700, cursor: "pointer",
                  fontFamily: "inherit", transition: "background 0.2s, transform 0.2s", alignSelf: "flex-start",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1e3a8a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#1e40af"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <i className="fas fa-paper-plane"></i> Send Message
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
