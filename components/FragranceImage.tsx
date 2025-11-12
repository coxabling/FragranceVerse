import React, { useState } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { Perfume } from '../types';

interface FragranceImageProps {
  perfume: Perfume;
  alt: string;
  className?: string;
}

const FragranceImage: React.FC<FragranceImageProps> = ({ perfume, alt, className }) => {
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  // If no image URL is provided, or if there was an error loading it, show fallback.
  if (imageError || !perfume.imageUrl) {
    return (
      <div className={`flex items-center justify-center bg-champagne-gold/30 ${className}`}>
        <LogoIcon className="w-1/3 h-1/3 text-deep-taupe/20" />
      </div>
    );
  }

  return (
    <img
      src={perfume.imageUrl}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default FragranceImage;