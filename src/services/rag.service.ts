import { generateEmbedding } from "./embedding.services.js";
import { findSimilarChunks } from "./retrieval.service.js";
import { generateAnswer, rewriteQuestionForRetrieval } from "./generation.service.js";

export async function answerQuestion(
    question: string,
    documentId: string,
    history:{role:"user" | "assistant"; content:string}[]
){

    //Rewrite the question using previous messages
  const searchQuery = await rewriteQuestionForRetrieval(
    question,
    history
  );
    //Convert question into an embedding
    const queryEmbedding = await generateEmbedding(searchQuery);

    //Retrieve relevant chunks
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

    //Build the document context from retrieved chunks
    const context = chunks
        .map((chunk) => chunk.content)
        .join("\n\n");

    //Ask the LLM to answer using that context
    const answer = await generateAnswer(
        question,
        context,
        history
    );

    //Return the answer and original source metadata
    const sources = chunks.map((chunk)=>({
        filename:chunk.filename,
        chunkIndex:chunk.chunkIndex,
        content:chunk.content
    }));

    return {answer,sources};
}