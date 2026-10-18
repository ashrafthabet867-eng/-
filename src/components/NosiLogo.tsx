import React from 'react';
import { AdvisorLogo } from './AdvisorLogo';

interface NosiLogoProps {
  className?: string;
  size?: number;
}

export const NosiLogo: React.FC<NosiLogoProps> = ({ className = 'w-10 h-10' }) => {
  return <AdvisorLogo className={className} />;
};
