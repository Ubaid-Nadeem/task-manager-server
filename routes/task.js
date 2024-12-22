import express from "express";
import User from "../models/User.js";
import Task from "../models/task.js";
import authenticatedUser from "../middlewares/authenticatedUser.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user._id });
  res.status(200).json({
    data: { tasks, user: req.user },
    error: false,
    msg: "Get All Todos",
  });
});

router.post("/", async (req, res) => {
  console.log(req.body);
  let newTask = new Task({
    task: req.body.task,
    createdBy: req.user._id,
  });
  newTask = await newTask.save();

  res.status(200).json({
    data: newTask,
    error: false,
    msg: "Task Added Successfully",
  });
});

router.delete("/:id", async (req, res) => {
  try {
    let task = await Task.findByIdAndDelete({ _id: req.params.id });
    console.log(task);
    res.send({ task });
  } catch (e) {
    console.log(e);
    res.send({ e });
  }
});

export default router;
