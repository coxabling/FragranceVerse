import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Perfume } from '../types';

// Create a new client for each request.
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Centralized error handler
const handleApiError = (error: unknown): never => {
  console.error("Error calling Gemini API:", error);
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes('api key not valid') || message.includes('api key is invalid') || message.includes('requested entity was not found')) {
        throw new Error("Invalid API key. Please select a valid key to continue.");
    }
    throw new Error(`Failed to get a response from the AI: ${error.message}`);
  }
  throw new Error("An unknown error occurred while contacting the AI service.");
};

export const getFragranceRecommendations = async (prompt: string): Promise<Perfume[]> => {
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

    return recommendationsWithReviews;

  } catch (error) {
    handleApiError(error);
  }
};

export const getFragranceRecommendationsByVibe = async (base64Data: string, mimeType: string): Promise<Perfume[]> => {
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

    return recommendationsWithExtras;

  } catch (error) {
    handleApiError(error);
  }
};


export const enhancePost = async (text: string): Promise<string> => {
    if (!text.trim()) return "";
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Rewrite the following user post about perfume to be more poetic, descriptive, and engaging, in the style of a fragrance expert. Keep the core meaning intact. User post: "${text}"`,
        });
        return response.text;
    } catch (error) {
        handleApiError(error);
    }
};

export const getSimilarFragrances = async (perfume: Perfume): Promise<Omit<Perfume, 'reviews'>[]> => {
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
        return parsed.recommendations || parsed;
    } catch (error) {
        handleApiError(error);
    }
};

export const generateFragranceImage = async (perfume: Perfume): Promise<string> => {
    try {
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

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        
        throw new Error("No image data found in the AI response.");

    } catch (error) {
        handleApiError(error);
    }
};
