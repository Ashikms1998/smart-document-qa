import "dotenv/config";
import { generateEmbedding } from "./services/embedding.services.js";
import { findSimilarChunks } from "./services/retrieval.service.js";

async function testRetreival() {
    const question =
        "How does AI improve workplace efficiency?";

    const queryEmbedding = await generateEmbedding(question);

    const results = await findSimilarChunks(queryEmbedding, 5);

    console.log("\nQuestion:");
    console.log(question);

    console.log("\nRetrieved chunks:")

    for (const result of results) {
        console.log("\n--------------------");
        console.log("Chunk:", result.chunk_index);
        console.log("Distance:", result.distance);
        console.log("Content:", result.content);
    }

}

testRetreival();