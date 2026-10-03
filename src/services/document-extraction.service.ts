import { readFile } from "node:fs/promises";

export async function extractTextFromTxt(
    filePath:string
): Promise<string> {
    const text = await readFile(filePath,"utf-8");

    return text;
}