import { Router } from "express";
import { ingestDocument } from "../services/document-ingestion.service.js";

const router = Router();

router.post("/",async(req,res)=>{
    try {
        const {filename,text} = req.body;

        if(!filename||!text){
            return res.status(400).json({
                message:"filename and text are required",
            });
        }

        const result = await ingestDocument(filename,text)
        return res.status(201).json(result);

    } catch (error) {
        console.error("Document ingestion failed:",error)

        return res.status(500).json({
            message:"Failed to ingest document",
        })
    }
})

export default router;