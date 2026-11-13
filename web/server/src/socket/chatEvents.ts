import onlineUsers from "./onlineUser";
import { Message } from "../models/Message";
import { User } from "../models/User";
import { Socket, Server } from "socket.io";
import mongoose from "mongoose";

export const broadcastActiveUsers = async (io: Server) => {
  try {
    const nonAdminEntries = Array.from(onlineUsers.entries()).filter(
      ([_, value]: [string, any]) =>
        String(value?.role || "").toLowerCase() !== "admin"
    );

    const validEntries = nonAdminEntries.filter(([userId]) =>
      mongoose.Types.ObjectId.isValid(userId)
    );

    if (validEntries.length === 0) {
      console.log("No non-admin online users to broadcast.");
      io.emit("active-users", []);
      return;
    }

    const userObjectIds = validEntries.map(
      ([userId]) => new mongoose.Types.ObjectId(userId)
    );

    const dbUsers = await User.find({ _id: { $in: userObjectIds } }).select(
      "name email role imageUri"
    );
    const dbUserMap = new Map(dbUsers.map((u) => [u._id.toString(), u]));

    const users = [];
    for (const [userId, value] of validEntries) {
      const dbUser = dbUserMap.get(userId);
      if (dbUser && dbUser.role !== "admin") {
        users.push({
          userId,
          name: dbUser.name,
          email: dbUser.email,
          imageUri: dbUser.imageUri || "",
          socketId: value.socketId,
          role: dbUser.role,
        });
      }
    }

    console.log("ACTIVE USERS BROADCAST:", users);
    io.emit("active-users", users);
  } catch (error) {
    console.error("Error in broadcastActiveUsers:", error);
  }
};

export const chatEvents = (socket: Socket, io: Server) => {
  // on-demand active users request
  socket.on("get-active-users", async () => {
    await broadcastActiveUsers(io);
  });

  // send message
  socket.on("send-message", async (data) => {
    try {
      const senderId = socket.data.user.id;
      let receiverId = data.receiverId;
      console.log("Sender:", senderId);
      console.log("Receiver:", receiverId);

      if (receiverId === "admin") {
        const adminUser = await User.findOne({ role: "admin" });
        if (adminUser) {
          receiverId = adminUser._id.toString();
        }
      }
      const newMessage = await Message.create({
        senderId,
        receiverId: receiverId,
        message: data.message,
      });
      const receiver = onlineUsers.get(receiverId);
      if (receiver) {
        io.to(receiver.socketId).emit("receive-message", newMessage);
      }
      socket.emit("message-sent", newMessage);
    } catch (err) {
      console.log(err);
    }
  });
};
