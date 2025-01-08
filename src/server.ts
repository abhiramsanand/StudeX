import http from "http";
import { Server } from "socket.io";
import app from "./app";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://stude-x.vercel.app"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {});
});

export { io, server };
