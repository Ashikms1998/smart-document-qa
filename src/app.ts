import express from "express"
import documentRoutes from "./routes/document.routes.js"
import authRoutes from "./routes/auth.routes.js"
import { authenticate,AuthenticatedRequest } from "./middleware/auth.middleware.js";

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
});

app.get(
    "/protected-test",
    authenticate,(req:AuthenticatedRequest,res)=>{
        return res.json({
            message:"You are authenticated",
            userId:req.userId
        })
    }
);

export default app;