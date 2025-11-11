import React, { useState, useCallback } from 'react';
import { Perfume } from '../types';
import { getFragranceRecommendations, getFragranceRecommendationsByVibe } from '../services/geminiService';
import PerfumeCard from './PerfumeCard';
import { SparklesIcon } from './icons/SparklesIcon';
import { UploadIcon } from './icons/UploadIcon';
import LoadingSpinner from './LoadingSpinner';
import { commonNotes } from '../constants';

type MatchmakerTab = 'mood' | 'scents' | 'vibe';

const AiMatchmaker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MatchmakerTab>('mood');
  const [mood, setMood] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [image, setImage] = useState<{ file: File; dataUrl: string } | null>(null);
  const [recommendations, setRecommendations] = useState<Perfume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNoteToggle = (note: string) => {
    setSelectedNotes(prev =>
      prev.includes(note) ? prev.filter(n => n !== note) : [...prev, note]
    );
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({ file, dataUrl: reader.result as string });
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFindMatch = useCallback(async () => {
    let prompt = '';
    
    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      let results: Perfume[];
      if (activeTab === 'mood') {
        if (!mood.trim()) {
            setError("Please describe your mood or desired scent.");
            setIsLoading(false);
            return;
        }
        prompt = mood;
        results = await getFragranceRecommendations(prompt);
      } else if (activeTab === 'scents') {
        if (selectedNotes.length === 0) {
            setError("Please select at least one scent note.");
            setIsLoading(false);
            return;
        }
        prompt = `A fragrance featuring the notes: ${selectedNotes.join(', ')}.`;
        results = await getFragranceRecommendations(prompt);
      } else if (activeTab === 'vibe') {
        if (!image) {
          setError("Please upload an image.");
          setIsLoading(false);
          return;
        }
        const base64Data = image.dataUrl.split(',')[1];
        const mimeType = image.file.type;
        results = await getFragranceRecommendationsByVibe(base64Data, mimeType);
      } else {
        return;
      }
      setRecommendations(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [mood, activeTab, selectedNotes, image]);
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'mood':
        return (
          <div>
            <label htmlFor="mood" className="block text-lg font-serif text-deep-taupe mb-2">Describe your current mood or desired feeling</label>
            <textarea
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g., 'A confident and mysterious evening vibe' or 'A fresh, energetic scent for sunny days'"
              rows={4}
              className="w-full p-4 border border-champagne-gold rounded-lg focus:ring-2 focus:ring-rose-hue focus:border-rose-hue transition-colors duration-300 bg-pearl-white"
            />
          </div>
        );
      case 'scents':
        return <div className="w-full">
            <label className="block text-lg font-serif text-deep-taupe mb-4 text-center">Select your favorite scent notes</label>
            <div className="flex flex-wrap justify-center gap-3">
                {commonNotes.map(note => (
                    <button
                        key={note}
                        onClick={() => handleNoteToggle(note)}
                        className={`px-4 py-2 rounded-full border-2 transition-colors duration-200 font-sans
                            ${selectedNotes.includes(note) 
                                ? 'bg-rose-hue text-pearl-white border-rose-hue' 
                                : 'bg-pearl-white text-deep-taupe border-champagne-gold hover:border-rose-hue/50'
                            }`}
                    >
                        {note}
                    </button>
                ))}
            </div>
        </div>;
      case 'vibe':
         return (
            <div className="text-center w-full flex flex-col items-center">
                <label htmlFor="vibe-upload" className="cursor-pointer block w-full max-w-md p-8 border-2 border-dashed border-champagne-gold rounded-lg hover:bg-champagne-gold/20 transition-colors">
                    <UploadIcon className="w-12 h-12 text-rose-hue mx-auto mb-4"/>
                    <p className="font-serif text-lg">Find a fragrance from a photo</p>
                    <p className="text-sm text-deep-taupe/80">Click to select an image that captures your desired vibe.</p>
                </label>
                <input id="vibe-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                {image && (
                    <div className="mt-4 relative">
                        <img src={image.dataUrl} alt="Preview" className="max-h-40 mx-auto rounded-lg shadow-md" />
                        <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">&times;</button>
                    </div>
                )}
            </div>
        );
    }
  };

  const isButtonDisabled = isLoading || (activeTab === 'mood' && !mood.trim()) || (activeTab === 'scents' && selectedNotes.length === 0) || (activeTab === 'vibe' && !image);

  return (
    <div className="py-16 md:py-24 bg-pearl-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-deep-taupe">AI Fragrance Matchmaker</h1>
          <p className="mt-4 text-lg text-deep-taupe/80 max-w-3xl mx-auto">Let our AI sommelier find your next signature scent. Choose your method of discovery below.</p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white/50 shadow-lg rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-champagne-gold/50">
          <div className="border-b border-champagne-gold mb-6 flex justify-center space-x-2 md:space-x-4">
            {(['mood', 'scents', 'vibe'] as MatchmakerTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize py-3 px-4 md:px-6 font-serif text-lg transition-all duration-300 border-b-2 ${activeTab === tab ? 'border-rose-hue text-deep-taupe' : 'border-transparent text-deep-taupe/60 hover:border-rose-hue/50 hover:text-deep-taupe'}`}
              >
                {tab === 'vibe' ? 'By Vibe' : tab === 'scents' ? 'By Scent' : 'By Mood'}
              </button>
            ))}
          </div>
          
          <div className="mb-6 min-h-[150px] flex items-center justify-center">
            {renderTabContent()}
          </div>
          
          <div className="text-center">
            <button
              onClick={handleFindMatch}
              disabled={isButtonDisabled}
              className="bg-deep-taupe text-pearl-white font-bold py-3 px-8 rounded-full text-lg font-sans hover:bg-rose-hue hover:text-deep-taupe transition-all duration-300 transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center mx-auto"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              {isLoading ? 'Analyzing...' : 'Find My Match'}
            </button>
          </div>
        </div>

        {error && <p className="text-center text-red-600 mt-6">{error}</p>}
        
        {isLoading && <LoadingSpinner />}

        {recommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-serif text-center mb-8">Your Personalized Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {recommendations.map((perfume, index) => (
                <PerfumeCard key={index} perfume={perfume} onClick={() => { /* No-op, detail view not accessible from here */ }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiMatchmaker;
