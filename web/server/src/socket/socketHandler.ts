import jwt from "jsonwebtoken";
import onlineUsers from "./onlineUser";
import { chatEvents, broadcastActiveUsers } from "./chatEvents";
import { Server } from "socket.io";

export const registerSocketEvents = (io: Server) => {
  // Socket Authentication
  io.use((socket: any, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.query?.token;

      if (!token) {
        return next(new Error("No Token"));
      }

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

  // Socket Connection
  io.on("connection", (socket: any) => {
    const user = socket.data.user;

    if (!user) {
      return socket.disconnect();
    }

    const userId = (user.id || user._id)?.toString();

    if (!userId) {
      console.log("No valid userId found:", socket.id);
      return socket.disconnect();
    }

    socket.data.user.id = userId;

    console.log(
      `USER CONNECTED: ${userId} (${user.role})`
    );

    // Track online user
    const existingUser = onlineUsers.get(userId);

    const socketIds: Set<string> =
      existingUser?.socketIds || new Set<string>();

    socketIds.add(socket.id);

    onlineUsers.set(userId, {
      socketId: socket.id,
      socketIds,
      role: user.role || "user",
    });

    console.log("ONLINE USERS:", [...onlineUsers.entries()]);

    // Register chat events only once
    chatEvents(socket, io);

    // Broadcast updated online users
    void broadcastActiveUsers(io);

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`USER DISCONNECTED: ${userId}`);

      const userRecord = onlineUsers.get(userId);

      if (userRecord) {
        userRecord.socketIds?.delete(socket.id);

        if (
          !userRecord.socketIds ||
          userRecord.socketIds.size === 0
        ) {
          onlineUsers.delete(userId);
        } else {
          userRecord.socketId =
            Array.from(userRecord.socketIds).pop();
        }
      }

      console.log(
        "ONLINE USERS AFTER DISCONNECT:",
        [...onlineUsers.entries()]
      );

      // Broadcast updated list
      await broadcastActiveUsers(io);
    });
  });
};
