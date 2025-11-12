import React, { useState, useEffect } from 'react';
import { LogoIcon } from './icons/LogoIcon';

const FRAGELLA_API_KEY = '4c14357cf2e32c1e2eb902977334ca71cb652b3be673148750d4f527173d3e41';
const FRAGELLA_API_BASE_URL = 'https://api.fragella.com/api/v1';

// A simple cache to avoid re-fetching images during the same session
const imageCache = new Map<string, string>();

interface FragranceImageProps {
  perfumeName: string;
  alt: string;
  className?: string;
}

const FragranceImage: React.FC<FragranceImageProps> = ({ perfumeName, alt, className }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // Reset state when perfumeName changes
    setSrc(null);
    setIsLoading(true);
    setError(false);

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchImage = async () => {
      if (imageCache.has(perfumeName)) {
        setSrc(imageCache.get(perfumeName)!);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${FRAGELLA_API_BASE_URL}/images?name=${encodeURIComponent(perfumeName)}`, {
          headers: {
            'x-api-key': FRAGELLA_API_KEY,
          },
          signal,
        });

        if (!response.ok) {
          throw new Error(`Image not found for ${perfumeName}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        imageCache.set(perfumeName, objectUrl);
        setSrc(objectUrl);

      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error(err);
          setError(true);
        }
      } finally {
        if (!signal.aborted) {
            setIsLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      controller.abort();
      // Note: We are not revoking the object URL on unmount because the cache holds it.
      // This is a trade-off for performance. A more robust solution might use a more
      // sophisticated cache with its own lifecycle management.
    };
  }, [perfumeName]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-champagne-gold/20 ${className}`}>
        <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-rose-hue"></div>
      </div>
    );
  }

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-champagne-gold/30 ${className}`}>
        <LogoIcon className="w-1/3 h-1/3 text-deep-taupe/20" />
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} loading="lazy" />;
};

export default FragranceImage;
