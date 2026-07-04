import express from "express";
import pool from "./configs/db.js";

const app = express();

app.get('/', async (req, res) => {
  const data = await pool.query('SELECT * FROM owner');
  console.log(data.rows);
  res.json({data});
});

export default app;