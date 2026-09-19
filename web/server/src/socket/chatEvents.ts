import onlineUsers from "./onlineUser";
import { Message } from "../models/Message";
import { User } from "../models/User";
import { Socket, Server } from "socket.io";

export const broadcastActiveUsers = async (io: Server) => {
  try {
    const users = [];
    for (const [userId, value] of onlineUsers.entries()) {
      if (value.role === "admin") continue; 
      console.log("active user");
      const user = await User.findById(userId).select("name email");
      if (user) {
        users.push({
          userId,
          name: user.name,
          email: user.email,
          socketId: value.socketId,
          role: value.role,
        });
      }
    }
    console.log("ACTIVE USERS");
    console.log(users);
    io.emit("active-users", users);
  } catch (error) {
    console.log(error);
  }
};

export const chatEvents = (socket: Socket, io: Server) => {
//active user
  socket.on("get-active-users", async () => {
    await broadcastActiveUsers(io);
  });
  //send message
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
}