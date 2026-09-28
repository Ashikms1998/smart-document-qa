//What happens here is => using the vector → find relevant chunks

import pool from "../config/database.js";

export async function findSimilarChunks(
    queryEmbedding:number[],
    limit:number = 5
) {
    const query = `
    SELECT
        id,
        document_id,
        content,
        chunk_index,
        embedding <=> $1::vector AS distance
    FROM document_chunks
    ORDER BY distance ASC
    LIMIT $2;
    `;

    const embeddingString = `[${queryEmbedding.join(",")}]`;
    const result = await pool.query(query,[
        embeddingString,
        limit,
    ])
    return result.rows;

}