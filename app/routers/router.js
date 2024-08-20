import TokenRouter from "./Token/token.router.js";
import UserRouter from "./users/user.js";
import express from "express";
const router = express.Router();

export default function RouterMain(app) {
  app.use("/users", UserRouter(router));
  app.use("/token", TokenRouter(router));

  return app;
}
