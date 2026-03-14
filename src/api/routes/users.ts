



import pool from "@/db/db";
import app from "../server";


app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.status(200).json(result.rows);
    }catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
