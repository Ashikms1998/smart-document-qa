//What happens here is => using the vector → find relevant chunks

import pool from "../config/database.js";

export async function findSimilarChunks(
    queryEmbedding:number[],
    documentId:string,
    limit:number = 5
) {
    const result = await pool.query(`
    SELECT
        dc.content,
        dc.chunk_index AS "chunkIndex",
        d.filename,
        dc.embedding <=> $1 AS distance
    FROM document_chunks dc
    JOIN documents d
        ON dc.document_id = d.id
    WHERE dc.document_id = $2
    ORDER BY dc.embedding <=> $1
    LIMIT $3
    `,[
        JSON.stringify(queryEmbedding),
        documentId,
        limit,
    ]
)
    return result.rows;

}