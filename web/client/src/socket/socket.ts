import { io, Socket } from "socket.io-client";
const SOCKET_URL = "https://travelsync-backend-zcoj.onrender.com";
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "https://travelsync-backend-zcoj.onrender.com";

let socket: Socket | null = null;

export const createSocket = (token: string): Socket => {
  if (socket) {
    if (socket.connected) {
      return socket;
    }
    socket.auth = { token };
    socket.connect();
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    auth: {
      token,
    },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("SOCKET CONNECTED. Socket ID:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("SOCKET DISCONNECTED. Reason:", reason);
  });

  socket.on("connect_error", (error) => {
    console.log("SOCKET CONNECTION ERROR:", error.message);
  });

  return socket;
};
export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket.removeAllListeners();
    socket = null;
  }
};

