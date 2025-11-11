import React, { useState, useCallback } from 'react';
import { Perfume } from '../types';
import { getFragranceRecommendations } from '../services/geminiService';
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
  const [recommendations, setRecommendations] = useState<Perfume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNoteToggle = (note: string) => {
    setSelectedNotes(prev =>
      prev.includes(note) ? prev.filter(n => n !== note) : [...prev, note]
    );
  };

  const handleFindMatch = useCallback(async () => {
    let prompt = '';
    if (activeTab === 'mood') {
        if (!mood.trim()) {
            setError("Please describe your mood or desired scent.");
            return;
        }
        prompt = mood;
    } else if (activeTab === 'scents') {
        if (selectedNotes.length === 0) {
            setError("Please select at least one scent note.");
            return;
        }
        prompt = `A fragrance featuring the notes: ${selectedNotes.join(', ')}.`;
    } else {
        return; // Other tabs not implemented
    }

    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const results = await getFragranceRecommendations(prompt);
      setRecommendations(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [mood, activeTab, selectedNotes]);
  
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
        return <div>
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
         return <div className="text-center p-8 bg-champagne-gold/20 rounded-lg flex flex-col items-center justify-center">
             <UploadIcon className="w-12 h-12 text-rose-hue mb-4"/>
            <p className="font-serif text-lg">Photo vibe matching coming soon!</p>
            <p>Upload a photo to find a fragrance that matches its atmosphere.</p>
        </div>;
    }
  };

  const isButtonDisabled = isLoading || (activeTab === 'mood' && !mood.trim()) || (activeTab === 'scents' && selectedNotes.length === 0) || activeTab === 'vibe';

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
          
          <div className="mb-6 min-h-[150px] flex items-center">
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
