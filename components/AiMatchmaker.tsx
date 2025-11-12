import React, { useState, useCallback, useMemo } from 'react';
import { Perfume } from '../types';
import { getFragranceRecommendations } from '../services/geminiService';
import PerfumeCard from './PerfumeCard';
import { SparklesIcon } from './icons/SparklesIcon';
import LoadingSpinner from './LoadingSpinner';
import { commonNotes, scentFamilies, occasions } from '../constants';
import { SunIcon } from './icons/SunIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { MoonIcon } from './icons/MoonIcon';
import { GiftIcon } from './icons/GiftIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { useApiKey } from '../contexts/ApiKeyContext';

const TOTAL_STEPS = 5;

interface QuizAnswers {
  families: string[];
  occasion: string;
  likedNotes: string[];
  dislikedNotes: string[];
  vibe: string;
}

const initialAnswers: QuizAnswers = {
  families: [],
  occasion: '',
  likedNotes: [],
  dislikedNotes: [],
  vibe: '',
};

const AiMatchmaker: React.FC = () => {
  const [quizStep, setQuizStep] = useState(0); // 0 = start screen
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>(initialAnswers);
  const [recommendations, setRecommendations] = useState<Perfume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { resetApiKey } = useApiKey();
  
  const occasionIcons: Record<string, React.ReactNode> = {
    everyday: <SunIcon className="w-10 h-10 mb-2" />,
    office: <BriefcaseIcon className="w-10 h-10 mb-2" />,
    night: <MoonIcon className="w-10 h-10 mb-2" />,
    event: <GiftIcon className="w-10 h-10 mb-2" />,
  };
  
  const handleFindMatch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    let prompt = "Act as an expert fragrance sommelier. I'm looking for a new perfume based on these preferences:\n";
    if (quizAnswers.families.length > 0) prompt += `- Scent Families I Like: ${quizAnswers.families.join(', ')}\n`;
    if (quizAnswers.occasion) prompt += `- Intended Occasion: ${quizAnswers.occasion}\n`;
    if (quizAnswers.likedNotes.length > 0) prompt += `- Notes I Enjoy: ${quizAnswers.likedNotes.join(', ')}\n`;
    if (quizAnswers.dislikedNotes.length > 0) prompt += `- Notes to Avoid: ${quizAnswers.dislikedNotes.join(', ')}\n`;
    if (quizAnswers.vibe) prompt += `- Desired Vibe/Feeling: "${quizAnswers.vibe}"\n`;
    prompt += "\nRecommend 3 real-world, well-known perfumes that fit this profile. For each, provide its name, brand, a poetic one-sentence description, and three separate lists for its key top, middle, and base notes. Also include a rating from 1 to 5 for both longevity and sillage.";

    try {
      const results = await getFragranceRecommendations(prompt);
      setRecommendations(results);
      setQuizStep(TOTAL_STEPS + 1); // Move to results screen
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      if (errorMessage.includes('Invalid API key')) {
        resetApiKey();
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [quizAnswers, resetApiKey]);
  
  const handleStartOver = () => {
      setQuizAnswers(initialAnswers);
      setRecommendations([]);
      setError(null);
      setQuizStep(0);
  }

  const handleUpdateAnswer = <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
      setQuizAnswers(prev => ({...prev, [key]: value}));
  };
  
  const handleToggleListAnswer = (key: 'families' | 'likedNotes' | 'dislikedNotes', value: string) => {
    const currentList = quizAnswers[key] as string[];
    const newList = currentList.includes(value) ? currentList.filter(item => item !== value) : [...currentList, value];
    handleUpdateAnswer(key, newList as any);
  };
  
  const progress = useMemo(() => {
    if (quizStep === 0 || quizStep > TOTAL_STEPS) return 0;
    return (quizStep / TOTAL_STEPS) * 100;
  }, [quizStep]);

  const renderQuizStep = () => {
    switch (quizStep) {
      case 1: // Scent Families
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-serif text-deep-taupe mb-2 text-center">Which scent families are you drawn to?</h2>
            <p className="text-center text-deep-taupe/80 mb-8">Select one or more that appeal to you.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {scentFamilies.map(family => (
                <button
                  key={family.name}
                  onClick={() => handleToggleListAnswer('families', family.name)}
                  className={`p-4 md:p-6 rounded-lg text-center font-serif text-lg text-deep-taupe border-2 transition-all duration-200 transform hover:scale-105
                    ${quizAnswers.families.includes(family.name) ? 'border-rose-hue bg-rose-hue/20' : 'bg-pearl-white/50 border-champagne-gold hover:border-rose-hue/50'}`}
                >
                  {family.name}
                </button>
              ))}
            </div>
          </>
        );
      case 2: // Occasion
         return (
          <>
            <h2 className="text-2xl md:text-3xl font-serif text-deep-taupe mb-2 text-center">When will you wear this fragrance?</h2>
            <p className="text-center text-deep-taupe/80 mb-8">Pick the primary occasion you have in mind.</p>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {occasions.map(occasion => (
                 <button
                   key={occasion.id}
                   onClick={() => handleUpdateAnswer('occasion', occasion.name)}
                   className={`p-4 rounded-lg flex flex-col items-center justify-center font-serif text-lg text-deep-taupe border-2 transition-all duration-200 transform hover:scale-105
                     ${quizAnswers.occasion === occasion.name ? 'border-rose-hue bg-rose-hue/20' : 'bg-pearl-white/50 border-champagne-gold hover:border-rose-hue/50'}`}
                 >
                   {occasionIcons[occasion.id]}
                   {occasion.name}
                 </button>
               ))}
             </div>
          </>
        );
      case 3: // Liked Notes
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-serif text-deep-taupe mb-2 text-center">Which notes do you enjoy?</h2>
            <p className="text-center text-deep-taupe/80 mb-8">Choose as many as you like.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {commonNotes.map(note => (
                <button
                  key={note}
                  onClick={() => handleToggleListAnswer('likedNotes', note)}
                  className={`px-4 py-2 rounded-full border-2 transition-colors duration-200 font-sans
                    ${quizAnswers.likedNotes.includes(note) ? 'bg-rose-hue text-pearl-white border-rose-hue' : 'bg-pearl-white text-deep-taupe border-champagne-gold hover:border-rose-hue/50'}`}
                >
                  {note}
                </button>
              ))}
            </div>
          </>
        );
      case 4: // Disliked Notes
        const availableDislikeNotes = commonNotes.filter(note => !quizAnswers.likedNotes.includes(note));
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-serif text-deep-taupe mb-2 text-center">Are there any notes you want to avoid?</h2>
            <p className="text-center text-deep-taupe/80 mb-8">This helps us narrow down the options.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {availableDislikeNotes.map(note => (
                <button
                  key={note}
                  onClick={() => handleToggleListAnswer('dislikedNotes', note)}
                  className={`px-4 py-2 rounded-full border-2 transition-colors duration-200 font-sans
                    ${quizAnswers.dislikedNotes.includes(note) ? 'bg-deep-taupe text-pearl-white border-deep-taupe' : 'bg-pearl-white text-deep-taupe border-champagne-gold hover:border-deep-taupe/50'}`}
                >
                  {note}
                </button>
              ))}
            </div>
          </>
        );
      case 5: // Vibe
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-serif text-deep-taupe mb-2 text-center">Describe the vibe you're going for.</h2>
            <p className="text-center text-deep-taupe/80 mb-8">Use a few words or a sentence.</p>
            <textarea
              value={quizAnswers.vibe}
              onChange={(e) => handleUpdateAnswer('vibe', e.target.value)}
              placeholder="e.g., 'Confident and mysterious' or 'A fresh, energetic scent for sunny days'"
              rows={4}
              className="w-full max-w-lg mx-auto block p-4 border border-champagne-gold rounded-lg focus:ring-2 focus:ring-rose-hue focus:border-rose-hue transition-colors duration-300 bg-pearl-white"
            />
          </>
        );
      default:
        return null;
    }
  };
  
  if (quizStep === 0) {
    return (
       <div className="py-16 md:py-24 bg-pearl-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-deep-taupe">AI Fragrance Matchmaker</h1>
            <p className="mt-4 text-lg text-deep-taupe/80 max-w-3xl mx-auto">Answer a few questions to let our AI sommelier find your next signature scent.</p>
             <div className="mt-10">
                <button
                  onClick={() => setQuizStep(1)}
                  className="bg-deep-taupe text-pearl-white font-bold py-4 px-10 rounded-full text-lg font-sans hover:bg-rose-hue hover:text-deep-taupe transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto"
                >
                  <SparklesIcon className="w-6 h-6 mr-3" />
                  Start the Quiz
                </button>
            </div>
          </div>
       </div>
    );
  }

  return (
    <div className="py-16 md:py-24 bg-pearl-white">
      <div className="container mx-auto px-4">
        {quizStep <= TOTAL_STEPS && (
            <div className="max-w-4xl mx-auto bg-white/50 shadow-lg rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-champagne-gold/50">
                <div className="mb-8">
                    <div className="w-full bg-champagne-gold rounded-full h-2.5">
                        <div className="bg-rose-hue h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="min-h-[300px] flex flex-col justify-center">
                    {renderQuizStep()}
                </div>

                <div className="flex justify-between items-center mt-8">
                    <button
                        onClick={() => setQuizStep(s => s - 1)}
                        className="flex items-center text-deep-taupe hover:text-rose-hue font-bold font-sans transition-colors"
                        >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back
                    </button>
                    {quizStep < TOTAL_STEPS ? (
                        <button
                            onClick={() => setQuizStep(s => s + 1)}
                            className="bg-deep-taupe text-pearl-white font-bold py-3 px-8 rounded-full text-lg font-sans hover:bg-rose-hue hover:text-deep-taupe transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleFindMatch}
                            className="bg-deep-taupe text-pearl-white font-bold py-3 px-8 rounded-full text-lg font-sans hover:bg-rose-hue hover:text-deep-taupe transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto"
                        >
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            Find My Match
                        </button>
                    )}
                </div>
            </div>
        )}
        
        {isLoading && <LoadingSpinner />}

        {error && 
            <div className="text-center mt-6">
                <p className="text-red-600 bg-red-100 p-4 rounded-lg max-w-2xl mx-auto">{error}</p>
                 <button onClick={handleStartOver} className="mt-4 font-bold text-deep-taupe hover:underline">Start Over</button>
            </div>
        }
        
        {recommendations.length > 0 && quizStep > TOTAL_STEPS && (
          <div className="mt-16 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">Your AI-Curated Matches</h2>
                <p className="text-deep-taupe/80 mb-8">Based on your preferences, we think you'll love these.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {recommendations.map((perfume, index) => (
                <PerfumeCard key={index} perfume={perfume} onClick={() => { /* No-op, detail view not accessible from here */ }} />
              ))}
            </div>
            <div className="text-center mt-12">
                 <button 
                    onClick={handleStartOver}
                    className="bg-pearl-white text-deep-taupe font-bold py-3 px-8 rounded-full text-lg font-sans hover:bg-rose-hue/50 transition-all duration-300 border-2 border-deep-taupe shadow-md"
                >
                    Start a New Quiz
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiMatchmaker;
