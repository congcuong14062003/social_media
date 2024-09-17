import { AcceptFriend, addFriend, checkFriendRequest, createUsersBySocialAccount, findAllFriend, findAllUser, findUserById, getInfoProfileUser, getUserById, ListUserInvite, userLogin, userLogout, userSignup } from "../../controllers/User/user.controller.js";
import Authentication from "../../middleware/authentication.js";
import { Authorization } from "../../middleware/authorization_token.js";

export default function UserRouter(app) {
  app.post("/signup", userSignup);
  app.post("/login", Authentication, userLogin);
  app.delete("/logout", userLogout);



  app.get('/info-profile/', Authentication, Authorization, getInfoProfileUser);
  app.get('/info-profile/:id', Authentication,Authorization, getInfoProfileUser);



  app.get('/list-user-invite', Authentication, Authorization, ListUserInvite);
  app.post('/accept-add-friend/:id', Authentication, Authorization, AcceptFriend);
  app.post('/add-friend/:id', Authentication, Authorization, addFriend);
  app.get('/check-request/:id', Authentication, Authorization, checkFriendRequest);
  


  app.get('/all-user', Authentication, Authorization, findAllUser);
  app.get('/is-existed/:id', getUserById);
  app.post('/social-network/signup', createUsersBySocialAccount); // Đăng ký bằng tài khoản mạng xã hội
  return app;
}
