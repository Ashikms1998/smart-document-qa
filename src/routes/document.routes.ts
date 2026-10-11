import { Router } from "express";
import { ingestDocument } from "../services/document-ingestion.service.js";
import { answerQuestion } from "../services/rag.service.js";
import multer from "multer"
import { extractTextFromPdf } from "../services/document-extraction.service.js";
import { documentBelongsToUser } from "../services/document.services.js";
import { authenticate, AuthenticatedRequest } from "../middleware/auth.middleware.js";

const upload = multer({
    storage: multer.memoryStorage()
})

const router = Router();

router.post(
    "/", authenticate,
    upload.single("file"),
    async (req: AuthenticatedRequest, res) => {
        try {

            if (!req.file) {
                return res.status(400).json({
                    message: "File is required",
                });
            }

            if (req.file.mimetype !== "application/pdf") {
                return res.status(400).json({
                    message: "Only PDF files are supported",
                });
            }

            const text = await extractTextFromPdf(req.file.buffer)

            if (!text.trim()) {
                return res.status(400).json({
                    message: "Could not extract text from the PDF",
                });
            }

            const result = await ingestDocument(req.file.originalname,
                text,
                req.userId!)
            return res.status(201).json(result);

        } catch (error) {
            console.error("Document ingestion failed:", error)

            return res.status(500).json({
                message: "Failed to ingest document",
            })
        }
    })


router.post("/:documentId/questions", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
        const { documentId } = req.params;

        if (!documentId || typeof documentId !== "string") {
            return res.status(400).json({ message: "Invalid document ID" });
        }

        const { question } = req.body;

        const belongsToUser = await documentBelongsToUser(
            documentId,
            req.userId!
        )

        if (!belongsToUser) {
            return res.status(404).json({
                message: "Document not found",
            })
        }

        if (typeof question !== "string" || !question.trim()) {
            return res.status(400).json({
                message: "question is required",
            });
        }

        const answer = await answerQuestion(question, documentId)

        return res.status(200).json({
            answer,
        });

    } catch (error) {
        console.error("Question answering failed:", error);

        return res.status(500).json({
            message: "Failed to answer question",
        });
    }
})

export default router;