import express from "express";
import connectDB from "./configs/db.js"
import "./configs/env.js";

import app from "./app.js";

const startServer = async () => {
  try{
    await connectDB();

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server up and running at ${process.env.SERVER_URL}:${process.env.PORT || 3000}`);
    })
  } catch(e){
    console.log(`Database connection error: ${e}`)
    process.exit(1);
  }

}

startServer();