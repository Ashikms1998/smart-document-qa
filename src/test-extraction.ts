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
import {chunkTest} from "./services/chunking.service.js"

async function testExtraction() {
    const text = await extractTextFromTxt(
        "src/test-documents/sample.txt"
    )

    const chunks = chunkTest(text,2,1)

    console.log("Chunks:"),
    console.log(chunks);
}

testExtraction();