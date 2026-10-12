import "dotenv/config";
import { generateEmbedding } from "./services/embedding.services.js";
import { findSimilarChunks } from "./services/retrieval.service.js";

async function testRetreival() {
    const question =
        "What are the disadvantage of RAG in production?";

    const queryEmbedding = await generateEmbedding(question);

    const results = await findSimilarChunks(queryEmbedding,
        "256e64b3-86e6-4aaf-8f19-17ade5b73cfc",
        5);

    console.log("\nQuestion:");
    console.log(question);

    console.log("\nRetrieved chunks:")

    for (const result of results) {
        console.log("\n--------------------");
        console.log("Chunk:", result.chunkIndex);
        console.log("Filename:", result.filename);
        console.log("Distance:", result.distance);
        console.log("Content:", result.content);
    }

}

testRetreival();