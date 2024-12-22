import express from "express";
const router = express.Router();
import User from "../models/User.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import "dotenv/config";

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

router.get("/:id", async (req, res) => {
  // const user = await User.findById(req.params.id);
  console.log(req.params.id);
  res.send({ ubaid: "name" });
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

  let newUser = new User({ ...value });

  newUser = await newUser.save();

  res
    .status(200)
    .json({ data: newUser, error: false, msg: "User Successfully Registered" });
});

router.post("/login", async (req, res) => {
  console.log(req.body)
  const { error, value } = loginSchema.validate(req.body);

  if (error)
    return res
      .status(400)
      .json({ error: true, data: null, msg: error.message });

  let user = await User.findOne({ email: value.email }).lean();

  const isPasswordValid = await bcrypt.compare(value.password, user.password);

  if (!isPasswordValid)
    return res
      .status(400)
      .json({ data: null, error: true, msg: "Invalid Credentials" });

  delete user.password;

  var token = jwt.sign({ ...user }, process.env.AUTH_SECRET);

  res
    .status(200)
    .json({
      data: { ...user, token },
      error: false,
      msg: "'User Login Successfully",
    });
});

export default router;
