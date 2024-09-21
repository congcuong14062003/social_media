import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connect from "./app/db/connect.js";
import RouterMain from "./app/routers/router.js";
import logger from "morgan";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import pool from "./configs/database/database.js";
import { encryptWithPublicKey, decryptWithPrivateKey } from "./app/ultils/crypto.js";
import Message from "./app/models/User/message.model.js";

dotenv.config();
const app = express();
const httpServer = createServer(app); // Tạo HTTP server từ Express

// Cấu hình Socket.IO
const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3001",
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cookieParser());

// Cấu hình CORS cho server
app.use(
  cors({
    origin: "http://localhost:3001", // URL của React app
    credentials: true,
  })
);

// Kết nối đến database
connect();

// Cấu hình route chính
RouterMain(app);

const PORT = process.env.PORT || 5000;

// Tạo danh sách người dùng
let users = [];

// Thêm người dùng vào danh sách
const addUser = (userId, socketId) => {
  const existingUser = users.find((user) => user.userId === userId);
  if (existingUser) {
    existingUser.socketId = socketId;
  } else {
    users.push({ userId, socketId });
  }
};

// Xóa người dùng khỏi danh sách
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

// Lấy người dùng dựa trên userId
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

// Socket.IO lắng nghe kết nối
io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    console.log(`${users.length} user connected.`);
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);

    if (user) {
      try {
        // Tìm hoặc tạo phòng trò chuyện
      

          const newMessage = new Message({
            contentText: text,
            senderId,
            receiverId,
          });

          const result = await newMessage.create(io, user);
         

        
      } catch (error) {
        console.error("Error saving message: ", error);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

// Lắng nghe HTTP server và Socket.IO
httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
