import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not configured");
}

export interface AuthenticatedRequest
    extends Request {
        userId?:string
    }

export function authenticate(
    req:AuthenticatedRequest,
    res:Response,
    next:NextFunction
){
    try {
        const authHeader = req.headers.authorization

        if(!authHeader){
            return res.status(401).json({
                message: "Authentication required",
            })
        }
        const [scheme,token] = authHeader.split(" ");

        if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Invalid authorization header",
      });
    }

    const decoded = jwt.verify(
        token,
        JWT_SECRET!
    ) as {userId:string}
    

    req.userId = decoded.userId

    next()
    } catch (error) {
        return res.status(401).json({
      message: "Invalid or expired token",
    });
    }
}