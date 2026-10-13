import pool from "../config/database.js";


export async function createConversation(
  userId: string,
  documentId: string,
  title: string = "New conversation"
) {
  const result = await pool.query(
    `
    INSERT INTO conversations (user_id, document_id, title)
    SELECT $1, d.id, $3
    FROM documents d
    WHERE d.id = $2
      AND d.user_id = $1
    RETURNING id, user_id, document_id, title, created_at, updated_at
    `,
    [userId, documentId, title]
  );

  if (result.rows.length === 0) {
    throw new Error("Document not found");
  }

  return result.rows[0];
}

export async function saveMessage(
  userId: string,
  conversationId: string,
  role: "user" | "assistant",
  content: string
) {
  const result = await pool.query(
    `
    INSERT INTO messages (conversation_id, role, content)
    SELECT c.id, $3, $4
    FROM conversations c
    WHERE c.id = $1
      AND c.user_id = $2
    RETURNING id, conversation_id, role, content, created_at
    `,
    [conversationId, userId, role, content]
  );

  if (result.rows.length === 0) {
    throw new Error("Conversation not found");
  }

  await pool.query(
    `
    UPDATE conversations
    SET updated_at = NOW()
    WHERE id = $1
      AND user_id = $2
    `,
    [conversationId, userId]
  );

  return result.rows[0];
}



export async function getUserConversations(userId: string) {
  const result = await pool.query(
    `
    SELECT
      c.id,
      c.document_id,
      c.title,
      c.created_at,
      c.updated_at,
      d.filename
    FROM conversations c
    JOIN documents d ON d.id = c.document_id
    WHERE c.user_id = $1
    ORDER BY c.updated_at DESC
    `,
    [userId]
  );

  return result.rows;
}

export async function getConversationMessages(
  userId: string,
  conversationId: string
) {
  const result = await pool.query(
    `
    SELECT
      m.id,
      m.conversation_id,
      m.role,
      m.content,
      m.created_at
    FROM messages m
    JOIN conversations c
      ON c.id = m.conversation_id
    WHERE c.id = $1
      AND c.user_id = $2
    ORDER BY m.created_at ASC, m.id ASC
    `,
    [conversationId, userId]
  );

  return result.rows;
}


export async function getConversationHistory(
    userId: string,
    conversationId: string,
    limit: number = 10
) {

    const result = await pool.query(
        `
SELECT role, content
    FROM (
      SELECT
        m.role,
        m.content,
        m.created_at,
        m.id
      FROM messages m
      JOIN conversations c
        ON c.id = m.conversation_id
      WHERE c.id = $1
        AND c.user_id = $2
      ORDER BY m.created_at DESC, m.id DESC
      LIMIT $3
    ) recent_messages
    ORDER BY created_at ASC, id ASC
    `,
        [conversationId, userId, limit]
    );
    return result.rows;
}
