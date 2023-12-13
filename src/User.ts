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

userSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 10).then((hash) => {
    this.password = hash;
    next();
  });
});

export const User = model<IUser>("User", userSchema);
