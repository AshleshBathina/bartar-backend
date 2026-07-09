import mongoose from "mongoose";
import "./env.js"

const connectDB = async () => {
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected successfully");
  } catch(err){
    console.error("Error connecting to DB: ", err);
    process.exit(1);
  }
}

export default connectDB;