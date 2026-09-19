import { Schema, model, Document } from "mongoose";

// The TypeScript Interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  imageUri?:string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  fcmToken:string;
}

// The Mongoose Schema
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  imageUri:{
    type:String,
    default:"",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: { type: Date, default: Date.now() },
  fcmToken: {
  type: String,
  default: "",
},
});

// Exporting the Model
export const User = model<IUser>("User", userSchema);
