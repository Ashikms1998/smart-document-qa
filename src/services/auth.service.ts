import bcrypt from "bcrypt";
import pool from "../config/database.js";

export async function registerUser(
    email: string,
    password: string
) {
    const existingUser = await pool.query(
        `
        SELECT id
        FROM users
        WHERE email = $1
        `,
        [email]
    );

    if (existingUser.rowCount !== null && existingUser.rowCount > 0) {
        throw new Error("Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
        `
        INSERT INTO users(email,password_hash)
        VALUES($1,$2)
        RETURNING id,email,created_at
        `,
        [email, passwordHash]
    );
    return result.rows[0];
}