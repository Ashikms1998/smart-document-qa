import "dotenv/config"
import { extractTextFromTxt } from "./services/document-extraction.service.js"
import { ingestDocument } from "./services/document-ingestion.service.js";


async function testIngestion() {
    const text = await extractTextFromTxt(
        "src/test-documents/sample_paragraph.txt"
    );

    const result = await ingestDocument(
        "sample.txt",
        text
    );

    console.log("Ingestion result:");
    console.log(result);
}

testIngestion();