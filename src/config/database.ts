import { error } from "node:console";
import { Pool } from "pg";

const pool =  new Pool({
    host:process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
})

pool.query("SELECT NOW()")
  .then((result) => {
    console.log("Database connected:", result.rows[0]);
  })
  .catch((error) => {
    console.error("Database connection failed error:", error);
  });

export default pool;
