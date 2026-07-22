import jwt from "jsonwebtoken";
import "../configs/env.js";

const verifyJWT = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(' ')[1];

  if(!token){
    return res.status(401).json({error: "Access Token Not Found"});
  }


  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;

    next();
  } catch(err){
    return res.status(401).json({error: "Unauthorized"});
  }

}

export default verifyJWT;