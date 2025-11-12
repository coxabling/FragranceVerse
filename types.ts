export interface Review {
  author: string;
  rating: number; // out of 5
  comment: string;
  date: string;
}

export interface ClonePerfume {
  name: string;
  brand: string;
  notes?: string;
}

export interface Perfume {
  name: string;
  brand: string;
  description: string;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  imageUrl?: string;
  family?: string;
  longevity: number; // Rating out of 5
  sillage: number;   // Rating out of 5
  reviews: Review[];
  likes: number;
  dislikes: number;
  isVerified?: boolean;
  amazonSearchTerm?: string;
  affiliate?: {
    provider: 'amazon';
    tag: string;
  };
  clones?: ClonePerfume[];
}

export interface ScentFamily {
  name: string;
  description: string;
  perfumes: Perfume[];
  color: string;
}

export type WardrobeShelf = 'own' | 'want' | 'tried';

export interface Wardrobe {
  own: Perfume[];
  want: Perfume[];
  tried: Perfume[];
}

// Fix: To resolve the "Subsequent property declarations must have the same type" error,
// the AIStudio interface is moved inside the `declare global` block. This ensures it's
// declared in the global scope, preventing conflicts when augmenting the global Window type from within a module.
declare global {
  interface AIStudio {
    openSelectKey: () => Promise<void>;
    hasSelectedApiKey: () => Promise<boolean>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
