import express from "express";
import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";
import { getChatUser, getMessages, sendMessages ,deleteMessage, editMessage, pinMessage, unpinMessage,uploadFile } from "../controllers/ChatController";

const router=express.Router();
console.log("CHAT ROUTES LOADED");
router.get("/messages/:userId",protect,getMessages);
router.post("/send-message", protect, sendMessages);
router.get("/users",protect,getChatUser);
router.delete("/delete/:messageId", protect, deleteMessage);
router.put("/edit/:messageId",protect,editMessage);
router.put("/pin/:messageId",protect,pinMessage);
router.put("/unpin/:messageId",protect,unpinMessage);
router.post(
  "/upload",
  protect,
  upload.single("file"),
  uploadFile
);

export default router;