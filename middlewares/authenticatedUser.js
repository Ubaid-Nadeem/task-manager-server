import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User.js";

async function authenticatedUser(req, res, next) {
  let token = req?.headers?.authorization;

  if (!token)
    return res
      .status(400)
      .json({ data: null, error: true, msg: "Token not provided" });

  token = token.split(" ")[1];

  try {
    let decoded = jwt.verify(token, process.env.AUTH_SECRET);
    if (decoded) {
      const user = await User.findById(decoded._id);
      if (user) {
        req.user = user;
        next();
      } else {
        res
          .status(400)
          .json({ data: null, error: true, msg: "User not found" });
      }
    } else {
      res.status(400).json({ data: null, error: true, msg: "Invalid User" });
    }
  } catch (e) {
    res.status(400).json({ data: null, error: true, msg: e });
  }
}

export default authenticatedUser;
