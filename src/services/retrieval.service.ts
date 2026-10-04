//What happens here is => using the vector → find relevant chunks

import pool from "../config/database.js";

export async function findSimilarChunks(
    queryEmbedding:number[],
    limit:number = 5
) {
    const result = await pool.query(`
    SELECT
        content,
        chunk_index,
        embedding <=> $1 AS distance
    FROM document_chunks
    ORDER BY embedding <=> $1
    LIMIT $2
    `,[
        JSON.stringify(queryEmbedding),
        limit,
    ]
)
    return result.rows;

}