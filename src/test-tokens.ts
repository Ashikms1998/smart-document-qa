// Gemini's own tokenizer

import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI();

async function testTokens() {
    const texts = [
        "is",
        "Thiruvananthapuram",
        "PostgreSQL",
        "The Eiffel Tower is located in paris"
    ];

    for(const text of texts){
        const response = await ai.models.countTokens({
            model:"gemini-3.6-flash",
            contents:text
        })

        console.log(`"${text}" -> ${response.totalTokens} tokens`);
    }
}

testTokens()