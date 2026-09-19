import express from "express";
import {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    forgotPassword,
    resetPassword,
    saveFCMToken,
    logout,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
router.post("/save-fcm-token",protect,saveFCMToken);
router.post("/logout",protect,logout);

export default router;
