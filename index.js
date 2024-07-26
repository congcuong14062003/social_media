import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connect from "./app/db/connect.js";
import RouterMain from "./app/routers/router.js";
import logger from "morgan";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cookieParser());

//server
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

connect();
const PORT = process.env.PORT || 5000;
RouterMain(app);
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
