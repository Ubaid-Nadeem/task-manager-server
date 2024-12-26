import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    let decoded = jwt.verify(req.params.id, process.env.AUTH_SECRET);

    let user = await User.findById({ _id: decoded.user._id });

    let updateUser = await User.updateOne(
      { _id: decoded.user._id },
      { isVerified: true }
    );
    
    var token = jwt.sign({ user }, process.env.AUTH_SECRET);

    // delete user.password;

    if (updateUser) {
      res.status(200).json({
        data: { user: { ...user, token } },
        msg: "Email verification successfull",
        error: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      data: null,
      error: true,
      msg: "Incorrect URL",
    });
  }
});

export default router;
