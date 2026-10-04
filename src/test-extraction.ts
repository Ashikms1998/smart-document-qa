// import "dotenv/config";

// import { extractTextFromTxt } from "./services/document-extraction.service.js";

// async function testExtraction() {
//     const text = await extractTextFromTxt(
//         "src/test-documents/sample.txt"
//     );

//     console.log("Extracted text:");
//     console.log(text)

// }

// testExtraction();



//Modified Text Extraction

import "dotenv/config";
import { extractTextFromTxt } from "./services/document-extraction.service.js";
import {chunkText} from "./services/chunking.service.js"
import { countTokens } from "./services/token.service.js";

async function testExtraction() {
    const text = await extractTextFromTxt(
        "src/test-documents/sample_paragraph.txt"
    )

    const chunks = await chunkText(text,100,1)

    for (const [index, chunk] of chunks.entries()) {
    const tokenCount = await countTokens(chunk);

    console.log(`\nChunk ${index}:`);
    console.log(`Tokens: ${tokenCount}`);
    console.log(chunk);
  }
}

testExtraction();