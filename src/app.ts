import express from "express"
import documentRoutes from "./routes/document.routes.js"
import authRoutes from "./routes/auth.routes.js"

const app = express();
app.use(express.json())
app.use("/documents",documentRoutes);
app.use("/auth",authRoutes)

app.get("/health", (req, res) => {
    res.json({
        message: "API is running",
        status: "Ok"
    }
    )
})

export default app;