import "dotenv/config";
import { answerQuestion } from "./services/rag.service.js";


async function testRag() {
    const question = "How does AI imporve workplace efficiency"

    const answer = await answerQuestion(question,  "02602c7f-6897-4e53-8bd7-abcf35dd8801")

    console.log("\nQuestion:");
    console.log(question);

    console.log("\nAnswer:");
    console.log(answer);

}

testRag()