
import React, { useState, useCallback, useRef } from 'react';
import { Perfume } from '../types';
import { getFragranceRecommendationsByVibe, generateVibeFragranceImage } from '../services/geminiService';
import { fileToBase64Parts } from '../utils/imageUtils';
import PerfumeCard from './PerfumeCard';
import LoadingSpinner from './LoadingSpinner';
import { UploadIcon } from './icons/UploadIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ScentVisualizerProps {
    onPerfumeClick: (perfume: Perfume) => void;
}

const ScentVisualizer: React.FC<ScentVisualizerProps> = ({ onPerfumeClick }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [recommendations, setRecommendations] = useState<Perfume[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File | null | undefined) => {
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setRecommendations([]);
            setError(null);
        } else {
            setError("Please upload a valid image file (JPEG, PNG, etc.).");
        }
    };

    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvents(e);
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvents(e);
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvents(e);
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };
    
    const handleFindVibe = useCallback(async () => {
        if (!imageFile) return;

        setIsLoading(true);
        setError(null);
        setRecommendations([]);

        try {
            const { base64Data, mimeType } = await fileToBase64Parts(imageFile);
            const perfumeRecommendations = await getFragranceRecommendationsByVibe(base64Data, mimeType);

            // Generate custom, vibe-matched images for each recommendation
            const perfumesWithImages = await Promise.all(
                perfumeRecommendations.map(async (perfume) => {
                    try {
                        const imageUrl = await generateVibeFragranceImage(perfume, { base64Data, mimeType });
                        return { ...perfume, imageUrl }; // Add the generated imageUrl
                    } catch (imageError) {
                        console.error(`Failed to generate image for ${perfume.name}`, imageError);
                        // If image generation fails for one, return the perfume without an image.
                        // The <FragranceImage> component has its own fallback logic.
                        return perfume;
                    }
                })
            );
            
            setRecommendations(perfumesWithImages);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [imageFile]);
    
    const handleReset = () => {
        setImagePreview(null);
        setImageFile(null);
        setRecommendations([]);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="py-16 md:py-24 bg-champagne-gold/20 min-h-[80vh]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-deep-taupe">Scent by Vibe</h1>
                    <p className="mt-4 text-lg text-deep-taupe/80 max-w-3xl mx-auto">Upload an image that captures your mood, and let our AI discover fragrances that match its essence.</p>
                </div>

                <div className="max-w-3xl mx-auto">
                    {!imagePreview && !isLoading && (
                        <div
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragEvents}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex flex-col items-center justify-center p-12 border-4 border-dashed rounded-2xl cursor-pointer transition-colors duration-300
                            ${isDragging ? 'border-rose-hue bg-rose-hue/10' : 'border-champagne-gold hover:border-rose-hue/50 bg-pearl-white/50'}`}
                        >
                            <UploadIcon className="w-16 h-16 text-deep-taupe/40 mb-4" />
                            <p className="text-xl font-serif text-deep-taupe">Drop your image here</p>
                            <p className="text-deep-taupe/60">or click to browse</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => handleFileChange(e.target.files?.[0])}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    )}
                    
                    {imagePreview && (
                         <div className="bg-white/60 p-6 rounded-xl shadow-lg border border-champagne-gold/40 text-center">
                            <img src={imagePreview} alt="Scent vibe preview" className="max-h-96 w-auto mx-auto rounded-lg shadow-md" />
                            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                                <button
                                    onClick={handleFindVibe}
                                    disabled={isLoading}
                                    className="bg-deep-taupe text-pearl-white font-bold py-3 px-8 rounded-full text-lg font-sans hover:bg-rose-hue hover:text-deep-taupe transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <SparklesIcon className={`w-6 h-6 mr-3 ${isLoading ? 'animate-pulse' : ''}`} />
                                    {isLoading ? 'Analyzing Vibe...' : 'Find My Scent Vibe'}
                                </button>
                                <button
                                    onClick={handleReset}
                                    disabled={isLoading}
                                    className="font-bold text-deep-taupe hover:underline disabled:opacity-50"
                                >
                                    Try another image
                                </button>
                            </div>
                        </div>
                    )}

                    {isLoading && <LoadingSpinner />}
                    
                    {error && 
                        <div className="text-center mt-6">
                            <p className="text-red-600 bg-red-100 p-4 rounded-lg max-w-2xl mx-auto">{error}</p>
                            <button onClick={handleReset} className="mt-4 font-bold text-deep-taupe hover:underline">Start Over</button>
                        </div>
                    }

                    {recommendations.length > 0 && !isLoading && (
                        <div className="mt-16 animate-fade-in">
                            <div className="text-center">
                                <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">Your Scent Vibe Results</h2>
                                <p className="text-deep-taupe/80 mb-8">This image evokes these fragrances...</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {recommendations.map((perfume, index) => (
                                    <PerfumeCard key={`${perfume.name}-${index}`} perfume={perfume} onClick={() => onPerfumeClick(perfume)} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScentVisualizer;
