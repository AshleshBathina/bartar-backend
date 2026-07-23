import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../models/userModel.js";
import "../configs/env.js";

export const register = async (req, res) => {
  try{
    const {name, phoneNumber, email, profilePicture, password} = req.body;

    console.log("Register Request: ", req.body);

    const contactInfo = {};

    if(!name || (!phoneNumber && !email) || !password){
      return res.status(400).json({error: "Phone or Email along with Name and Password required"});
    }

    if(phoneNumber) contactInfo.phoneNumber = phoneNumber;
    if(email) contactInfo.email = email;

    console.log("Contact Info: ", contactInfo);
    console.log(process.env.BCRYPT_SALT);
    
    const salt = Number(process.env.BCRYPT_SALT, 10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Hashed Password: ", hashedPassword);

    const user = new User({...contactInfo, name, password: hashedPassword});
    await user.save();

    console.log("User Registered: ", user);

    const payload = {id: user._id, name: user.name, ...contactInfo};

    const token = await jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'});

    return res.status(200).json({user: payload, jwtToken: token});
  } catch(err){
    return res.status(500).json({error: err.message});
  }
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