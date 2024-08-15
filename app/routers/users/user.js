import { findAllFriend, findUserById, userLogin, userLogout, userSignup } from "../../controllers/User/user.js";
import Authentication from "../../middleware/authentication.js";

export default function UserRouter(app) {
  app.post("/signup", userSignup);
  app.post("/logout", userLogout);
  app.post("/login", Authentication, userLogin);
  app.post("/check-account", findUserById)

  return app;
}
