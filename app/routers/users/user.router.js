import { Logout, UserInfor, UserLogin, userSignup } from "../../controllers/users/user.js";

export default function UserRouter(app) {
  app.post("/signup", userSignup);
  app.post("/login", UserLogin);
  app.get("/me", UserInfor);
  app.post("/logout", Logout);
  return app;
}
