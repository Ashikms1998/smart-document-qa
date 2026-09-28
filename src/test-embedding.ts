import "dotenv/config";
import { generateAnswer } from "./services/generation.service.js";
import { findSimilarChunks } from "./services/retrieval.service.js";
import { generateEmbedding } from "./services/embedding.services.js";

async function testRAG() {
    const question = "Where is the Eiffel Tower located?";

    const questionEmbedding = await generateEmbedding(question)
    const results = await findSimilarChunks(questionEmbedding,3)

    const context = results.map((result)=>result.content).join("\n");

    console.log("Retrieved context:");
    console.log(context);

    const answer = await generateAnswer(question,context);
    console.log("\nAnswer:")
    console.log(answer)

}

testRAG();


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







// import "dotenv/config";
// import { generateEmbedding } from "./services/embedding.services.js";
// import { findSimilarChunks } from "./services/retrieval.service.js";
// import { saveChunk } from "./services/document.services.js";

// async function testSimilarity() {
//     const question = "Where is Eiffel tower located?";

//     const questionEmbedding = await generateEmbedding(question);

//     const result = await findSimilarChunks(questionEmbedding,5);

//     console.log("Question embedding length:",questionEmbedding.length);

//     console.log("Search results:");

//     console.log(result)
// }

// testSimilarity();







// const documentId = "058623fe-fc36-4ed8-aecf-8bc7b0ddc799";

// async function addTestChunks() {
//     const chunks = [
//     "The Eiffel Tower is located in Paris.",
//     "JavaScript is a programming language.",
//     "MongoDB is a NoSQL document database.",
//     ];

//     for(let i=0;i<chunks.length;i++){
//         const content = chunks[i]!;
//         const embedding = await generateEmbedding(content);

//         const savedChunk =await saveChunk(
//             documentId,
//             content,
//             i+1,
//             embedding
//         );

//         console.log("Saved Chunk:",savedChunk)
//     }
// }

// addTestChunks();