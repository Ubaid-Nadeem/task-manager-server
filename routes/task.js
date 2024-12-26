import express from "express";
import User from "../models/User.js";
import Task from "../models/task.js";
import authenticatedUser from "../middlewares/authenticatedUser.js";
import main from "../nodemailer/index.js";

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
    res.send({ task });
  } catch (e) {
    console.log(e);
    res.send({ e });
  }
});

router.put("/:id", async (req, res) => {
 
  try {
    let updatedTask = await Task.updateOne(
      { _id: req.params.id },
      { task: req.body.task, isComplete: req.body.isComplete }
    );
    res.status(200).json(updatedTask);
  } catch (e) {
    res.status(400).json(e);
    console.log(e);
  }
});
export default router;
