import UserRouter from "./users/user.router.js";
import express from "express";
const router = express.Router();

export default function RouterMain(app) {
  app.use("/users", UserRouter(router));
  return app;
}
