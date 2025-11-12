
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
  
  const cacheKey = `fragrance_image_${perfume.name}`;

  useEffect(() => {
    let isCancelled = false;

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
                    console.error(`Failed to load image for ${perfume.name} from URL: ${perfume.imageUrl}`);
                    setError(true);
                    setIsLoading(false);
                }
            };
            return;
        }

        // Fallback to AI generation
        try {
            const cachedImage = sessionStorage.getItem(cacheKey);
            if (cachedImage) {
                if (!isCancelled) {
                    setImageUrl(cachedImage);
                    setIsLoading(false);
                }
                return;
            }
        } catch (e) {
            console.warn("Could not access session storage", e);
        }

        try {
            const base64Data = await generateFragranceImage(perfume);
            if (!isCancelled) {
                const dataUrl = `data:image/png;base64,${base64Data}`;
                setImageUrl(dataUrl);
                try {
                    sessionStorage.setItem(cacheKey, dataUrl);
                } catch (e) {
                    console.warn("Could not write to session storage", e);
                }
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
