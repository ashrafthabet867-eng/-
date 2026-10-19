import React from 'react';

interface AdvisorLogoProps {
  className?: string;
  size?: number;
  showGlow?: boolean;
  alt?: string;
}

export const AdvisorLogo: React.FC<AdvisorLogoProps> = ({
  className = 'w-10 h-10',
  showGlow = false,
  alt = 'شعار الهيئة القومية للتأمين الاجتماعي',
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      {showGlow && (
        <span className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xs scale-105 pointer-events-none" />
      )}
      <img
        src="/logo.png"
        alt={alt}
        className="w-full h-full object-contain select-none"
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
