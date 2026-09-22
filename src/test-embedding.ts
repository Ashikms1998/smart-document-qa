import "dotenv/config";

import { generateEmbedding } from "./services/embedding.services.js";

async function testEmbedding(){
    const text = "PostgreSQL is a relational database.";
    const embedding = await generateEmbedding(text);

    console.log("Embedding generated successfully",embedding);
    console.log("Embedding length",embedding.length);
    console.log("First 5 values:",embedding.slice(0,5))
}

testEmbedding();