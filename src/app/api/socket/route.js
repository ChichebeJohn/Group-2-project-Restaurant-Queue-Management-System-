// pages/api/socket.js (or your app/router equivalent)
import { Server } from "socket.io";

export default function SocketHandler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.io");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    globalThis.io = io; // Attach the socket instance globally for later use.
    
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }
  res.end();
}
