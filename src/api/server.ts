

import express from "express";



const app = express();

app.use(express.json());

app.post("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

export default app;