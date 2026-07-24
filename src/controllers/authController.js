import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../models/userModel.js";
import "../configs/env.js";

export const register = async (req, res) => {
  try{
    const firstName = req.body.firstName?.trim();
    const lastName = req.body.lastName?.trim();
    const phoneNumber = req.body.phoneNumber?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if(!phoneNumber && !email){
      return res.status(400).json({
        success: false,
        message: "Phone or Email is required"
      });
    }

    if(!firstName || !lastName){
      return res.status(400).json({
        success: false,
        message: "First and Last Names are required"
      });
    }

    if(!password){
      return res.status(400).json({
        success: false,
        message: "Password required"
      })
    }

    const conditions = [];

    if(phoneNumber) conditions.push({phoneNumber});
    if(email) conditions.push({email})

    const userExists = await User.findOne({$or: conditions}).lean();

    if(userExists){
      return res.status(400).json({
        success: false,
        message: "Email or Phone Number is already registered"
      });
    }
    
    const saltRounds = Number(process.env.BCRYPT_SALT)

    if(Number.isNaN(saltRounds)){
      throw new Error("Invalid Salt Rounds");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      firstName: firstName,
      lastName: lastName, 
      password: hashedPassword,
      ...(phoneNumber && {phoneNumber}),
      ...(email && {email})
    });
    await user.save();

    const payload = {
      _id: user._id, 
      firstName: user.firstName, 
      lastName: user.lastName, 
      ...(user.email && {email: user.email}), 
      ...(user.phoneNumber && {phoneNumber: user.phoneNumber})
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'});

    return res.status(201).json({
      success: true, 
      jwtToken: token,
      user: payload
    });
  } catch(err){
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
}

export const login = async (req, res) => {
  try{
    const rawId = req.body.id?.trim();
    const id = rawId.includes('@')
    ? rawId.toLowerCase()
    : rawId;

    const password = req.body.password;

    if(!id || !password){
      return res.status(400).json({
        success: false,
        message: "Both ID and Password are required"
      });
    }

    const user = await User.findOne({$or: [{email: id}, {phoneNumber: id}]}).lean();

    if(!user){
      return res.status(401).json({
        success: false,
        message: "User Not Found"
      });
    }
  
    const match = await bcrypt.compare(password, user.password);

    if(!match){
      return res.status(400).json({
        success: false,
        message: "Wrong Password"
      });
    }

    const payload = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      ...(user.email && {email: user.email}),
      ...(user.phoneNumber && {phoneNumber: user.phoneNumber})
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'});

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      jwtToken,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        ...(user.email && {email: user.email}),
      ...(user.phoneNumber && {phoneNumber: user.phoneNumber})
      }
    });
  } catch(err){
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}