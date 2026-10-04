//What happens here is => question + context → answer

import { GoogleGenAI } from "@google/genai";

const ai =  new GoogleGenAI();

export async function generateAnswer(
    question:string,
    context:string
): Promise<string> {
    const prompt = `Answer the user's question using only the provided context.

    Context:${context}

    Question:${question}
    `;

    const response = await ai.models.generateContent({
        model:'gemini-3.6-flash',
        contents:prompt
    })

    return response.text ?? ""
}