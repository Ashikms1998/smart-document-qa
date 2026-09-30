import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI();

export async function countTokens(text:string):Promise<number> {
    const response = await ai.models.countTokens({
        model:"gemini-3.6-flash",
        contents:text,
    })

    return response.totalTokens ?? 0;
}