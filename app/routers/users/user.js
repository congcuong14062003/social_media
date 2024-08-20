import { findAllFriend, findUserById, getInfoProfileUser, userLogin, userLogout, userSignup } from "../../controllers/User/user.js";
import Authentication from "../../middleware/authentication.js";
import { Authorization } from "../../middleware/authorization_token.js";

export default function UserRouter(app) {
  app.post("/signup", userSignup);
  app.delete("/logout", userLogout);
  app.get('/info-profile/:id', Authentication, getInfoProfileUser);
  app.get('/info-profile/', Authentication, Authorization, getInfoProfileUser);
  app.post("/login", Authentication, userLogin);
  // app.post("/post-status", Authentication, Autho, crea);
  app.post("/check-account", findUserById)

  return app;
}
