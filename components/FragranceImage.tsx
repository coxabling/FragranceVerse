
import React, { useState, useEffect } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { generateFragranceImage } from '../services/geminiService';
import { Perfume } from '../types';
import { saveImage, getImage } from '../services/dbService';
import { useApiKey } from '../contexts/ApiKeyContext';

interface FragranceImageProps {
  perfume: Perfume;
  alt: string;
  className?: string;
}

const FragranceImage: React.FC<FragranceImageProps> = ({ perfume, alt, className }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const { resetApiKey } = useApiKey();
  
  const cacheKey = `fragrance_image_${perfume.name}`;

  useEffect(() => {
    let isCancelled = false;

    const generateAndCacheImage = async () => {
      setIsLoading(true);
      try {
        const cachedImage = await getImage(cacheKey);
        if (cachedImage && !isCancelled) {
          setImageUrl(cachedImage);
          return;
        }

        const base64Data = await generateFragranceImage(perfume);
        if (!isCancelled) {
          const dataUrl = `data:image/png;base64,${base64Data}`;
          setImageUrl(dataUrl);
          await saveImage(cacheKey, dataUrl);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error(`Failed to generate or cache image for ${perfume.name}`, err);
          if (err instanceof Error && err.message.includes('API key')) {
            resetApiKey();
          }
          setError(true);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    const loadImage = async () => {
        setIsLoading(true);
        setError(false);
        setImageUrl('');

        if (perfume.imageUrl) {
            try {
                const img = new Image();
                img.src = perfume.imageUrl;
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                });
                if (!isCancelled) {
                    setImageUrl(perfume.imageUrl!);
                    setIsLoading(false);
                }
            } catch (e) {
                 if (!isCancelled) {
                    console.warn(`Official image for ${perfume.name} failed to load. Falling back to AI generation.`);
                    await generateAndCacheImage();
                }
            }
        } else {
            await generateAndCacheImage();
        }
    };

    loadImage();

    return () => {
        isCancelled = true;
    };
  }, [perfume, cacheKey, resetApiKey]);

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
