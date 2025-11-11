
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-deep-taupe text-pearl-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center">
            <LogoIcon className="h-8 w-8 text-pearl-white" />
            <span className="font-serif text-xl font-bold ml-2">AI Fragrance Universe</span>
          </div>
          <p className="text-sm text-pearl-white/80">&copy; {new Date().getFullYear()} AI Fragrance Universe. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-pearl-white/80 hover:text-rose-hue transition-colors">Privacy Policy</a>
            <a href="#" className="text-pearl-white/80 hover:text-rose-hue transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
