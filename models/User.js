import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  isVerified: { type: Boolean, default: false },
});

const User = mongoose.model("Users", userSchema);
export default User;
