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

// Fix: Define AIStudio interface to resolve type conflict and centralize the type definition.
// Fix: Removed 'export' from AIStudio interface to resolve a "Subsequent property declarations must have the same type" error. This type is only used for global augmentation within this file, so it doesn't need to be exported.
interface AIStudio {
  openSelectKey: () => Promise<void>;
  hasSelectedApiKey: () => Promise<boolean>;
}

declare global {
  interface Window {
    aistudio?: AIStudio;
  }
}
