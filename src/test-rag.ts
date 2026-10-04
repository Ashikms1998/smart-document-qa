import "dotenv/config";
import { answerQuestion } from "./services/rag.service.js";


async function testRag() {
    const question = "How does AI imporve workplace efficiency"

    const answer = await answerQuestion(question)

    console.log("\nQuestion:");
    console.log(question);

    console.log("\nAnswer:");
    console.log(answer);

}

testRag()