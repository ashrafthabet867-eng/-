import React from 'react';

interface AdvisorLogoProps {
  className?: string;
  size?: number;
  showGlow?: boolean;
}

export const AdvisorLogo: React.FC<AdvisorLogoProps> = ({
  className = 'w-10 h-10',
  showGlow = false,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      {showGlow && (
        <span className="absolute inset-0 rounded-full bg-cyan-400/20 blur-sm scale-110 pointer-events-none" />
      )}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="الشعار الرسمي للهيئة القومية للتأمين الاجتماعي"
      >
        <defs>
          {/* Top Arc for Arabic Text */}
          <path id="topArcAr" d="M 18,100 A 82,82 0 0,1 182,100" fill="none" />
          {/* Bottom Arc for English Text */}
          <path id="bottomArcEn" d="M 22,105 A 80,80 0 0,0 178,105" fill="none" />

          {/* Gradients for Protective Hands */}
          <linearGradient id="handGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          <linearGradient id="handGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#7DD3FC" />
          </linearGradient>
        </defs>

        {/* Clean White Circular Base */}
        <circle cx="100" cy="100" r="99" fill="#FFFFFF" />

        {/* Outer Official Navy Ring */}
        <circle cx="100" cy="100" r="96" stroke="#102A5C" strokeWidth="3" />

        {/* Inner Framing Navy Ring */}
        <circle cx="100" cy="100" r="76" stroke="#102A5C" strokeWidth="1.8" />

        {/* Arabic Curved Title: الهيئة القومية للتأمين الاجتماعي */}
        <text
          fill="#102A5C"
          fontSize="14"
          fontWeight="800"
          fontFamily="'Cairo', 'Segoe UI', Tahoma, sans-serif"
          letterSpacing="0.1"
        >
          <textPath href="#topArcAr" startOffset="50%" textAnchor="middle">
            الهيئة القومية للتأمين الاجتماعي
          </textPath>
        </text>

        {/* English Curved Title: National Organization for Social Insurance */}
        <text
          fill="#102A5C"
          fontSize="8.8"
          fontWeight="700"
          fontFamily="'Cairo', Arial, sans-serif"
          letterSpacing="0.35"
        >
          <textPath href="#bottomArcEn" startOffset="50%" textAnchor="middle">
            National Organization for Social Insurance
          </textPath>
        </text>

        {/* Side Divider Dots */}
        <circle cx="20" cy="102" r="2.2" fill="#102A5C" />
        <circle cx="180" cy="102" r="2.2" fill="#102A5C" />

        {/* Center Official Emblem: Family Silhouette & Protective Hands */}
        <g transform="translate(100, 100) scale(1.15)">
          {/* Family Silhouette in Dark Navy */}
          <g fill="#102A5C">
            {/* Father (Left) */}
            <circle cx="-16" cy="-26" r="6.5" />
            <path d="M -23,-17 C -27,-10 -24,2 -16,2 C -9,2 -8,-10 -13,-17 Z" />

            {/* Mother (Center) */}
            <circle cx="1" cy="-29" r="6" />
            <path d="M -5,-19 C -10,-13 -7,-1 1,-1 C 8,-1 9,-13 4,-19 Z" />

            {/* Child 1 (Right - Older boy) */}
            <circle cx="18" cy="-12" r="5" />
            <path d="M 14,-5 C 10,1 12,11 18,11 C 24,11 25,1 20,-5 Z" />

            {/* Child 2 (Nested - Toddler) */}
            <circle cx="8" cy="-9" r="4.2" />
            <path d="M 5,-3 C 3,1 4,8 8,8 C 12,8 13,1 10,-3 Z" />
          </g>

          {/* Protective Hands Cradling Underneath in Vibrant Cyan / Turquoise */}
          <g>
            {/* Base Protective Swoop */}
            <path
              d="M -50,-14 C -45,3 -28,24 -7,32 C 14,39 42,32 58,10 C 44,21 21,26 0,21 C -20,16 -37,-2 -41,-14 Z"
              fill="url(#handGradMain)"
            />
            {/* Middle Palm Layer */}
            <path
              d="M -48,-6 C -43,9 -26,26 -5,32 C 11,36 34,29 48,13 C 32,22 14,25 -2,19 C -19,14 -33,0 -38,-10 Z"
              fill="#38BDF8"
            />
            {/* Upper Delicate Fingers Swoop */}
            <path
              d="M -33,-24 C -39,-10 -31,9 -18,17 C -4,26 18,25 35,18 C 23,22 4,21 -7,14 C -19,7 -27,-6 -25,-19 Z"
              fill="url(#handGradLight)"
            />
            {/* White Contour Line Highlight */}
            <path
              d="M -22,10 C -10,17 11,17 26,11 C 13,14 -4,14 -16,8 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
