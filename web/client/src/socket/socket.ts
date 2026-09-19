import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export const createSocket = (token: string) => {
  const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("SOCKET CONNECTED");
    console.log("Socket ID:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("SOCKET DISCONNECTED");
    console.log("Reason:", reason);
  });

  socket.on("connect_error", (error) => {
    console.log("CONNECTION ERROR");
    console.log(error.message);
  });

  return socket;
};