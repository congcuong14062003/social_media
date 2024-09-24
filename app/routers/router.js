import TokenRouter from "./Token/token.router.js";
import FriendRouter from "./Friend/friend.router.js";
import UserRouter from "./User/user.router.js";
import MessageRouter from "./Message/message.router.js";


export default function RouterMain(app) {
  app.use("/users", UserRouter());
  app.use("/friends", FriendRouter());
  app.use("/messages", MessageRouter());
  app.use("/token", TokenRouter());

  return app;
}
