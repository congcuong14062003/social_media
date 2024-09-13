import { AcceptFriend, addFriend, createUsersBySocialAccount, findAllFriend, findAllUser, findUserById, getInfoProfileUser, getUserById, userLogin, userLogout, userSignup } from "../../controllers/User/user.controller.js";
import Authentication from "../../middleware/authentication.js";
import { Authorization } from "../../middleware/authorization_token.js";

export default function UserRouter(app) {
  app.get('/all-user', Authentication, Authorization, findAllUser);
  app.post('/add-friend/:id', Authentication, Authorization, addFriend);
  app.post('/accept-add-friend/:id', Authentication, Authorization, AcceptFriend);
  app.get('/is-existed/:id', getUserById);
  app.post("/signup", userSignup);
  app.delete("/logout", userLogout);
  app.post('/social-network/signup', createUsersBySocialAccount); // Đăng ký bằng tài khoản mạng xã hội
  app.get('/info-profile/:id', Authentication,Authorization, getInfoProfileUser);
  app.get('/info-profile/', Authentication, Authorization, getInfoProfileUser);
  app.post("/login", Authentication, userLogin);
  return app;
}
