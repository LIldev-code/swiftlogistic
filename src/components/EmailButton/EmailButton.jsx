"use client";
import React, { useState } from "react";

export default function EmailButton() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const openEmail = () => {
    window.location.href = "mailto:hello@swiftlogisticsite.com?subject=Website%20Inquiry";
  };

  return (
    <div style={{ position: "fixed", bottom: "28px", left: "28px", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
      {/* Tooltip popup */}
      {hovered && (
        <div style={{
          background: "#0f172a",
          color: "white",
          fontSize: "12px",
          fontWeight: 600,
          padding: "6px 14px",
          borderRadius: "6px",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          letterSpacing: "0.3px",
          animation: "fadeUp 0.2s ease",
        }}>
          Email Us
          <div style={{ position: "absolute", bottom: "-5px", left: "20px", width: "10px", height: "10px", background: "#0f172a", transform: "rotate(45deg)", borderRadius: "1px" }} />
        </div>
      )}

      {/* Main button */}
      <button
        onClick={openEmail}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Send email"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg,#1e40af 0%,#1e3a8a 100%)",
          border: "none",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: hovered
            ? "0 8px 24px rgba(30,64,175,0.5)"
            : "0 4px 14px rgba(30,64,175,0.35)",
          transform: hovered ? "scale(1.12) translateY(-2px)" : "scale(1)",
          transition: "all 0.25s ease",
          position: "relative",
        }}
      >
        <i className="fas fa-envelope" style={{ fontSize: "20px" }}></i>
        {/* Pulse ring */}
        <span style={{
          position: "absolute",
          inset: "-4px",
          borderRadius: "50%",
          border: "2px solid rgba(30,64,175,0.4)",
          animation: "pulse 2s ease-out infinite",
          pointerEvents: "none",
        }} />
      </button>

      <style>{`
        @keyframes pulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
