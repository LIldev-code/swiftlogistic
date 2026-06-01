import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

function Banner({ content, img, height }) {
  const [itemActive, setItemActive] = useState(0);
  const intervalRef = useRef(null);
  const path = usePathname();

  const items = [
    {
      img: "/images/pexels-tomfisk-1427107.jpg",
      tag: "Global Freight Solutions",
      title: "Swift Delivery,\nWorldwide Reach",
      description:
        "From sea to sky — SwiftCargo moves your cargo safely across every border, on time, every time.",
      cta: "Track Your Shipment",
      ctaLink: "#track",
    },
    {
      img: "/images/pexels-pixabay-163726.jpg",
      tag: "Air Freight",
      title: "Express Air Cargo\nYou Can Trust",
      description:
        "Priority air freight with real-time tracking and door-to-door delivery to over 150 countries.",
      cta: "Get a Quote",
      ctaLink: "/contact",
    },
    {
      img: "/images/pexels-tomfisk-3057960.jpg",
      tag: "Ocean Freight",
      title: "Ocean Shipping\nDone Right",
      description:
        "Full container loads and LCL shipping across major sea routes — reliable, affordable, secure.",
      cta: "Our Services",
      ctaLink: "/logistics",
    },
    {
      img: "/images/pexels-quang-nguyen-vinh-222549-2147993.jpg",
      tag: "Road & Rail Logistics",
      title: "Land Logistics\nAcross Continents",
      description:
        "Comprehensive road and rail freight solutions that keep your supply chain moving without delays.",
      cta: "Learn More",
      ctaLink: "/about",
    },
  ];

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setItemActive((prev) => (prev + 1) % items.length);
    }, 7000);
  };

  useEffect(() => {
    resetInterval();
    return () => clearInterval(intervalRef.current);
  }, [items.length]);

  const handleNext = () => {
    setItemActive((prev) => { resetInterval(); return (prev + 1) % items.length; });
  };

  const handlePrev = () => {
    setItemActive((prev) => { resetInterval(); return (prev - 1 + items.length) % items.length; });
  };

  const showSlider = (index) => { setItemActive(index); resetInterval(); };

  if (path !== "/") {
    return (
      <div style={{ position: "relative", width: "100%", height: "55vh", overflow: "hidden", marginTop: "0" }}>
        <img
          src={img}
          alt={content || "banner"}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.45)" }}
        />
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 24px",
          background: "linear-gradient(to bottom, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.6) 100%)",
        }}>
          <p style={{
            color: "#93c5fd",
            fontWeight: 700,
            letterSpacing: "5px",
            fontSize: "13px",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}>
            SwiftCargo
          </p>
          <h2 style={{
            color: "white",
            fontSize: "clamp(32px, 6vw, 64px)",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "6px",
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            margin: 0,
            lineHeight: 1.1,
          }}>
            {content}
          </h2>
          <div style={{ width: "70px", height: "4px", background: "#1e40af", borderRadius: "2px", margin: "20px auto 0" }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <div className="slider" style={{ height: "88vh" }}>
        <div className="list">
          {items.map((item, index) => (
            <div
              className={`items ${itemActive === index ? "active" : ""}`}
              key={index}
            >
              <img src={item.img} alt={item.title} />
              <div className="content" style={{ width: "600px", maxWidth: "85%" }}>
                <p style={{
                  fontSize: "13px",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  color: "#7dd3fc",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}>
                  {item.tag}
                </p>
                <h2 style={{
                  fontSize: "clamp(32px, 5vw, 58px)",
                  lineHeight: 1.15,
                  fontWeight: 800,
                  whiteSpace: "pre-line",
                  marginBottom: "18px",
                }}>
                  {item.title}
                </h2>
                <p style={{
                  fontSize: "16px",
                  lineHeight: 1.7,
                  opacity: 0.9,
                  marginBottom: "28px",
                  maxWidth: "480px",
                }}>
                  {item.description}
                </p>
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <Link href={item.ctaLink} style={{
                    background: "#1e40af",
                    color: "white",
                    padding: "14px 30px",
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "14px",
                    textDecoration: "none",
                    letterSpacing: "0.5px",
                    transition: "0.3s",
                    display: "inline-block",
                  }}>
                    {item.cta}
                  </Link>
                  <Link href="/contact" style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    padding: "14px 30px",
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: "14px",
                    textDecoration: "none",
                    border: "1px solid rgba(255,255,255,0.4)",
                    backdropFilter: "blur(4px)",
                    display: "inline-block",
                  }}>
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prev/Next arrows */}
        <button onClick={handlePrev} style={{
          position: "absolute", top: "50%", left: "24px", transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.4)",
          color: "white", width: "48px", height: "48px", borderRadius: "50%",
          fontSize: "20px", cursor: "pointer", zIndex: 10, backdropFilter: "blur(4px)",
          transition: "0.3s",
        }}>&#8249;</button>
        <button onClick={handleNext} style={{
          position: "absolute", top: "50%", right: "24px", transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.4)",
          color: "white", width: "48px", height: "48px", borderRadius: "50%",
          fontSize: "20px", cursor: "pointer", zIndex: 10, backdropFilter: "blur(4px)",
          transition: "0.3s",
        }}>&#8250;</button>

        {/* Dot navigation */}
        <div style={{
          position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: "10px", zIndex: 10,
        }}>
          {items.map((_, index) => (
            <button key={index} onClick={() => showSlider(index)} style={{
              width: itemActive === index ? "32px" : "10px",
              height: "10px",
              borderRadius: "5px",
              background: itemActive === index ? "#1e40af" : "rgba(255,255,255,0.5)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.4s ease",
              padding: 0,
            }} />
          ))}
        </div>
      </div>

      {/* Quick-info strip below hero */}
      <div style={{
        background: "#1e40af",
        color: "white",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 0,
      }}>
        {[
          { icon: "fa-plane", label: "Air Freight" },
          { icon: "fa-ship", label: "Ocean Freight" },
          { icon: "fa-truck", label: "Road Freight" },
          { icon: "fa-train", label: "Rail Freight" },
          { icon: "fa-warehouse", label: "Warehousing" },
          { icon: "fa-box-open", label: "Customs Clearance" },
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "18px 32px",
            borderRight: i < 5 ? "1px solid rgba(255,255,255,0.2)" : "none",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <i className={`fas ${item.icon}`} style={{ fontSize: "20px", color: "#93c5fd" }}></i>
            <span style={{ fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Banner;
