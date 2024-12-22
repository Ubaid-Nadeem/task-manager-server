
import mongoose from "mongoose";
const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    task: String,
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    isComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task = mongoose.model("tasks", TaskSchema);
export default Task;
