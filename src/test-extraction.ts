import "dotenv/config";

import { extractTextFromTxt } from "./services/document-extraction.service.js";

async function testExtraction() {
    const text = await extractTextFromTxt(
        "src/test-documents/sample.txt"
    );

    console.log("Extracted text:");
    console.log(text)

}

testExtraction();