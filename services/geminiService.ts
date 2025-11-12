
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Perfume } from '../types';
import { saveImage, getImage } from './dbService';

// In-memory caches
const recommendationsCache = new Map<string, Perfume[]>();
const vibeRecommendationsCache = new Map<string, Perfume[]>();
const similarFragrancesCache = new Map<string, Omit<Perfume, 'reviews'>[]>();
const enhancePostCache = new Map<string, string>();


// Create a new client for each request, assuming API_KEY is in the environment.
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // This will be caught by handleApiError and transformed into 'Invalid API key'
    throw new Error("An API Key must be set when running in a browser");
  }
  return new GoogleGenAI({ apiKey });
};

// Centralized error handler
const handleApiError = (error: unknown): never => {
  console.error("Error calling Gemini API:", error);
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    // Check for specific API key-related error messages from the Gemini API
    if (message.includes('api key not valid') || message.includes('api key must be set')) {
      throw new Error('Invalid API key');
    }
    throw new Error(`Failed to get a response from the AI: ${error.message}`);
  }
  throw new Error("An unknown error occurred while contacting the AI service.");
};

export const getFragranceRecommendations = async (prompt: string): Promise<Perfume[]> => {
  const cacheKey = prompt;
  if (recommendationsCache.has(cacheKey)) {
    return recommendationsCache.get(cacheKey)!;
  }
  
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following user input: "${prompt}", act as an expert fragrance sommelier. Recommend 3 real-world, well-known perfumes. For each perfume, provide its name, brand, a poetic one-sentence description, and three separate lists for its key top, middle, and base notes. Also include a rating from 1 to 5 for both longevity and sillage.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  brand: { type: Type.STRING },
                  description: { type: Type.STRING },
                  topNotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  middleNotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  baseNotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  longevity: { type: Type.NUMBER },
                  sillage: { type: Type.NUMBER },
                },
                required: ["name", "brand", "description", "topNotes", "middleNotes", "baseNotes", "longevity", "sillage"],
              },
            },
          },
          required: ["recommendations"],
        },
      },
    });

    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);
    const recommendationsWithReviews = (parsed.recommendations || parsed).map((p: Omit<Perfume, 'reviews' | 'likes' | 'dislikes'>) => ({
        ...p,
        reviews: [],
        likes: Math.floor(Math.random() * 500) + 50,
        dislikes: Math.floor(Math.random() * 50) + 5,
    }));
    
    recommendationsCache.set(cacheKey, recommendationsWithReviews);
    return recommendationsWithReviews;

  } catch (error) {
    handleApiError(error);
  }
};

export const getFragranceRecommendationsByVibe = async (base64Data: string, mimeType: string): Promise<Perfume[]> => {
  const cacheKey = base64Data;
  if (vibeRecommendationsCache.has(cacheKey)) {
      return vibeRecommendationsCache.get(cacheKey)!;
  }

  try {
    const ai = getAiClient();
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: `Based on the vibe and atmosphere of this image, act as an expert fragrance sommelier. Recommend 3 real-world, well-known perfumes that match the mood. For each perfume, provide its name, brand, a poetic one-sentence description, and three separate lists for its key top, middle, and base notes. Also include a rating from 1 to 5 for both longevity and sillage.`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  brand: { type: Type.STRING },
                  description: { type: Type.STRING },
                  topNotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  middleNotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  baseNotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  longevity: { type: Type.NUMBER },
                  sillage: { type: Type.NUMBER },
                },
                required: ["name", "brand", "description", "topNotes", "middleNotes", "baseNotes", "longevity", "sillage"],
              },
            },
          },
          required: ["recommendations"],
        },
      },
    });

    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);
    const recommendationsWithExtras = (parsed.recommendations || parsed).map((p: Omit<Perfume, 'reviews' | 'likes' | 'dislikes'>) => ({
        ...p,
        reviews: [],
        likes: Math.floor(Math.random() * 500) + 50,
        dislikes: Math.floor(Math.random() * 50) + 5,
    }));
    
    vibeRecommendationsCache.set(cacheKey, recommendationsWithExtras);
    return recommendationsWithExtras;

  } catch (error) {
    handleApiError(error);
  }
};


export const enhancePost = async (text: string): Promise<string> => {
    if (!text.trim()) return "";
    
    const cacheKey = text;
    if (enhancePostCache.has(cacheKey)) {
        return enhancePostCache.get(cacheKey)!;
    }
    
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Rewrite the following user post about perfume to be more poetic, descriptive, and engaging, in the style of a fragrance expert. Keep the core meaning intact. User post: "${text}"`,
        });
        const enhancedText = response.text;
        enhancePostCache.set(cacheKey, enhancedText);
        return enhancedText;
    } catch (error) {
        handleApiError(error);
    }
};

export const getSimilarFragrances = async (perfume: Perfume): Promise<Omit<Perfume, 'reviews'>[]> => {
    const cacheKey = `${perfume.brand}-${perfume.name}`;
    if (similarFragrancesCache.has(cacheKey)) {
        return similarFragrancesCache.get(cacheKey)!;
    }

    const allNotes = [...perfume.topNotes, ...perfume.middleNotes, ...perfume.baseNotes].join(', ');
    const prompt = `Given the perfume "${perfume.name}" by "${perfume.brand}" with key notes like ${allNotes}, recommend 3 other real-world, well-known perfumes that have a similar scent profile or vibe. For each recommendation, provide its name, brand, a poetic one-sentence description, and three separate lists for its key top, middle, and base notes. Also include a rating from 1 to 5 for both longevity and sillage. Do not recommend the original perfume itself.`;

    try {
         const ai = getAiClient();
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    brand: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    topNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    middleNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    baseNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    longevity: { type: Type.NUMBER },
                                    sillage: { type: Type.NUMBER },
                                },
                                required: ["name", "brand", "description", "topNotes", "middleNotes", "baseNotes", "longevity", "sillage"],
                            },
                        },
                    },
                    required: ["recommendations"],
                },
            },
        });

        const jsonString = response.text;
        const parsed = JSON.parse(jsonString);
        const recommendations = parsed.recommendations || parsed;
        similarFragrancesCache.set(cacheKey, recommendations);
        return recommendations;
    } catch (error) {
        handleApiError(error);
    }
};

export const generateFragranceImage = async (perfume: Perfume): Promise<string> => {
    const cacheKey = `fragrance_image_${perfume.name}`;
    try {
        const cachedImage = await getImage(cacheKey);
        if (cachedImage) {
            return cachedImage;
        }

        const ai = getAiClient();
        const allNotes = [...perfume.topNotes, ...perfume.middleNotes, ...perfume.baseNotes].slice(0, 5).join(', ');
        const prompt = `A professional, photorealistic product shot of a perfume bottle for "${perfume.name}" by ${perfume.brand}.
        The style is elegant, luxurious, and minimalist.
        The bottle is the central focus, appearing chic and appealing.
        The background is clean and soft-focus, subtly evoking its key notes of ${allNotes}.
        The lighting is bright and airy.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        if (response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
            const dataUrl = `data:image/png;base64,${response.candidates[0].content.parts[0].inlineData.data}`;
            await saveImage(cacheKey, dataUrl);
            return dataUrl;
        }
        
        throw new Error("No image data found in the AI response.");

    } catch (error) {
        handleApiError(error);
    }
};
