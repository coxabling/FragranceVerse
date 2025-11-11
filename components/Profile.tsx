import React, { useState } from 'react';
import { Perfume, Wardrobe, WardrobeShelf } from '../types';
import PerfumeCard from './PerfumeCard';
import { UserIcon } from './icons/UserIcon';

interface ProfileProps {
    wardrobe: Wardrobe;
    onPerfumeClick: (perfume: Perfume) => void;
}

const Profile: React.FC<ProfileProps> = ({ wardrobe, onPerfumeClick }) => {
    const [activeShelf, setActiveShelf] = useState<WardrobeShelf>('own');

    const shelves: { id: WardrobeShelf, label: string }[] = [
        { id: 'own', label: 'I Own' },
        { id: 'want', label: 'I Want' },
        { id: 'tried', label: 'I\'ve Tried' },
    ];
    
    const perfumesOnShelf = wardrobe[activeShelf];

    return (
        <div className="py-16 md:py-24 bg-pearl-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left p-8 bg-champagne-gold/20 rounded-xl mb-12">
                        <div className="relative mb-4 sm:mb-0 sm:mr-8">
                            <img src="https://i.pravatar.cc/150?u=currentUser" alt="User" className="w-28 h-28 rounded-full shadow-lg" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif text-deep-taupe">Your Fragrance Wardrobe</h1>
                            <p className="mt-2 text-lg text-deep-taupe/80">Curate and explore your personal collection of scents.</p>
                        </div>
                    </div>

                    <div className="border-b border-champagne-gold mb-8 flex justify-center space-x-2 md:space-x-4">
                        {shelves.map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => setActiveShelf(id)}
                                className={`capitalize py-3 px-4 md:px-6 font-serif text-xl transition-all duration-300 border-b-2 ${activeShelf === id ? 'border-rose-hue text-deep-taupe' : 'border-transparent text-deep-taupe/60 hover:border-rose-hue/50 hover:text-deep-taupe'}`}
                            >
                                {label} ({wardrobe[id].length})
                            </button>
                        ))}
                    </div>

                    <div>
                        {perfumesOnShelf.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {perfumesOnShelf.map((perfume) => (
                                    <PerfumeCard key={perfume.name} perfume={perfume} onClick={() => onPerfumeClick(perfume)} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white/50 rounded-lg">
                                <p className="text-xl font-serif text-deep-taupe">This shelf is empty.</p>
                                <p className="text-deep-taupe/80 mt-2">Explore fragrances and add them to your collection!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;