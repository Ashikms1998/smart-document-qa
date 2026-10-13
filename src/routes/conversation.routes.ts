
import { Router } from "express";
import {
    authenticate,
    AuthenticatedRequest,
} from "../middleware/auth.middleware.js";
import pool from "../config/database.js";
import {
    createConversation,
    getUserConversations,
    getConversationMessages,
} from "../services/conversation.service.js";
import { answerQuestion } from "../services/rag.service.js";
import { saveMessage } from "../services/conversation.service.js";
import { getConversationHistory } from "../services/conversation.service.js";


const router = Router();

router.post(
    "/",
    authenticate,
    async (req: AuthenticatedRequest, res) => {
        try {
            const { documentId, title } = req.body;

            if (
                typeof documentId !== "string" ||
                documentId.trim().length === 0
            ) {
                return res.status(400).json({
                    message: "documentId is required",
                });
            }

            if (
                title !== undefined &&
                (typeof title !== "string" || title.trim().length === 0)
            ) {
                return res.status(400).json({
                    message: "title must be a non-empty string",
                });
            }

            const conversation = await createConversation(
                req.userId!,
                documentId,
                title?.trim()
            );

            return res.status(201).json({ conversation });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "Document not found"
            ) {
                return res.status(404).json({
                    message: "Document not found",
                });
            }

            console.error("Create conversation error:", error);

            return res.status(500).json({
                message: "Failed to create conversation",
            });
        }
    }
);

router.get(
    "/",
    authenticate,
    async (req: AuthenticatedRequest, res) => {
        try {
            const conversations = await getUserConversations(
                req.userId!
            );

            return res.status(200).json({ conversations });
        } catch (error) {
            console.error("List conversations error:", error);

            return res.status(500).json({
                message: "Failed to retrieve conversations",
            });
        }
    }
);

router.get(
    "/:conversationId/messages",
    authenticate,
    async (req: AuthenticatedRequest, res) => {
        try {
            const { conversationId } = req.params;

            if (!conversationId || typeof conversationId !== "string") {
                return res.status(400).json({
                    message: "Invalid conversation ID",
                });
            }

            const ownership = await pool.query(
                `
        SELECT 1
        FROM conversations
        WHERE id = $1
          AND user_id = $2
        LIMIT 1
        `,
                [conversationId, req.userId]
            );

            if (ownership.rows.length === 0) {
                return res.status(404).json({
                    message: "Conversation not found",
                });
            }

            const messages = await getConversationMessages(
                req.userId!,
                conversationId
            );

            return res.status(200).json({ messages });
        } catch (error) {
            console.error("Get conversation messages error:", error);

            return res.status(500).json({
                message: "Failed to retrieve messages",
            });
        }
    }
);

router.post("/:conversationId/questions", authenticate,
    async (req: AuthenticatedRequest, res) => {
        try {
            const { conversationId } = req.params;
            const { question } = req.body;

            if (!conversationId || typeof conversationId !== "string") {
                return res.status(400).json({
                    message: "Invalid conversation ID",
                });
            }

            if (typeof question !== "string" || question.trim().length === 0) {
                return res.status(400).json({
                    message: "A non-empty question is required",
                });
            }

            //Verifying conversation ownership and getting the document

            const conversationResult = await pool.query(
                `
                SELECT id, document_id
        FROM conversations
        WHERE id = $1
          AND user_id = $2
        LIMIT 1
                `,
                [conversationId, req.userId]
            );

            if (conversationResult.rows.length === 0) {
                return res.status(404).json({
                    message: "Conversation not found",
                });
            }

            const documentId = conversationResult.rows[0].document_id;
            const cleanQuestion = question.trim();

            // Fetch previous messages BEFORE inserting the current question
            const history = await getConversationHistory(
                req.userId!,
                conversationId,
                10
            );
            //Save users question
            const userMessage = await saveMessage(
                req.userId!,
                conversationId,
                "user",
                cleanQuestion
            );

            //Generate the RAG answer using the conversations document
            const result = await answerQuestion(
                cleanQuestion,
                documentId,
                history
            );

            //Saveing the AIs answer
            const assistantMessage = await saveMessage(
                req.userId!,
                conversationId,
                "assistant",
                result.answer
            );

            //Return the answer sources and saved messages
            return res.status(200).json({
                conversationId,
                answer: result.answer,
                sources: result.sources,
                messages: [userMessage, assistantMessage],
            });

        } catch (error) {
            console.error("Conversation question error:", error);

            return res.status(500).json({
                message: "Failed to process conversation question",
            });
        }
    }
)

export default router;
