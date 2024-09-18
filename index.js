import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connect from "./app/db/connect.js";
import RouterMain from "./app/routers/router.js";
import logger from "morgan";
import cookieParser from "cookie-parser";
import { createServer } from "http"; // Thêm cái này để tạo HTTP server
import { log } from "console";

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

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

// Socket.IO lắng nghe kết nối
io.on("connection", (socket) => {
  console.log(`${users.length} user connected.`);

  // Khi người dùng gửi userId
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // Khi gửi tin nhắn
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    console.log(senderId, receiverId, text);
    console.log("User online: ", users);

    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
    // lưu tin nhắn vào db
  });

  // Khi người dùng ngắt kết nối
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

// Lắng nghe HTTP server và Socket.IO
httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
