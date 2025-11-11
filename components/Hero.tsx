
import React from 'react';

interface HeroProps {
  onDiscoverClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onDiscoverClick }) => {
  return (
    <div className="relative bg-champagne-gold/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 py-24 md:py-32 lg:py-48 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-deep-taupe tracking-tight">
            Discover Your Signature Scent.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-deep-taupe/80">
            Harness the power of AI to explore a universe of fragrances and find the perfume that truly represents you. Your personal scent journey begins now.
          </p>
          <div className="mt-10">
            <button
              onClick={onDiscoverClick}
              className="bg-deep-taupe text-pearl-white font-bold py-4 px-10 rounded-full text-lg font-sans hover:bg-rose-hue hover:text-deep-taupe transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Find Your Perfect Match
            </button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-0 opacity-20">
        <img src="https://picsum.photos/seed/perfumebg/1920/1080" alt="Abstract fragrance background" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Hero;
