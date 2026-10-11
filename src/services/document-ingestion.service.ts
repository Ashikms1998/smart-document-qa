import pool from "../config/database.js";
import { chunkText } from "./chunking.service.js";
import { generateEmbedding } from "./embedding.services.js";

export async function ingestDocument(
  filename: string,
  text: string,
  userId:string
) {
  // 1. Create document record
  const documentResult = await pool.query(
    `
    INSERT INTO documents (filename,user_id)
    VALUES ($1,$2)
    RETURNING id
    `,
    [filename,userId]
  );

  const documentId = documentResult.rows[0].id;

  // 2. Split document into chunks
  const chunks = await chunkText(text, 100, 1);

  // 3. Generate embedding and save each chunk
  for (const [index, chunk] of chunks.entries()) {
    const embedding = await generateEmbedding(chunk);

    await pool.query(
      `
      INSERT INTO document_chunks
        (document_id, content, chunk_index, embedding)
      VALUES
        ($1, $2, $3, $4)
      `,
      [
        documentId,
        chunk,
        index,
        JSON.stringify(embedding),
      ]
    );
  }

  return {
    documentId,
    chunkCount: chunks.length,
  };
}