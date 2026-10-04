import { countTokens } from "./token.service.js";

export async function chunkText(
    text: string,
    maxTokens: number = 100,
    overlapSentences: number = 1
): Promise<string[]> {
    const sentences = text.split(/(?<=[.!?])\s+/)
        .filter((sentence) => sentence.trim().length > 0);

    const chunks: string[] = [];

    let currentSentences: string[] = [];

    for (const sentence of sentences) {
        const candidateSentences = [
            ...currentSentences, sentence
        ];

        const candidateChunk = candidateSentences.join(" ");
        const tokenCount = await countTokens(candidateChunk);

        if (currentSentences.length > 0 && tokenCount > maxTokens) {
            chunks.push(currentSentences.join(" "));

            currentSentences = currentSentences.slice(-overlapSentences);

            currentSentences.push(sentence);
        } else {
            currentSentences.push(sentence);
        }

    }

    if (currentSentences.length > 0) {
        chunks.push(currentSentences.join(" "));
    }

    return chunks;
}