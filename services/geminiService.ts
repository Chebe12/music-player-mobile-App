import { GoogleGenAI, Type } from "@google/genai";
import { Track } from "../types";
import { SAMPLE_TRACKS } from "../constants";

export const getAIPlaylistRecommendation = async (userMood: string): Promise<{ text: string; tracks: Track[] }> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("No API Key found for Gemini");
      throw new Error("API Key Missing");
    }

    const ai = new GoogleGenAI({ apiKey });
    const availableTracksList = SAMPLE_TRACKS.map(t => `ID: ${t.id}, Title: ${t.title}, Artist: ${t.artist}, Genre: ${t.genre}`).join('\n');

    const prompt = `
      You are an expert music DJ. The user is in this mood: "${userMood}".
      
      Here is the list of available tracks:
      ${availableTracksList}

      1. Select 2-3 tracks from the list that fit the mood.
      2. Write a short, fun description (max 2 sentences) of why these fit.
      3. Return ONLY valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            recommendedTrackIds: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ['description', 'recommendedTrackIds']
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    const data = JSON.parse(jsonText);
    const recommendedTracks = SAMPLE_TRACKS.filter(t => data.recommendedTrackIds?.includes(t.id));

    return {
      text: data.description || "Here's a mix for you!",
      tracks: recommendedTracks
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback logic
    return {
      text: "I'm having trouble connecting to the vibe cloud right now. Here are some random picks!",
      tracks: [SAMPLE_TRACKS[0], SAMPLE_TRACKS[1]]
    };
  }
};