import express from "express";
import connectDB from "./configs/db.js";

const app = express();

app.get('/health', async (req, res) => {
  try{
    await connectDB();
    res.json({ status: 'OK' });
  } catch (error) {
    res.status(500).json({ status: 'Error' });
  }
});

export default app;