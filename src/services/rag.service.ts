import { generateEmbedding } from "./embedding.services.js";
import { findSimilarChunks } from "./retrieval.service.js";
import { generateAnswer } from "./generation.service.js";

export async function answerQuestion(
    question: string,
    documentId: string
): Promise<string> {
    // 1. Convert question into an embedding
    const queryEmbedding = await generateEmbedding(question);

    // 2. Retrieve relevant chunks
    const chunks = await findSimilarChunks(
        queryEmbedding,
        documentId,
        5
    );

    if (chunks.length === 0) {
        throw new Error(
            "No relevant content found in the document"
        );
    }

    // 3. Combine retrieved chunks into context
    const context = chunks
        .map((chunk) => chunk.content)
        .join("\n\n");

    // 4. Ask the LLM to answer using that context
    const answer = await generateAnswer(
        question,
        context
    );

    return answer;
}