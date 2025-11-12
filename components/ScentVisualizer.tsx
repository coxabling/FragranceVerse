
import React, { useState } from 'react';
import { scentFamilies } from '../constants';
import { Perfume, ScentFamily } from '../types';
import PerfumeCard from './PerfumeCard';

interface ScentVisualizerProps {
    onPerfumeClick: (perfume: Perfume) => void;
}

const ScentVisualizer: React.FC<ScentVisualizerProps> = ({ onPerfumeClick }) => {
    const [activeFamily, setActiveFamily] = useState<ScentFamily | null>(scentFamilies[0]);

    const containerSize = 400;
    const center = containerSize / 2;
    const radius = 150;
    const activeSize = 180;
    const inactiveSize = 90;

    const inactiveFamilies = scentFamilies.filter(f => f.name !== activeFamily?.name);

    return (
        <div className="py-16 md:py-24 bg-champagne-gold/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-serif text-deep-taupe">Interactive Scent Wheel</h1>
                    <p className="mt-4 text-lg text-deep-taupe/80 max-w-3xl mx-auto">Visually explore the world of fragrances. Click a family to discover its unique character and representative scents.</p>
                </div>

                <div className="flex flex-col items-center justify-center gap-8">
                    {/* New Animated Scent Wheel */}
                    <div className="relative" style={{ width: `${containerSize}px`, height: `${containerSize}px` }}>
                        {scentFamilies.map((family) => {
                            const isActive = activeFamily?.name === family.name;
                            let style = {};

                            if (isActive) {
                                style = {
                                    width: `${activeSize}px`,
                                    height: `${activeSize}px`,
                                    top: `${center - activeSize / 2}px`,
                                    left: `${center - activeSize / 2}px`,
                                };
                            } else {
                                const inactiveIndex = inactiveFamilies.findIndex(f => f.name === family.name);
                                const angle = (inactiveIndex / inactiveFamilies.length) * 2 * Math.PI - Math.PI / 2;
                                style = {
                                    width: `${inactiveSize}px`,
                                    height: `${inactiveSize}px`,
                                    top: `${center + radius * Math.sin(angle) - inactiveSize / 2}px`,
                                    left: `${center + radius * Math.cos(angle) - inactiveSize / 2}px`,
                                };
                            }

                            return (
                                <button
                                    key={family.name}
                                    style={style}
                                    className={`absolute rounded-full flex items-center justify-center text-center p-2 cursor-pointer shadow-lg transition-all duration-700 ease-in-out
                                    ${family.color} hover:border-4 hover:border-deep-taupe/50`}
                                    onClick={() => setActiveFamily(family)}
                                >
                                    <span className={`font-serif font-bold text-deep-taupe text-shadow transition-all duration-300 ${isActive ? 'text-2xl' : 'text-base'}`}>
                                        {family.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Family Details & Perfumes */}
                    <div className="w-full mt-8">
                        {activeFamily ? (
                            <div key={activeFamily.name} className="animate-fade-in text-center max-w-6xl mx-auto">
                                <h2 className="text-3xl font-serif text-deep-taupe mb-2">{activeFamily.name}</h2>
                                <p className="text-deep-taupe/80 mb-8 max-w-2xl mx-auto">{activeFamily.description}</p>
                                {activeFamily.perfumes.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        {activeFamily.perfumes.map(p => <PerfumeCard key={p.name} perfume={p} onClick={() => onPerfumeClick(p)} />)}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white/50 rounded-md">
                                        <p className="font-serif text-xl">No featured perfumes in this category yet.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-deep-taupe/80">
                                <p>Click on a scent family to learn more.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScentVisualizer;
