import { generateEmbedding } from "./embedding.services.js";
import { findSimilarChunks } from "./retrieval.service.js";
import { generateAnswer } from "./generation.service.js";

export async function answerQuestion(
    question:string
) : Promise<string> {
    const questionEmbedding = await generateEmbedding(question)

    const results = await findSimilarChunks(questionEmbedding,3)

    const context = results.map((result)=>result?.content).join("\n");

    const answer = await generateAnswer(question,context)

    return answer
}