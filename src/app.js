import express from "express";
import pool from "./configs/db.js";

const app = express();

app.get('/health', async (req, res) => {
  try{
    await pool.query('SELECT 1');
    res.json({ status: 'OK' });
  } catch (error) {
    res.status(500).json({ status: 'Error' });
  }
});

export default app;