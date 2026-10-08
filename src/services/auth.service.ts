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

export async function loginUser(
    email: string,
    password: string
) {

    const result = await pool.query(
        `
    SELECT id,email,password_hash,created_at
    FROM users
    WHERE email = $1
    `,
        [email]
    );

    const user = result.rows[0]

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
    };

}