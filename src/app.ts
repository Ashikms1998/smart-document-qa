import express from "express"
const app = express();
app.use(express.json())
app.get("/health", (req, res) => {
    res.json({
        message: "API is running",
        status: "Ok"
    }
    )
})

export default app;