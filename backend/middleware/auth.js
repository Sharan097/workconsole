// import jwt from 'jsonwebtoken';
// import User from '../models/userModel.js';

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// export default async function authMiddleware (req, res, next) {
//     // GRAB THE BEARER TOKEN FROM THE AUTHORIZED HEADER
//     const authHeader = req.headers.authorization;

//     if(!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401)
//         .json({ success:false, message: 'Unauthorized, tokens are missing' });
//     }

//     const token = authHeader.split(' ')[1];


//     // VERIFY AND ATTACH THE USER OBJECT TO THE REQUEST
//     try {
//         const payload = jwt.verify(token, JWT_SECRET);
//         const user = await User.findById(payload.id).select('-password');

//             if (!user) {
//                 return res.status(401).json({ success:false, message: 'Unauthorized, user not found' });
//             }
//             req.user = user;
//             next();
//         } 
//         catch (err) {
//             console.log("JWT Verification failed", err);
//             return res.status(401).json({ success:false, message: 'expired or invalid token' });
//         }
// }







import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_SECRET = process.env.JWT_SECRET;


export default async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // ✅ CHECK HEADER
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized, token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // ✅ CHECK TOKEN FORMAT
    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    // ✅ VERIFY TOKEN
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log("JWT Verification failed:", err.message);

    return res.status(401).json({
      success: false,
      message: "Expired or invalid token",
    });
  }
}