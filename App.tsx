
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AiMatchmaker from './components/AiMatchmaker';
import ScentVisualizer from './components/ScentVisualizer';
import CommunityHub from './components/CommunityHub';
import Footer from './components/Footer';
import { featuredPerfumes as initialPerfumes } from './constants';
import PerfumeCard from './components/PerfumeCard';
import PerfumeDetail from './components/PerfumeDetail';
import Profile from './components/Profile';
import { Perfume, Wardrobe, WardrobeShelf } from './types';
import Browse from './components/Browse';

type View = 'home' | 'matchmaker' | 'visualizer' | 'community' | 'profile' | 'browse';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [perfumes, setPerfumes] = useState<Perfume[]>(initialPerfumes);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [userWardrobe, setUserWardrobe] = useState<Wardrobe>({ own: [], want: [], tried: [] });
  const [userRatings, setUserRatings] = useState<Record<string, 'like' | 'dislike'>>({});
  const [recentlyViewed, setRecentlyViewed] = useState<Perfume[]>([]);

  useEffect(() => {
    try {
      const storedRecent = localStorage.getItem('recentlyViewed');
      if (storedRecent) {
        const recentNames: string[] = JSON.parse(storedRecent);
        const recentPerfumes = recentNames
          .map(name => initialPerfumes.find(p => p.name === name))
          .filter((p): p is Perfume => p !== undefined);
        setRecentlyViewed(recentPerfumes);
      }
    } catch (error) {
      console.error("Failed to parse recently viewed perfumes from localStorage", error);
      localStorage.removeItem('recentlyViewed');
    }
  }, []);
  
  const handlePerfumeClick = (perfume: Perfume) => {
    const latestPerfumeState = perfumes.find(p => p.name === perfume.name);
    setSelectedPerfume(latestPerfumeState || perfume);

    setRecentlyViewed(prev => {
      const newRecentlyViewed = [perfume, ...prev.filter(p => p.name !== perfume.name)].slice(0, 8);
      try {
        const recentNames = newRecentlyViewed.map(p => p.name);
        localStorage.setItem('recentlyViewed', JSON.stringify(recentNames));
      } catch (error) {
        console.error("Failed to save recently viewed perfumes to localStorage", error);
      }
      return newRecentlyViewed;
    });
  };

  const handleBack = () => {
    setSelectedPerfume(null);
  };

  const handleUpdateWardrobe = (perfume: Perfume, shelf: WardrobeShelf) => {
    setUserWardrobe(prev => {
      const newWardrobe: Wardrobe = {
        own: prev.own.filter(p => p.name !== perfume.name),
        want: prev.want.filter(p => p.name !== perfume.name),
        tried: prev.tried.filter(p => p.name !== perfume.name),
      };
      newWardrobe[shelf] = [...newWardrobe[shelf], perfume];
      return newWardrobe;
    });
  };
  
  const handleRatingUpdate = (perfumeName: string, newAction: 'like' | 'dislike' | null, oldAction: 'like' | 'dislike' | null) => {
    setPerfumes(prevPerfumes =>
      prevPerfumes.map(p => {
        if (p.name === perfumeName) {
          const newPerfume = { ...p };
          if (oldAction === 'like') newPerfume.likes--;
          if (oldAction === 'dislike') newPerfume.dislikes--;
          if (newAction === 'like') newPerfume.likes++;
          if (newAction === 'dislike') newPerfume.dislikes++;
          return newPerfume;
        }
        return p;
      })
    );
    setUserRatings(prev => {
      const newRatings = { ...prev };
      if (newAction) {
        newRatings[perfumeName] = newAction;
      } else {
        delete newRatings[perfumeName];
      }
      return newRatings;
    });
  };

  const filteredPerfumes = searchTerm.trim() === ''
    ? perfumes
    : perfumes.filter(perfume => {
        const lowercasedTerm = searchTerm.toLowerCase();
        const allNotes = [...perfume.topNotes, ...perfume.middleNotes, ...perfume.baseNotes];
        return (
          perfume.name.toLowerCase().includes(lowercasedTerm) ||
          perfume.brand.toLowerCase().includes(lowercasedTerm) ||
          allNotes.some(note => note.toLowerCase().includes(lowercasedTerm))
        );
      });
  
  const trendingPerfumeNames = ['Black Opium', 'Santal 33', 'Acqua di Giò', 'Spicebomb'];
  const trendingPerfumes = perfumes.filter(p => trendingPerfumeNames.includes(p.name));

  const renderHomeContent = () => (
     <>
        <Hero onDiscoverClick={() => setCurrentView('matchmaker')} />
        <div className="py-16 md:py-24 bg-champagne-gold/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif text-center text-deep-taupe mb-4">
              {searchTerm ? `Search Results` : 'Featured Fragrances'}
            </h2>
            <p className="text-center max-w-2xl mx-auto mb-12 text-deep-taupe/80">
              {searchTerm 
                ? `Showing ${filteredPerfumes.length} results for "${searchTerm}"`
                : 'Explore our curated selection of timeless classics and modern masterpieces.'
              }
            </p>
            {filteredPerfumes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredPerfumes.map((perfume) => (
                  <PerfumeCard key={perfume.name} perfume={perfume} onClick={() => handlePerfumeClick(perfume)} />
                ))}
              </div>
            ) : (
               <div className="text-center py-16">
                    <p className="text-xl font-serif text-deep-taupe">No fragrances found.</p>
                    <p className="text-deep-taupe/80 mt-2">Try adjusting your search terms or explore our featured scents.</p>
                </div>
            )}
          </div>
        </div>
        
        {!searchTerm && (
           <>
            {recentlyViewed.length > 0 && (
                <div className="py-16 md:py-24 bg-pearl-white">
                    <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-serif text-center text-deep-taupe mb-4">
                        Recently Viewed
                    </h2>
                    <p className="text-center max-w-2xl mx-auto mb-12 text-deep-taupe/80">
                        Picking up where you left off. Here are the last few fragrances you explored.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recentlyViewed.map((perfume) => (
                        <PerfumeCard key={`${perfume.name}-recent`} perfume={perfume} onClick={() => handlePerfumeClick(perfume)} />
                        ))}
                    </div>
                    </div>
                </div>
            )}
            <div className="py-16 md:py-24 bg-champagne-gold/10">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-serif text-center text-deep-taupe mb-4">
                        Trending Now
                    </h2>
                    <p className="text-center max-w-2xl mx-auto mb-12 text-deep-taupe/80">
                        Discover the scents everyone is talking about. These are the current fan favorites based on community engagement.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {trendingPerfumes.map((perfume) => (
                        <PerfumeCard key={perfume.name} perfume={perfume} onClick={() => handlePerfumeClick(perfume)} />
                        ))}
                    </div>
                </div>
            </div>
          </>
        )}
      </>
  );
  
  const activePerfume = selectedPerfume ? perfumes.find(p => p.name === selectedPerfume.name) : null;

  const renderView = () => {
    if (activePerfume) {
      return <PerfumeDetail 
        perfume={activePerfume} 
        onBack={handleBack} 
        onUpdateWardrobe={handleUpdateWardrobe}
        wardrobe={userWardrobe}
        onRatingUpdate={handleRatingUpdate}
        userAction={userRatings[activePerfume.name] || null}
      />;
    }

    switch (currentView) {
      case 'matchmaker':
        return <AiMatchmaker />;
      case 'visualizer':
        return <ScentVisualizer onPerfumeClick={handlePerfumeClick} />;
      case 'community':
        return <CommunityHub />;
      case 'profile':
        return <Profile wardrobe={userWardrobe} onPerfumeClick={handlePerfumeClick} />;
      case 'browse':
        return <Browse perfumes={filteredPerfumes} onPerfumeClick={handlePerfumeClick} searchTerm={searchTerm} totalPerfumes={perfumes.length} />;
      case 'home':
      default:
        return renderHomeContent();
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        currentView={currentView}
        setCurrentView={(view) => {
          setSelectedPerfume(null);
          setCurrentView(view);
        }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
