import { GoogleGenAI, Type } from "@google/genai";
import { Track } from "../types";
import { SAMPLE_TRACKS } from "../constants";

// Initialize lazily to avoid issues if env is not ready at module load
const getAIClient = () => {
  // Ensure we have a fallback or the actual key
  const apiKey = process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

export const getAIPlaylistRecommendation = async (userMood: string): Promise<{ text: string; tracks: Track[] }> => {
  try {
    const ai = getAIClient();
    const availableTracksList = SAMPLE_TRACKS.map(t => `${t.title} by ${t.artist} (ID: ${t.id}, Genre: ${t.genre})`).join('\n');

    const prompt = `
      You are an expert music DJ. The user is in this mood: "${userMood}".
      
      Here is the list of available tracks in the library:
      ${availableTracksList}

      1. Select 2-3 tracks from the available list that best match the mood.
      2. Write a short, engaging description of why these tracks fit the vibe.
      3. Return the response in JSON format containing the description and the list of selected Track IDs.
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
    if (!jsonText) throw new Error("No response from AI");

    const data = JSON.parse(jsonText);
    const recommendedTracks = SAMPLE_TRACKS.filter(t => data.recommendedTrackIds.includes(t.id));

    return {
      text: data.description,
      tracks: recommendedTracks
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "I couldn't quite catch that vibe. Here's a random mix instead!",
      tracks: [SAMPLE_TRACKS[0], SAMPLE_TRACKS[1]]
    };
  }
};