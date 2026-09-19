import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Default to 'user' if not specified
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: "User registered successfully with hashed password!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during registration", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    console.log('user',user)
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password matches the hash in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create a JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role}, // Payload (data inside the token)
      process.env.JWT_SECRET || "secret", // Secret key
      { expiresIn: "1d" },
    );

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      imageUri:user.imageUri,
      token: token, // Send this back to the user
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name ,imageUri } = req.body;
    console.log("PROFILE UPDATE BODY =>", req.body);
    const user = await User.findById(req.user.id);
    console.log("user",user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
   if (imageUri !== undefined) {
  user.imageUri = imageUri;
  console.log("IMAGE URI RECEIVED =>", imageUri);
}
    // user.email = email || user.email; // Allow email update? Maybe not for now.

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      imageUri:updatedUser.imageUri,
    });
  } catch (error) {
    console.log("Updated Profile Error",error);
    res.status(500).json({ message: "Update failed", error });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email ,platform} = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    const resetUrl = platform==='mobile'
  ? `travelapp://reset-password/${resetToken}`
  : `http://localhost:5173/reset-password/${resetToken}`;

    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h3>Password Reset Request</h3>
        <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
        <p>Please click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">Reset Password</a>
        <br/><br/>
        <p style="font-size: 12px; color: #666;">If the button doesn't work, you can copy and paste this link into your browser (if on a PC) or mobile device:</p>
        <p style="font-size: 12px; color: #666; word-break: break-all;">${resetUrl}</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Token",
        message,
      });

      res.status(200).json({ success: true, data: "Email sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken as string)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      data: "Password Updated Success",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const saveFCMToken=async(req:any,res:Response)=>{
  try{
     console.log("START SAVE TOKEN");
    const {fcmToken}=req.body;
    await User.findByIdAndUpdate(req.user.id,{
      fcmToken,
    });
    res.status(200).json({
      success:true,
      data:"Notification Updated Success",
    })
   console.log("TOKEN SAVED");
  }catch{
         console.log("error occurs")
  }
}

export const logout= async(req:any,res:Response)=>{
  try{
    await User.findByIdAndUpdate(req.user.id,{
      $unset:{
        fcmToken:1,
      }
    });
    res.status(200).json({
      success:true,
      data:" logout successful"
    });
  }catch(error:any){
    res.status(500).json({
      success:false,
      message:" error in log out",
      error:error.message,
    })
  }
}