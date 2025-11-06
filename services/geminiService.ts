import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. The app will not function correctly without a valid API key.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates a short, age-appropriate story for a young child.
 * @param prompt The user's prompt for the story.
 * @returns A promise that resolves to the generated story text.
 */
export async function generateStory(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are a master storyteller for young children, around 5 years old. Your stories are always positive, whimsical, simple to understand, and have a gentle, kind moral. Keep them short, about 150-200 words.",
                temperature: 0.8,
                topK: 40,
            }
        });
        
        const storyText = response.text;
        
        if (!storyText) {
            throw new Error("The model did not return a story. Please try a different idea!");
        }

        return storyText.trim();

    } catch (error) {
        console.error("Error generating story:", error);
        throw new Error("Could not create a story right now. Please check your API key and network connection.");
    }
}

/**
 * Generates speech from text using the Gemini API.
 * @param text The text to convert to speech.
 * @returns A promise that resolves to the base64 encoded audio string.
 */
export async function generateSpeech(text: string): Promise<string> {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // A clear, friendly voice
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!base64Audio) {
            throw new Error("No audio data received from API.");
        }

        return base64Audio;

    } catch (error) {
        console.error("Error generating speech:", error);
        throw new Error("Failed to generate speech. Please check your API key and network connection.");
    }
}