import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface ApiKeyPromptProps {
  onKeySelected: () => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        onKeySelected();
    } else {
        alert("API key selection is not available in this environment.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pearl-white">
      <div className="text-center max-w-lg mx-auto p-8 bg-white/60 rounded-lg shadow-xl border border-champagne-gold/30">
        <SparklesIcon className="w-16 h-16 text-rose-hue mx-auto mb-4" />
        <h1 className="text-3xl font-serif text-deep-taupe mb-4">API Key Required</h1>
        <p className="text-deep-taupe/80 mb-6">
          To use the AI-powered features of this application, you need to select a Gemini API key. Your key is stored securely and is only used for your session.
        </p>
        <button
          onClick={handleSelectKey}
          className="bg-deep-taupe text-pearl-white font-bold py-3 px-8 rounded-full text-lg font-sans hover:bg-rose-hue hover:text-deep-taupe transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Select API Key
        </button>
        <p className="text-xs text-deep-taupe/60 mt-4">
          By using this service, you agree to the Gemini API's terms and may incur charges.
          Please review the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-rose-hue">billing information</a>.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
