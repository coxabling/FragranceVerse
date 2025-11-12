
import React from 'react';
import { Perfume } from '../types';
import PerfumeCard from './PerfumeCard';

interface BrowseProps {
  perfumes: Perfume[];
  onPerfumeClick: (perfume: Perfume) => void;
  searchTerm: string;
  totalPerfumes: number;
}

const Browse: React.FC<BrowseProps> = ({ perfumes, onPerfumeClick, searchTerm, totalPerfumes }) => {
  return (
    <div className="py-16 md:py-24 bg-champagne-gold/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-deep-taupe mb-4">
          {searchTerm ? 'Search Results' : 'Explore All Fragrances'}
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-12 text-deep-taupe/80">
          {searchTerm
            ? `Showing ${perfumes.length} results for "${searchTerm}"`
            : `Browse our complete collection of ${totalPerfumes} exquisite scents.`
          }
        </p>
        {perfumes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {perfumes.map((perfume) => (
              <PerfumeCard key={perfume.name} perfume={perfume} onClick={() => onPerfumeClick(perfume)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl font-serif text-deep-taupe">No fragrances found.</p>
            <p className="text-deep-taupe/80 mt-2">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
