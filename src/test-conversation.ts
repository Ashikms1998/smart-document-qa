import "dotenv/config";
import { createConversation, saveMessage } from "./services/conversation.service.js";

async function testConversation() {
    const userId = "66b45973-9d1e-4654-9c51-16b8fd81a812"
    const docuemntId = "b3731e6a-b467-4f4e-ab40-478b096136ee"

    const conversation = await createConversation(
        userId,
        docuemntId,
        "RAG production question"
    )

console.log("Created conversation:",conversation);

const userMessage = await saveMessage(
    userId,
    conversation.id,
    "user",
    "What are the disadvantages of RAG in production?"
)

console.log("Saved user message:",userMessage);

const assistantMessage = await saveMessage(
    userId,
    conversation.id,
    "assistant",
    "RAG can introduce retrieval latency, embedding drift, and token costs."
)
  console.log("Saved assistant message:", assistantMessage);

}

testConversation().catch(console.error);