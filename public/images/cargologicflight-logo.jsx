import React from 'react';

const CargoLogicFlightLogo = ({ width = 300, height = 80, className }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 300 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Clean white background */}
      <rect width="300" height="80" rx="2" fill="white"/>
      
      {/* Professional emblem */}
      <g transform="translate(15, 20)">
        {/* Stylized globe element */}
        <circle cx="20" cy="20" r="18" fill="white" stroke="#1f2937" strokeWidth="1.5"/>
        <ellipse cx="20" cy="20" rx="18" ry="10" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="1 1" transform="rotate(-25 20 20)"/>
        
        {/* Stylized airplane */}
        <path d="M30 15C30 15 26 12 23 10L12 12L8 15L12 17L8 19L5 17L3 20L8 22L12 25L23 27C26 25 30 22 30 22C31 21 32 18 30 15Z" fill="#dc2626"/>
        <path d="M12 17L23 12M12 17L23 22" stroke="white" strokeWidth="0.75" strokeLinecap="round"/>
      </g>
      
      {/* Company name with professional typography */}
      <g>
        {/* CARGO */}
        <text x="60" y="32" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="18" letterSpacing="0.5" fill="#1f2937">CARGO</text>
        {/* LOGIC in brand red */}
        <text x="130" y="32" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="18" letterSpacing="0.5" fill="#dc2626">LOGIC</text>
        {/* FLIGHT */}
        <text x="60" y="52" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="18" letterSpacing="0.5" fill="#1f2937">FLIGHT</text>
      </g>
      
      {/* Professional separator */}
      <line x1="60" y1="38" x2="190" y2="38" stroke="#e5e7eb" strokeWidth="1"/>
      
      {/* Professional tagline */}
      <text x="60" y="65" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="9" fill="#6b7280">GLOBAL LOGISTICS & TRANSPORTATION</text>
      
      {/* Corporate design element */}
      <rect x="220" y="15" width="50" height="50" rx="2" fill="white" stroke="#dc2626" strokeWidth="1.5"/>
      <rect x="230" y="25" width="30" height="30" rx="1" fill="white" stroke="#1f2937" strokeWidth="1"/>
      <line x1="230" y1="40" x2="260" y2="40" stroke="#dc2626" strokeWidth="1.5"/>
      <line x1="245" y1="25" x2="245" y2="55" stroke="#dc2626" strokeWidth="1.5"/>
    </svg>
  );
};

export default CargoLogicFlightLogo;
