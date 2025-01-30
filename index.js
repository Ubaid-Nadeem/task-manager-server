import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/user.js";
import todoRoutes from "./routes/task.js";
import verifyRoutes from "./routes/verifiaction.js";
import authenticatedUser from "./middlewares/authenticatedUser.js";
import cors from "cors";

const app = express();

mongoose
  .connect(process.env.MONOGO_DB_KEY)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors("*"));

app.use("/user", userRoutes);
app.use("/task", authenticatedUser, todoRoutes);
app.use("/verify", verifyRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
  console.log("hello world")
});

app.listen(process.env.PORT, () =>
  console.log(`Server is running on PORT ${process.env.PORT}`)
);
