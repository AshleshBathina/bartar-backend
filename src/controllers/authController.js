import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../models/userModel.js";
import "../configs/env.js";

export const register = async (req, res) => {

}

export const login = async (req, res) => {
  try{
    const {id, password} = req.body;

    if(!id || !password){
      return res.status(401).json({error: "Both ID and Password are required"});
    }

    const user = await User.findOne({$or: [{email: id}, {phoneNumber: id}]}).lean();

    if(!user){
      return res.status(401).json({error: "User Not Found"});
    }
  
    const match = await bcrypt.compare(password, user.password);

    if(!match){
      return res.status(400).json({error: "Wrong Password"});
    }

    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email
    };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'});

    return res.status(200).json({jwtToken, user});
  } catch(err){
    return res.status(500).json({error: "Internal Server Error"});
  }


}