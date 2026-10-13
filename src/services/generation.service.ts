//What happens here is => question + context → answer

import { GoogleGenAI } from "@google/genai";

const ai =  new GoogleGenAI();

export async function generateAnswer(
  question: string,
  context: string,
  history: { role: "user" | "assistant"; content: string }[] = []
): Promise<string> {
  const conversationHistory = history.length > 0
    ? history
        .map((message) => `${message.role}: ${message.content}`)
        .join("\n")
    : "No previous conversation.";

  const prompt = `
You are answering questions about a user's document.

Use the conversation history to understand the user's intent
and references to earlier messages.

Use only the provided document context as factual evidence.
If the context does not contain enough information to answer,
say so. Do not invent facts.

Conversation history:
${conversationHistory}

Document context:
${context}

Current user question:
${question}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return response.text ?? "";
}


export async function rewriteQuestionForRetrieval(
  question: string,
  history: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  // No previous messages means no rewriting is needed.
  if (history.length === 0) {
    return question;
  }

  const conversationHistory = history
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n");

  const prompt = `
Rewrite the latest user question as a standalone search query.

Use the conversation history to understand references such as
"it", "that", "the first problem", and "those disadvantages".

Return only the rewritten question.
Do not answer the question.
Do not introduce facts that are not supported by the conversation.

Conversation history:
${conversationHistory}

Latest user question:
${question}

Standalone search query:
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return response.text?.trim() || question;
}
