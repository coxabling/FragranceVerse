import { GoogleGenAI, Type } from "@google/genai";
import { Perfume } from '../types';

// Create a new client for each request to ensure the latest key from the dialog is used.
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // This will be caught by our UI and prompt for a key selection.
    throw new Error("Your API key is not valid. Please select a different key.");
  }
  return new GoogleGenAI({ apiKey });
};

// Centralized error handler
const handleApiError = (error: unknown): never => {
  console.error("Error calling Gemini API:", error);
  if (error instanceof Error) {
    if (error.message.includes("API key not valid") || error.message.includes("Requested entity was not found")) {
      throw new Error("Your API key is not valid. Please select a different key.");
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
      contents: `Based on the following user input: "${prompt}", act as an expert fragrance sommelier. Recommend 3 real-world, well-known perfumes. For each perfume, provide its name, brand, a poetic one-sentence description, and three separate lists for its key top, middle, and base notes. Also include a placeholder image URL from i.ibb.co and a rating from 1 to 5 for both longevity and sillage.`,
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
                  imageUrl: { type: Type.STRING },
                  longevity: { type: Type.NUMBER },
                  sillage: { type: Type.NUMBER },
                },
                required: ["name", "brand", "description", "topNotes", "middleNotes", "baseNotes", "imageUrl", "longevity", "sillage"],
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
      text: `Based on the vibe and atmosphere of this image, act as an expert fragrance sommelier. Recommend 3 real-world, well-known perfumes that match the mood. For each perfume, provide its name, brand, a poetic one-sentence description, and three separate lists for its key top, middle, and base notes. Also include a placeholder image URL from i.ibb.co and a rating from 1 to 5 for both longevity and sillage.`,
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
                  imageUrl: { type: Type.STRING },
                  longevity: { type: Type.NUMBER },
                  sillage: { type: Type.NUMBER },
                },
                required: ["name", "brand", "description", "topNotes", "middleNotes", "baseNotes", "imageUrl", "longevity", "sillage"],
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
    const prompt = `Given the perfume "${perfume.name}" by "${perfume.brand}" with key notes like ${allNotes}, recommend 3 other real-world, well-known perfumes that have a similar scent profile or vibe. For each recommendation, provide its name, brand, a poetic one-sentence description, and three separate lists for its key top, middle, and base notes. Also include a placeholder image URL from i.ibb.co and a rating from 1 to 5 for both longevity and sillage. Do not recommend the original perfume itself.`;

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
                                    imageUrl: { type: Type.STRING },
                                    longevity: { type: Type.NUMBER },
                                    sillage: { type: Type.NUMBER },
                                },
                                required: ["name", "brand", "description", "topNotes", "middleNotes", "baseNotes", "imageUrl", "longevity", "sillage"],
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