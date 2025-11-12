
import React, { useState, useEffect } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { generateFragranceImage } from '../services/geminiService';
import { Perfume } from '../types';

interface FragranceImageProps {
  perfume: Perfume;
  alt: string;
  className?: string;
}

const FragranceImage: React.FC<FragranceImageProps> = ({ perfume, alt, className }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  
  useEffect(() => {
    let isCancelled = false;

    const loadImage = async () => {
      setIsLoading(true);
      setError(false);
      
      let finalUrl: string | undefined;

      // 1. Try to load official image URL if available
      if (perfume.imageUrl) {
        try {
          const img = new Image();
          img.src = perfume.imageUrl;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          if (!isCancelled) {
              finalUrl = perfume.imageUrl;
          }
        } catch (e) {
          console.warn(`Official image for ${perfume.name} failed to load. Falling back to AI generation.`);
          // If official image fails, we'll proceed to generation in the next step.
        }
      }

      // 2. If no official URL or it failed, get/generate image (caching is handled inside the service)
      if (!finalUrl) {
        try {
          finalUrl = await generateFragranceImage(perfume);
        } catch (err) {
          if (!isCancelled) {
            console.error(`Failed to generate or cache image for ${perfume.name}`, err);
            setError(true);
          }
        }
      }
      
      if (finalUrl && !isCancelled) {
        setImageUrl(finalUrl);
      }

      if (!isCancelled) {
        setIsLoading(false);
      }
    };

    loadImage();

    return () => {
      isCancelled = true;
    };
  }, [perfume]);

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
