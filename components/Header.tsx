import React, { useState } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { SearchIcon } from './icons/SearchIcon';

type View = 'home' | 'matchmaker' | 'visualizer' | 'community' | 'profile';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, searchTerm, setSearchTerm }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'matchmaker', label: 'AI Matchmaker' },
    { id: 'visualizer', label: 'Scent Wheel' },
    { id: 'community', label: 'Community' },
    { id: 'profile', label: 'My Profile' },
  ] as const;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('home');
    setIsMenuOpen(false); // Close mobile menu on search
  };

  const NavLink: React.FC<{ view: View, label: string }> = ({ view, label }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMenuOpen(false);
      }}
      className={`font-serif text-lg py-2 px-4 rounded-full transition-colors duration-300 w-full text-center md:w-auto ${
        currentView === view ? 'bg-rose-hue/80 text-pearl-white' : 'text-deep-taupe hover:bg-champagne-gold/50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="bg-pearl-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('home')}>
             <LogoIcon className="h-10 w-10 text-deep-taupe" />
             <span className="font-serif text-2xl font-bold ml-2 text-deep-taupe">FragranceVerse</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-2">
              {navItems.map(item => <NavLink key={item.id} view={item.id} label={item.label} />)}
            </nav>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-deep-taupe/60" aria-hidden="true" />
              </div>
              <input
                id="search"
                className="block w-full bg-pearl-white border border-champagne-gold rounded-full py-2 pl-10 pr-3 text-sm placeholder-deep-taupe/60 focus:outline-none focus:ring-1 focus:ring-rose-hue focus:border-rose-hue"
                placeholder="Search..."
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-deep-taupe hover:text-rose-hue hover:bg-champagne-gold/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-hue"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3">
            <form onSubmit={handleSearchSubmit} className="px-2 py-1">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-deep-taupe/60" aria-hidden="true" />
                    </div>
                    <input
                    className="block w-full bg-pearl-white border border-champagne-gold rounded-full py-2 pl-10 pr-3 text-sm placeholder-deep-taupe/60 focus:outline-none focus:ring-1 focus:ring-rose-hue focus:border-rose-hue"
                    placeholder="Search by name, brand, note..."
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </form>
            <div className="flex flex-col items-center space-y-1">
              {navItems.map(item => <NavLink key={item.id} view={item.id} label={item.label} />)}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;