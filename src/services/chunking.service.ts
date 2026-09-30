export function chunkTest(
    text:string,
    chunkSize:number = 500
) : string[] {
    const words = text.split(/\s+/)

    const chunks:string[] = [];

    for(let i=0;i< words.length;i=i+chunkSize){
        const chunk = words.slice(i,i+chunkSize).join(" ");
        chunks.push(chunk);
    }
    return chunks;
}