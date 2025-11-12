import React from 'react';
import { Perfume } from '../types';
import { VerifiedIcon } from './icons/VerifiedIcon';
import FragranceImage from './FragranceImage';

interface PerfumeCardProps {
  perfume: Perfume;
  onClick: () => void;
}

const PerfumeCard: React.FC<PerfumeCardProps> = ({ perfume, onClick }) => {
  const allNotes = [...perfume.topNotes, ...perfume.middleNotes, ...perfume.baseNotes];
  // Show a subset of notes on the card
  const displayedNotes = allNotes.slice(0, 4);

  return (
    <div
      onClick={onClick}
      className="bg-white/60 rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 border border-champagne-gold/30 flex flex-col cursor-pointer"
    >
      <div className="relative h-64">
        <FragranceImage
          perfume={perfume}
          alt={perfume.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-serif font-bold text-deep-taupe">{perfume.name}</h3>
        <div className="flex items-center gap-2 mb-2">
            <p className="text-sm text-rose-hue font-medium">{perfume.brand}</p>
            {perfume.isVerified && (
                <div title="Verified Partner">
                    <VerifiedIcon className="w-4 h-4 text-deep-taupe" />
                </div>
            )}
        </div>
        <p className="text-deep-taupe/80 text-sm mb-4 flex-grow">{perfume.description.split('.')[0] + '.'}</p>
        <div className="mt-auto">
            <p className="text-xs font-sans font-semibold text-deep-taupe mb-2">KEY NOTES</p>
            <div className="flex flex-wrap gap-2">
                {displayedNotes.map((note, index) => (
                <span key={index} className="bg-champagne-gold/50 text-deep-taupe text-xs font-medium px-2.5 py-1 rounded-full">
                    {note}
                </span>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PerfumeCard;
