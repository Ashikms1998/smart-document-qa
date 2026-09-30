export function chunkTest(
    text:string,
    chunkSize:number = 20,
    overlap: number=2
) : string[] {
    const words = text.split(/\s+/)

    const chunks:string[] = [];

    const step = chunkSize-overlap;

    for(let i=0;i< words.length;i=i+step){
        const chunk = words.slice(i,i+chunkSize).join(" ");
        chunks.push(chunk);
    }
    return chunks;
}