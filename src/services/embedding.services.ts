import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI();


export async function generateEmbedding(text: string): Promise<number[]> {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
        config: {
            outputDimensionality: 1536,
        },
    })
    const embedding = response.embeddings?.[0]?.values;

    if (!embedding) {
        throw new Error("Failed to generate embedding");
    }
    return embedding;
}