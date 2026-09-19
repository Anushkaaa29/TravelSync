import jwt from "jsonwebtoken";
import onlineUsers from "./onlineUser";
import { chatEvents } from "./chatEvents";
import { Server } from "socket.io";

export const registerSocketEvents = (io: Server) => {
  io.use((socket: any, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.query?.token;
      if (!token) return next(new Error("No Token"));
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      );
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error("Invalid Token"));
    }
  });

  io.on("connection", (socket: any) => {
    const user = socket.data.user;
    console.log(" USER CONNECTED:", user);
    if (!user) {
      return socket.disconnect();
    }
    onlineUsers.set(user.id, {
      socketId: socket.id,
      role: user.role,
    });
    console.log(" ONLINE USERS:");
    console.log([...onlineUsers.entries()]);
    chatEvents(socket, io);
    socket.on("disconnect", () => {
      console.log(" USER DISCONNECTED:", user.id);
      onlineUsers.delete(user.id);
      console.log("AFTER DISCONNECT:");
      console.log([...onlineUsers.entries()]);
    });
  });
};