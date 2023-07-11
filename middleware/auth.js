// const jwt = require("jsonwebtoken")
// const User = require("../model/User")
// exports.protect = (req, res, next) => {
//   const token = req.cookies.jwt
//   if (token) {
//     jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
//       if (err) {
//         return res.status(401).json({ message: "Not authorized", isAuth: false })
//       }
//       else {
//         res.json({ isAuth: true });
//         res.user = usertoken;
//         next()
//       }
//     })
//   } else {
//     return res
//       .status(401)
//       .json({ message: "Not authorized, token not available" })
//   }
// }





// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");
// const asyncHandler = require("express-async-handler");
// // const dotenv = require('dotenv');

// // dotenv.config();
// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   if (req.headers.authorization) {
//     try {
//       token = req.headers.authorization;
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select("-password");
//       res.json("Token Authorized");
//       next();
//     } catch (error) {
//       res.status(error);
//       throw new Error("Token Failed!");
//     }
//   }
//   if (!token) {
//     res.status(401);
//     throw new Error("Not authorized");
//   }
// });

// module.exports = { protect };

const jwt = require('jsonwebtoken');
exports.protect = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send('Access denied. No JWT provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.set('Authorization', token);
    req.user = decoded;

    next();
  } catch (ex) {
    res.status(400).send('Invalid JWT.');
  }
};