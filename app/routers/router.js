import TokenRouter from "./Token/token.router.js";
import UserRouter from "./User/user.router.js";


export default function RouterMain(app) {
  app.use("/users", UserRouter());
  app.use("/token", TokenRouter());

  return app;
}
