//What happens here is => using the vector → find relevant chunks

import pool from "../config/database.js";

export async function findSimilarChunks(
    queryEmbedding:number[],
    documentId:string,
    limit:number = 5
) {
    const result = await pool.query(`
    SELECT
        content,
        chunk_index,
        embedding <=> $1 AS distance
    FROM document_chunks
    WHERE document_id = $2
    ORDER BY embedding <=> $1
    LIMIT $3
    `,[
        JSON.stringify(queryEmbedding),
        documentId,
        limit,
    ]
)
    return result.rows;

}