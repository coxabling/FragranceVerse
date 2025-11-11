import React, { useState, useEffect } from 'react';
import { Perfume, Wardrobe, WardrobeShelf, Review } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { getSimilarFragrances } from '../services/geminiService';
import PerfumeCard from './PerfumeCard';
import LoadingSpinner from './LoadingSpinner';
import { PlusIcon } from './icons/PlusIcon';
import { CheckIcon } from './icons/CheckIcon';
import { VerifiedIcon } from './icons/VerifiedIcon';
import { ShoppingBagIcon } from './icons/ShoppingBagIcon';
import { ThumbUpIcon } from './icons/ThumbUpIcon';
import { ThumbDownIcon } from './icons/ThumbDownIcon';
import { useApiKey } from '../contexts/ApiKeyContext';

interface PerfumeDetailProps {
  perfume: Perfume;
  onBack: () => void;
  onUpdateWardrobe: (perfume: Perfume, shelf: WardrobeShelf) => void;
  wardrobe: Wardrobe;
  onRatingUpdate: (perfumeName: string, newAction: 'like' | 'dislike' | null, oldAction: 'like' | 'dislike' | null) => void;
  userAction: 'like' | 'dislike' | null;
}

const RatingBar: React.FC<{ label: string; rating: number }> = ({ label, rating }) => (
  <div>
    <p className="text-sm font-sans font-semibold text-deep-taupe mb-1">{label}</p>
    <div className="flex items-center">
      <div className="w-full bg-champagne-gold rounded-full h-2.5">
        <div className="bg-rose-hue h-2.5 rounded-full" style={{ width: `${(rating / 5) * 100}%` }}></div>
      </div>
      <span className="text-sm font-bold text-deep-taupe ml-3">{rating}/5</span>
    </div>
  </div>
);

const NotesSection: React.FC<{ title: string; notes: string[] }> = ({ title, notes }) => (
    <div>
        <h4 className="text-lg font-serif font-bold text-deep-taupe mb-2">{title}</h4>
        <div className="flex flex-wrap gap-2">
            {notes.map((note, index) => (
                <span key={index} className="bg-champagne-gold/50 text-deep-taupe text-sm font-medium px-3 py-1.5 rounded-full">
                    {note}
                </span>
            ))}
        </div>
    </div>
);

const PerfumeDetail: React.FC<PerfumeDetailProps> = ({ perfume, onBack, onUpdateWardrobe, wardrobe, onRatingUpdate, userAction }) => {
  const [similarFragrances, setSimilarFragrances] = useState<Omit<Perfume, 'reviews'|'likes'|'dislikes'>[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(true);
  const [reviews, setReviews] = useState<Review[]>(perfume.reviews);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const { resetApiKey } = useApiKey();

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        setIsLoadingSimilar(true);
        const similar = await getSimilarFragrances(perfume);
        setSimilarFragrances(similar);
      } catch (error) {
        console.error(error);
        if (error instanceof Error && error.message.includes('Your API key is not valid')) {
            resetApiKey();
        }
      } finally {
        setIsLoadingSimilar(false);
      }
    };
    fetchSimilar();
  }, [perfume, resetApiKey]);

  const handleRatingClick = (action: 'like' | 'dislike') => {
    const oldAction = userAction;
    const newAction = oldAction === action ? null : action;
    onRatingUpdate(perfume.name, newAction, oldAction);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.comment && newReview.rating > 0) {
      const review: Review = {
        author: 'You',
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0],
      };
      setReviews(prev => [review, ...prev]);
      setNewReview({ rating: 0, comment: '' });
    }
  };

  const getPerfumeShelf = (perfumeName: string): WardrobeShelf | null => {
    if (wardrobe.own.some(p => p.name === perfumeName)) return 'own';
    if (wardrobe.want.some(p => p.name === perfumeName)) return 'want';
    if (wardrobe.tried.some(p => p.name === perfumeName)) return 'tried';
    return null;
  }

  const currentShelf = getPerfumeShelf(perfume.name);

  const WardrobeButtons: React.FC = () => {
    const shelves: { id: WardrobeShelf, label: string }[] = [
      { id: 'own', label: 'I Own It' },
      { id: 'want', label: 'I Want It' },
      { id: 'tried', label: 'I\'ve Tried It' },
    ];
    return (
        <div className="mt-6 p-4 bg-champagne-gold/20 rounded-lg">
            <h4 className="text-md font-serif font-bold text-deep-taupe mb-3 text-center">Add to My Wardrobe</h4>
            <div className="flex justify-center space-x-2">
                {shelves.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => onUpdateWardrobe(perfume, id)}
                        className={`flex items-center text-xs sm:text-sm px-3 py-2 rounded-full border-2 transition-colors duration-200 font-sans
                            ${currentShelf === id
                                ? 'bg-deep-taupe text-pearl-white border-deep-taupe'
                                : 'bg-pearl-white text-deep-taupe border-champagne-gold hover:border-deep-taupe/50'
                            }`}
                    >
                        {currentShelf === id ? <CheckIcon className="w-4 h-4 mr-1.5" /> : <PlusIcon className="w-4 h-4 mr-1.5" />}
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
  };
  
  const amazonAffiliateTag = perfume.affiliate?.tag ?? 'coxabling0e-21';
  const amazonLink = perfume.amazonSearchTerm 
    ? `https://www.amazon.com/s?k=${encodeURIComponent(perfume.amazonSearchTerm)}&tag=${amazonAffiliateTag}`
    : null;

  return (
    <div className="animate-fade-in">
      <div className="py-12 md:py-16 bg-pearl-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
              <button
                onClick={onBack}
                className="flex items-center text-deep-taupe hover:text-rose-hue font-bold mb-8 font-sans transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to fragrances
              </button>
            
              <div className="bg-white/60 rounded-lg shadow-xl overflow-hidden border border-champagne-gold/30 md:flex">
                  <div className="md:w-1/2 p-4 flex justify-center items-center">
                      <img src={perfume.imageUrl} alt={perfume.name} className="max-h-[500px] object-contain rounded-lg" />
                  </div>
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                      <h1 className="text-4xl lg:text-5xl font-serif font-bold text-deep-taupe">{perfume.name}</h1>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xl text-rose-hue font-medium">{perfume.brand}</p>
                        {perfume.isVerified && (
                            <div className="flex items-center gap-1.5 text-deep-taupe" title="Verified Partner">
                                <VerifiedIcon className="w-5 h-5" />
                                <span className="text-sm font-sans font-semibold">Verified</span>
                            </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 my-4 py-2 border-y border-champagne-gold/50">
                          <button
                              onClick={() => handleRatingClick('like')}
                              className={`flex items-center gap-2 text-deep-taupe transition-colors duration-200 hover:text-green-600 ${userAction === 'like' ? 'text-green-600' : ''}`}
                              aria-label="Like this perfume"
                          >
                              <ThumbUpIcon className={`w-6 h-6 ${userAction === 'like' ? 'fill-current' : 'fill-none'}`} />
                              <span className="font-sans font-bold text-lg">{perfume.likes.toLocaleString()}</span>
                          </button>
                          <button
                              onClick={() => handleRatingClick('dislike')}
                              className={`flex items-center gap-2 text-deep-taupe transition-colors duration-200 hover:text-red-600 ${userAction === 'dislike' ? 'text-red-600' : ''}`}
                              aria-label="Dislike this perfume"
                          >
                              <ThumbDownIcon className={`w-6 h-6 ${userAction === 'dislike' ? 'fill-current' : 'fill-none'}`} />
                              <span className="font-sans font-bold text-lg">{perfume.dislikes.toLocaleString()}</span>
                          </button>
                      </div>

                      <p className="text-deep-taupe/80 text-base mb-6">{perfume.description}</p>
                      
                      <div className="space-y-4 mb-6">
                          <RatingBar label="Longevity" rating={perfume.longevity} />
                          <RatingBar label="Sillage" rating={perfume.sillage} />
                      </div>

                      <div className="space-y-6">
                          <NotesSection title="Top Notes" notes={perfume.topNotes} />
                          <NotesSection title="Middle Notes" notes={perfume.middleNotes} />
                          <NotesSection title="Base Notes" notes={perfume.baseNotes} />
                      </div>
                      <WardrobeButtons />
                      {amazonLink && (
                        <div className="mt-6">
                            <a
                                href={amazonLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center bg-[#FF9900] text-black font-bold py-3 px-8 rounded-full text-lg font-sans hover:bg-[#FFAA33] transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                <ShoppingBagIcon className="w-6 h-6 mr-3" />
                                Buy on Amazon
                            </a>
                            <p className="text-xs text-center mt-2 text-deep-taupe/60">As an Amazon Associate, we earn from qualifying purchases.</p>
                        </div>
                      )}
                  </div>
              </div>
          </div>
        </div>
      </div>
      
      {/* Similar Fragrances Section */}
      <div className="py-12 md:py-16 bg-champagne-gold/20">
          <div className="container mx-auto px-4">
              <h2 className="text-3xl font-serif text-center text-deep-taupe mb-8">You Might Also Love...</h2>
              {isLoadingSimilar ? <LoadingSpinner /> : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                      {similarFragrances.map((p, index) => (
                          <PerfumeCard key={index} perfume={{...p, reviews: [], likes: 0, dislikes: 0}} onClick={() => { /* This would require more state management to chain detail views */ }} />
                      ))}
                  </div>
              )}
          </div>
      </div>

       {/* Reviews Section */}
       <div className="py-12 md:py-16 bg-pearl-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif text-deep-taupe mb-8">Community Reviews</h2>
            {/* Review Form */}
            <div className="bg-white/70 p-6 rounded-xl shadow-lg border border-champagne-gold/40 mb-8">
              <form onSubmit={handleReviewSubmit}>
                <h3 className="font-serif text-xl mb-4">Leave Your Review</h3>
                <div className="flex items-center mb-4">
                  <span className="mr-4 font-sans">Rating:</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button type="button" key={star} onClick={() => setNewReview(s => ({ ...s, rating: star }))}>
                      <svg className={`w-6 h-6 ${newReview.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.06 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(s => ({ ...s, comment: e.target.value }))}
                  placeholder={`Share your thoughts on ${perfume.name}...`}
                  rows={3}
                  className="w-full p-3 border border-champagne-gold rounded-lg focus:ring-2 focus:ring-rose-hue"
                />
                <div className="text-right mt-3">
                  <button type="submit" disabled={!newReview.comment || newReview.rating === 0} className="bg-deep-taupe text-pearl-white font-bold py-2 px-6 rounded-full hover:bg-rose-hue disabled:bg-gray-400">
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
            {/* Existing Reviews */}
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={index} className="border-b border-champagne-gold pb-4">
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${review.rating > i ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.06 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" /></svg>
                    ))}
                  </div>
                  <p className="text-deep-taupe/90 mb-2">{review.comment}</p>
                  <p className="text-sm text-deep-taupe/60">
                    - {review.author} on {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scent-Alikes & Dupes Section */}
      {perfume.clones && perfume.clones.length > 0 && (
          <div className="py-12 md:py-16 bg-champagne-gold/20">
              <div className="container mx-auto px-4">
                  <div className="max-w-3xl mx-auto">
                      <h2 className="text-3xl font-serif text-deep-taupe mb-8">Scent-Alikes & Dupes</h2>
                      <p className="text-deep-taupe/80 mb-6 -mt-4">
                          Explore affordable alternatives and fragrances with a similar DNA, based on community submissions.
                      </p>
                      <div className="space-y-4">
                          {perfume.clones.map((clone, index) => (
                              <div key={index} className="bg-white/70 p-4 rounded-xl shadow-lg border border-champagne-gold/40 flex justify-between items-center">
                                  <div>
                                      <p className="font-bold font-sans text-deep-taupe">{clone.name}</p>
                                      <p className="text-sm text-rose-hue">{clone.brand}</p>
                                  </div>
                                  {clone.notes && (
                                      <p className="text-xs text-right text-deep-taupe/70 bg-champagne-gold/50 px-2 py-1 rounded-lg">{clone.notes}</p>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default PerfumeDetail;