// import "dotenv/config";
// import { generateEmbedding } from "./services/embedding.services.js";
// import { saveChunk } from "./services/document.services.js";

// async function testEmbedding(){
//     const text = "PostgreSQL is a relational database.";
//     const embedding = await generateEmbedding(text);

//     console.log("Embedding length",embedding.length);
//     console.log("First 5 values:",embedding.slice(0,5))
//     const savedChunk = await saveChunk(
//         "058623fe-fc36-4ed8-aecf-8bc7b0ddc799",
//         text,
//         0,
//         embedding
//     )
// }

// testEmbedding();

import "dotenv/config";
import { generateEmbedding } from "./services/embedding.services.js";
import { findSimilarChunks } from "./services/retrieval.service.js";

async function testSimilarity() {
    const question = "What type of database is PostgreSQL?";

    const questionEmbedding = await generateEmbedding(question);

    const result = await findSimilarChunks(questionEmbedding,5);

    console.log("Question embedding length:",questionEmbedding.length);

    console.log("Search results:");

    console.log(result)
}

testSimilarity();