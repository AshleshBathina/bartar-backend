import express from "express";
import connectDB from "./configs/db.js";
import authRouter from "./routes/authRouter.js"

const app = express();

app.use(express.json());


app.use('/auth', authRouter);

app.get('/health', async (req, res) => {
  try{
    await connectDB();
    res.json({ status: 'OK' });
  } catch (error) {
    res.status(500).json({ status: 'Error' });
  }
});

export default app;