import { Request, Response } from "express";
import { Message } from "../models/Message";
import { User } from "../models/User";
import mongoose from "mongoose";
import onlineUsers from "../socket/onlineUser";
import { getMessaging } from "firebase-admin/messaging";

//send message
export const sendMessages = async (req: any, res: Response) => {
  try {
    const { receiverId, message ,replyTo, createdAt,file} = req.body;
    if (!receiverId || (!message && !file)) {
      return res.status(400).json({
        message: "receiverId and message are required",
      });
    }
    let actualReceiverId = receiverId;
    if (actualReceiverId === "admin") {
      const adminUser = await User.findOne({ role: "admin" });
      if (adminUser) {
        actualReceiverId = adminUser._id.toString();
      } else {
        return res.status(404).json({ message: "Admin not found" });
      }
    }
    let replyData = null;

if (replyTo) {
  const repliedMessage = await Message.findById(replyTo);
  if (repliedMessage) {
    replyData = {
      messageId: repliedMessage._id,
      message: repliedMessage.message,
      senderId: repliedMessage.senderId,
    };
  }
}
const newMessage = await Message.create({
  senderId: req.user.id,
  receiverId: actualReceiverId,
  file,
  message,
  replyTo: replyData,
  createdAt: createdAt || new Date(),
});
    const receiverUser=await User.findById(actualReceiverId);
    try{
    if(receiverUser?.fcmToken){
      console.log('message send');
     console.log("Receiver Token:", receiverUser?.fcmToken);

const response = await getMessaging().send({
  token: receiverUser.fcmToken,
  notification: {
    title: "New Message",
    body: message || (file ? ` ${file.name}` : "New message"),
  },
  data: {
    screen: "Chat",
    messageId: newMessage._id.toString(),
    senderId: req.user.id.toString(),
  },
});

console.log("FCM Success:", response);
    }else{
      console.log("no fcm token found");
    }
  }catch(error){
    console.log("FCM Error:",error);
  }
  const populatedMessage = await Message.findById(newMessage._id);
  console.log("POPULATED MESSAGE:");
console.log(JSON.stringify(populatedMessage, null, 2));
const io = req.app.get("io");
const receiver = onlineUsers.get(actualReceiverId);
if (receiver && io) {
  io.to(receiver.socketId).emit("receive-message", populatedMessage);
  console.log("Receiver:", receiver);
}
const sender = onlineUsers.get(req.user.id);
if (sender && io) {
  io.to(sender.socketId).emit("message-sent", populatedMessage);
}
res.status(201).json({
  success: true,
  data: populatedMessage,
});
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error sending message",
    });
  }
};

//get message
export const getMessages = async (req: any, res: Response) => {
  try {
    const currentUserId = req.user.id;
    let otherUserId = req.params.userId;

    if (otherUserId === "admin") {
      const adminUser = await User.findOne({ role: "admin" });
      if (adminUser) {
        otherUserId = adminUser._id.toString();
      } else {
        return res.status(404).json({ message: "Admin not found" });
      }
    }
    if (!otherUserId || otherUserId === "${userId}") {
      return res.status(400).json({
        message: "Invalid userId",
      });
    }
    const messages = await Message.find({
      
  $and: [
    {
      $or: [
        {
          senderId: currentUserId,
          receiverId: otherUserId,
        },
        {
          senderId: otherUserId,
          receiverId: currentUserId,
        },
      ],
    },
    {
      deletedFor: {
        $ne: currentUserId,
      },
    },
  ],
})
.populate("replyTo","message sender")
.sort({ createdAt: 1 });
res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching messages",
    });
  }
};

// user chat
export const getChatUser = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });
    const otherUserIds = new Set<string>();
    messages.forEach((msg) => {
      if (msg.senderId && msg.senderId.toString() !== userId) {
        otherUserIds.add(msg.senderId.toString());
      }
      if (msg.receiverId && msg.receiverId.toString() !== userId) {
        otherUserIds.add(msg.receiverId.toString());
      }
    });
    const objectIdArray: mongoose.Types.ObjectId[] = Array.from(otherUserIds).map(
      (id: string) => new mongoose.Types.ObjectId(id)
    );
    const users = await User.find({
      _id: { $in: objectIdArray },
    }).select("name email role");
    const formattedUsers = users.map((u) => ({
      userId: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
    }));
    res.status(200).json(formattedUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching chat users",
    });
  }
};

// delete message
export const deleteMessage= async(req:any,res:Response)=>{
  try{
    const { deleteType } = req.body;
    const messageId = req.params.messageId;
    const message=await Message.findById(messageId);
    if(!message){
      return res.status(400).json({
        message:"message not found !",
      })
    }
    if(req.user.role==="admin" && deleteType==="everyone"){
      await Message.findByIdAndDelete(messageId);
      const io = req.app.get("io");
       const currentUserId = req.user.id;
  const otherUserId =
    message.senderId.toString() === currentUserId
      ? message.receiverId.toString()
      : message.senderId.toString();
      const receiver=onlineUsers.get(otherUserId);
       io.to(receiver.socketId).emit("message-deleted", {
        messageId,
      });
      return res.json({
        sucess:true,
        message:"message is deleted",
      })
    }

    if(req.user.role==="admin" && deleteType==="me"){
      message.deletedFor.push(req.user.id);
      await message.save();
    }
    if(!message.deletedFor.includes(req.user.id)){
      message.deletedFor.push(req.user.id);
      await message.save();
    }
    return res.json({
      sucess:true,
      message:"deleted for you",
    })
  }catch(error:any){
     console.log(error);
    res.status(500).json({
      message: "Error in deleting message....",
      error: error.message,
    });
  }
}

//edit message
export const editMessage=async(req:any,res:Response)=>{
  const {message}=req.body;
  const messageId=req.params.messageId;
  try{
  if(!message?.trim()){
    return res.status(400).json({
      message:"message is required",
    })
  }
  const existingMessage= await Message.findById(messageId);
  if(!existingMessage){
    return res.status(404).json({
      message:"message is not found",
    })
  }
  if(existingMessage.senderId.toString()!=req.user.id){
    return res.status(403).json({
      message:"you can edit the message",
    })
  }
  const diff=Date.now()-new Date(existingMessage.createdAt).getTime();
  const tenMinutes=10*60*1000;
  if(diff>tenMinutes){
    return res.status(400).json({
      message:"edit time expired"
    })
  }
  existingMessage.message=message;
  existingMessage.edited=true;
  existingMessage.editedAt=new Date();
  await existingMessage.save();
  const currentUserId=req.user.id;
  const otherUserId=existingMessage.senderId.toString()===currentUserId?existingMessage.receiverId.toString():existingMessage.senderId.toString();
 const io = req.app.get("io");
const sender = onlineUsers.get(existingMessage.senderId.toString());
const receiver = onlineUsers.get(existingMessage.receiverId.toString());
if (sender) {
  io.to(sender.socketId).emit("message-edited", existingMessage);
}
if (receiver) {
  io.to(receiver.socketId).emit("message-edited", existingMessage);
}
  return res.status(200).json({
    success:true,
    data:existingMessage,
  })
  } catch(error:any){
 console.log(error);
    return res.status(500).json({
      message: "Error editing message",
      error: error.message,
  })
}
};

export const pinMessage=async(req:any,res:Response)=>{
  try{
    const {messageId}=req.params;
    const message=await Message.findById(messageId);
    if(!message){
      return res.status(400).json({
        message:"Message Not Found",
      })
    }
    message.isPinned=true;
    message.pinnedAt=new Date();
    await message.save();
    const io=req.app.get("io");
    io.emit("message-pinned",message);
    res.json({success:true,data:message});
  }catch{
   res.status(500).json({
    message:"error pinning message",
   })
  }
};

export const unpinMessage=async(req:any,res:Response)=>{
  try{
   const message=await Message.findById(req.params.messageId);
   if(!message){
    return res.status(404).json({
      message:"Message Not Found",
    });
   }
   message.isPinned=false;
  await message?.save();
  const io=req.app.get("io");
  io.emit("message-unpinned",message);
  res.status(200).json({
    success:true,
    data:message,
  });
}catch(error:any){
  res.status(500).json({
   success:false,
   message:error.message,
  })
}
};

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        name: req.file.originalname,
        filename: req.file.filename,
        type: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/${req.file.filename}`,
      },
    });
  } catch (error) {
    console.error("UPLOAD FILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "File upload failed",
    });
  }
};