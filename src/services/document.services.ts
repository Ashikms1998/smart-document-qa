import pool from '../config/database.js'

export async function saveChunk(
    documentId: string,
    content: string,
    chunkIndex: number,
    embedding: number[]
) {
    const query = `
    INSERT INTO document_chunks
        (document_id,content,chunk_index,embedding)
    VALUES
        ($1,$2,$3,$4::vector)
    RETURNING *;
    `;

    const embeddingString = `[${embedding.join(",")}]`;

    const result = await pool.query(query, [
        documentId,
        content,
        chunkIndex,
        embeddingString,
    ]);

    return result.rows[0];

}