import React, { useState, useEffect } from 'react';
import { LogoIcon } from './icons/LogoIcon';

interface FragranceImageProps {
  perfumeName: string;
  alt: string;
  className?: string;
}

const FragranceImage: React.FC<FragranceImageProps> = ({ perfumeName, alt, className }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    // Reset state when perfumeName changes
    setIsLoading(true);
    setError(false);
    
    // Use a simple hashing function to create a consistent numeric seed from the perfume name
    const seed = perfumeName.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const url = `https://picsum.photos/seed/${seed}/400/600`;
    setImageUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setIsLoading(false);
    };
    img.onerror = () => {
      console.error(`Failed to load image for ${perfumeName} from ${url}`);
      setError(true);
      setIsLoading(false);
    };
  }, [perfumeName]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-champagne-gold/20 ${className}`}>
        <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-rose-hue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-champagne-gold/30 ${className}`}>
        <LogoIcon className="w-1/3 h-1/3 text-deep-taupe/20" />
      </div>
    );
  }

  return <img src={imageUrl} alt={alt} className={className} loading="lazy" />;
};

export default FragranceImage;
