import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import destinationRoutes from "./routes/destinationRoutes";
import authRoutes from "./routes/authRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket/socket";
import jwt from "jsonwebtoken";
import { registerSocketEvents } from "./socket/socketHandler";
import chatRoutes from "./routes/chatRoutes";
import "./firebase/firebase";
import path from "path";

dotenv.config();
connectDB();
const app = express();

// server connection socket
const server=http.createServer(app);
const onlineUsers=new Map();
const io=new Server(server,{
  cors:{
    origin:"*",
    methods:["GET","POST"],
  },
});
app.set("io", io);

registerSocketEvents(io); 

const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
  }),
);
app.use("/uploads", express.static("uploads"));

app.use("/api/destinations", destinationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
console.log("REGISTERING CHAT ROUTES");
app.use("/api/chat",chatRoutes);

app.use("/api/chat", chatRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.get("/", (req: Request, res: Response) => {
  res.send("Travel App API is working!");
});
app.get("/hello", (req, res) => {
  res.send("HELLO FROM MY SERVER");
});
//server listen
  server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
