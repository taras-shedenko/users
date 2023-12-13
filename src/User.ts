import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import uniqueValidator from "mongoose-unique-validator";

export interface IUser {
  login: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  login: {
    type: String,
    required: [true, "Login is required"],
    unique: true,
  },
  password: { type: String, required: [true, "Password is required"] },
});

userSchema.plugin(uniqueValidator);

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

export const User = model<IUser>("User", userSchema);
