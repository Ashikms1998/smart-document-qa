import { Router } from "express";
import { registerUser,loginUser } from "../services/auth.service.js";
import { generateAccessToken } from "../services/jwttoken.service.js";


const router = Router()

router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password.trim()
        ) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await registerUser(
            email.trim().toLowerCase(),
            password
        );

        return res.status(201).json({
            user,
        });
    } catch (error) {
        console.error("Registration failed:", error);

        if (
            error instanceof Error &&
            error.message === "Email already registered"
        ) {
            return res.status(409).json({
                message: error.message,
            });
        }

        return res.status(500).json({
            message: "Failed to register user",
        });
    }
})

export default router;


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await loginUser(
      email.trim().toLowerCase(),
      password
    );

    const accessToken = generateAccessToken(user.id);

    return res.status(200).json({ user,accessToken });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Invalid email or password"
    ) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.error("Login failed:", error);

    return res.status(500).json({
      message: "Failed to log in",
    });
  }
});