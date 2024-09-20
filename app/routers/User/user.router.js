import { generateKeyPair } from "crypto";
import { AcceptFriend, addFriend, cancelFriendRequest, checkExistKeyPair, checkFriendRequest, checkSecretDeCryptoPrivateKey, createKeyPair, createUsersBySocialAccount, findAllFriend, findAllUser, findUserById, getallMessages, getInfoProfileUser, getUserById, ListUserInvite, userLogin, userLogout, userSignup } from "../../controllers/User/user.controller.js";
import Authentication from "../../middleware/authentication.js";
import { Authorization } from "../../middleware/authorization_token.js";
import express from "express";
const router = express.Router();
export default function UserRouter() {
  router.post("/signup", userSignup);
  router.post("/login", Authentication, userLogin);
  router.delete("/logout", userLogout);



  router.get('/info-profile/', Authentication, Authorization, getInfoProfileUser);
  router.get('/info-profile/:id', Authentication,Authorization, getInfoProfileUser);



  router.get('/list-user-invite', Authentication, Authorization, ListUserInvite);
  router.post('/accept-add-friend/:id', Authentication, Authorization, AcceptFriend);
  router.post('/add-friend/:id', Authentication, Authorization, addFriend);
  router.get('/check-request/:id', Authentication, Authorization, checkFriendRequest);
  router.post('/cancel-request/:id', Authentication, Authorization, cancelFriendRequest);


  router.get('/all-messages/:id', Authentication, Authorization, getallMessages);
  router.get('/check-exists-keypair', Authentication, Authorization, checkExistKeyPair);
  router.post('/post-keypair', Authentication, Authorization, createKeyPair);
  router.post('/post-decode-private-key', Authentication, Authorization, checkSecretDeCryptoPrivateKey);




  router.get('/all-user', Authentication, Authorization, findAllUser);
  router.get('/is-existed/:id', getUserById);
  router.post('/social-network/signup', createUsersBySocialAccount); // Đăng ký bằng tài khoản mạng xã hội
  return router;
}
