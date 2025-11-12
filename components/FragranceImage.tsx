
import React, { useState, useEffect } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { generateFragranceImage } from '../services/geminiService';
import { Perfume } from '../types';

interface FragranceImageProps {
  perfume: Perfume;
  alt: string;
  className?: string;
}

// In-memory cache for generated images to avoid sessionStorage quota limits.
const imageCache = new Map<string, string>();

const FragranceImage: React.FC<FragranceImageProps> = ({ perfume, alt, className }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  
  const cacheKey = `fragrance_image_${perfume.name}`;

  useEffect(() => {
    let isCancelled = false;

    const generateAndCacheImage = async () => {
      // Check in-memory cache
      if (imageCache.has(cacheKey)) {
        if (!isCancelled) {
          setImageUrl(imageCache.get(cacheKey)!);
          setIsLoading(false);
        }
        return;
      }

      // Generate new image if not in cache
      try {
        const base64Data = await generateFragranceImage(perfume);
        if (!isCancelled) {
          const dataUrl = `data:image/png;base64,${base64Data}`;
          setImageUrl(dataUrl);
          imageCache.set(cacheKey, dataUrl); // Cache in memory
        }
      } catch (err) {
        if (!isCancelled) {
          console.error(`Failed to generate image for ${perfume.name}`, err);
          setError(true);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    const fetchImage = async () => {
        setIsLoading(true);
        setError(false);
        setImageUrl('');

        if (perfume.imageUrl) {
            const img = new Image();
            img.src = perfume.imageUrl;
            img.onload = () => {
                if (!isCancelled) {
                    setImageUrl(perfume.imageUrl!);
                    setIsLoading(false);
                }
            };
            img.onerror = () => {
                if (!isCancelled) {
                    console.warn(`Official image for ${perfume.name} failed to load. Falling back to AI generation.`);
                    generateAndCacheImage();
                }
            };
        } else {
            // No official URL, proceed to generate/cache logic
            generateAndCacheImage();
        }
    };

    fetchImage();

    return () => {
        isCancelled = true;
    };
  }, [perfume, cacheKey]);

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
