export function chunkTest(
    text:string,
    maxSentences:number = 2,
    overlapSentences: number=1
) : string[] {
    const sentences = text.split(/(?<=[.!?])\s+/)
    .filter((sentence)=> sentence.trim().length > 0);

    const chunks:string[] = [];

    const step = maxSentences-overlapSentences;

    for(let i=0;i< sentences.length;i=i+step){
        const chunk = sentences.slice(i,i+maxSentences).join(" ");
        chunks.push(chunk);
    }
    return chunks;
}