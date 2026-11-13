import jwt from "jsonwebtoken";
import onlineUsers from "./onlineUser";
import { chatEvents, broadcastActiveUsers } from "./chatEvents";
import { Server } from "socket.io";
import { chatEvents, broadcastActiveUsers } from "./chatEvents";

export const registerSocketEvents = (io: Server) => {
  io.use((socket: any, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.query?.token;
      if (!token) return next(new Error("No Token"));
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      );
      socket.data.user = decoded;
      next();
    } catch (err) {
      console.error("Socket authentication error:", err);
      next(new Error("Invalid Token"));
    }
  });

  io.on("connection", async (socket: any) => {
    const user = socket.data.user;
    if (!user) {
      return socket.disconnect();
    }

    const userId = (user.id || user._id)?.toString();
    if (!userId) {
      console.log("No valid userId found in token for socket:", socket.id);
      return socket.disconnect();
    }
    socket.data.user.id = userId;

    console.log(` USER CONNECTED: ${userId} (${user.role}) [Socket: ${socket.id}]`);

    const existingUser = onlineUsers.get(userId);
    const socketIds: Set<string> = existingUser?.socketIds || new Set<string>();
    socketIds.add(socket.id);

    onlineUsers.set(userId, {
      socketId: socket.id,
      socketIds,
      role: user.role || "user",
    });
<<<<<<< HEAD
    chatEvents(socket, io);
broadcastActiveUsers(io);  
    console.log(" ONLINE USERS:");
    console.log([...onlineUsers.entries()]);
    chatEvents(socket, io);
    socket.on("disconnect", () => {
      console.log(" USER DISCONNECTED:", user.id);
      onlineUsers.delete(user.id);
broadcastActiveUsers(io);
      console.log("AFTER DISCONNECT:");
      console.log([...onlineUsers.entries()]);
=======

    console.log(" ONLINE USERS COUNT:", onlineUsers.size);

    chatEvents(socket, io);

    // Broadcast updated active users list to all connected clients immediately
    await broadcastActiveUsers(io);

    socket.on("disconnect", async () => {
      console.log(` USER DISCONNECTED: ${userId} [Socket: ${socket.id}]`);
      const userRecord = onlineUsers.get(userId);
      if (userRecord) {
        if (userRecord.socketIds) {
          userRecord.socketIds.delete(socket.id);
          if (userRecord.socketIds.size === 0) {
            onlineUsers.delete(userId);
            console.log(`USER ${userId} FULLY OFFLINE. Remaining online:`, onlineUsers.size);
            await broadcastActiveUsers(io);
          } else {
            // Update active socketId to another active socket for this user
            userRecord.socketId = Array.from(userRecord.socketIds).pop();
          }
        } else if (userRecord.socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`USER ${userId} OFFLINE. Remaining online:`, onlineUsers.size);
          await broadcastActiveUsers(io);
        }
      }
>>>>>>> ccbe19e (Fix online users tracking in chat)
    });
  });
};
