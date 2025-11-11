import { GoogleGenAI, Type } from "@google/genai";
import { Perfume } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we'll proceed, but the API call will fail without a key.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getFragranceRecommendations = async (prompt: string): Promise<Perfume[]> => {
  try {
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
    // Add empty reviews array to match the type
    const recommendationsWithReviews = (parsed.recommendations || parsed).map((p: Omit<Perfume, 'reviews'>) => ({
        ...p,
        reviews: [],
    }));

    return recommendationsWithReviews;

  } catch (error) {
    console.error("Error calling Gemini API for recommendations:", error);
    throw new Error("Failed to get recommendations from AI. Please check your API key and try again.");
  }
};


export const enhancePost = async (text: string): Promise<string> => {
    if (!text.trim()) return "";
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Rewrite the following user post about perfume to be more poetic, descriptive, and engaging, in the style of a fragrance expert. Keep the core meaning intact. User post: "${text}"`,
        });
        return response.text;
    } catch (error) {
        console.error("Error enhancing post with Gemini API:", error);
        return text; // Return original text on error
    }
};

export const getSimilarFragrances = async (perfume: Perfume): Promise<Omit<Perfume, 'reviews'>[]> => {
    const allNotes = [...perfume.topNotes, ...perfume.middleNotes, ...perfume.baseNotes].join(', ');
    const prompt = `Given the perfume "${perfume.name}" by "${perfume.brand}" with key notes like ${allNotes}, recommend 3 other real-world, well-known perfumes that have a similar scent profile or vibe. For each recommendation, provide its name, brand, a poetic one-sentence description, and three separate lists for its key top, middle, and base notes. Also include a placeholder image URL from i.ibb.co and a rating from 1 to 5 for both longevity and sillage. Do not recommend the original perfume itself.`;

    try {
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
        console.error("Error calling Gemini API for similar fragrances:", error);
        throw new Error("Failed to get similar fragrances from AI.");
    }
};