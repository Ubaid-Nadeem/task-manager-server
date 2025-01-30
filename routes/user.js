import express from "express";
const router = express.Router();
import User from "../models/User.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import "dotenv/config";
import mailVerification from "../nodemailer/index.js";

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  city: Joi.string().optional().allow(""),
  country: Joi.string().optional().allow(""),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
});

router.post("/getuser", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email.email });
    res.status(200).json({ data: user, error: false, msg: "user found" });
  } catch (e) {
    console.log(e);
  }
});

router.post("/", async (req, res) => {
  const { name, email } = req.body;

  let newUser = new User({
    name,
    email,
  });

  newUser = await newUser.save();
  res.status(201).json({
    msg: "User added successfully",
    error: false,
    data: newUser,
  });
});

router.post("/signup", async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);

  if (error) return res.send({ error: true, data: null, msg: error.message });

  let findUser = await User.findOne({ email: req.body.email }).exec();

  if (findUser)
    return res
      .status(400)
      .json({ error: true, data: null, msg: "User Already Registered." });

  const hashedPassword = await bcrypt.hash(value.password, 10);
  value.password = hashedPassword;

  let user = new User({ ...value });

  user = await user.save();

  var token = jwt.sign({ user }, process.env.AUTH_SECRET);

  try {
    mailVerification(
      value.name,
      value.email,
      `http://localhost:3000/verification/${token}`
    );

    res.status(200).json({
      data: { user, token },
      error: false,
      msg: "Verification email sent!",
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/login", async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);

  if (error)
    return res
      .status(400)
      .json({ error: true, data: null, msg: error.message });

  let user = await User.findOne({ email: value.email }).lean();

  if (user) {
    
    const isPasswordValid = await bcrypt.compare(value.password, user.password);

    if (!isPasswordValid)
      return res
        .status(400)
        .json({ data: null, error: true, msg: "Invalid Credentials" });

    delete user.password;

    var token = jwt.sign({ user }, process.env.AUTH_SECRET);

    res.status(200).json({
      data: { ...user, token },
      error: false,
      msg: "'User Login Successfully",
    });
  } else {
    res.status(400).json({
      data: null,
      error: true,
      msg: "User not found",
    });
  }
});

router.post("/resendemail", async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let token = req.body.token;
  try {
    mailVerification(
      name,
      email,
      `http://localhost:3000/verification/${token}`
    );
    res
      .status(200)
      .json({ data: null, error: false, msg: "Email sent successfully" });
  } catch (e) {
    console.log(e);
  }
});

export default router;
