import { Router } from "express";
import { ingestDocument } from "../services/document-ingestion.service.js";
import { answerQuestion } from "../services/rag.service.js";
import multer from "multer"
import { extractTextFromPdf } from "../services/document-extraction.service.js";

const upload = multer({
    storage: multer.memoryStorage()
})

const router = Router();

router.post("/", upload.single("file"), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "File is required",
            });
        }

        const text = await extractTextFromPdf(req.file.buffer)


        const result = await ingestDocument(req.file.originalname, text)
        return res.status(201).json(result);

    } catch (error) {
        console.error("Document ingestion failed:", error)

        return res.status(500).json({
            message: "Failed to ingest document",
        })
    }
})


router.post("/:documentId/questions", async (req, res) => {
    try {
        const { documentId } = req.params;
        const { question } = req.body;

        if (!question) {
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