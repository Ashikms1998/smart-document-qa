import fs from "fs/promises"
// @ts-ignore
import pdf from 'pdf-parse/lib/pdf-parse.js';

export async function extractTextFromTxt(
    filePath: string
): Promise<string> {
    return fs.readFile(filePath, "utf-8")
}

export async function extractTextFromPdf(buffer: Buffer)
    : Promise<string> {
    const data = await pdf(buffer)

    return data.text;
}