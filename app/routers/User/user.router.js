import { generateKeyPair } from "crypto";
import { createUsersBySocialAccount, findAllUser, getInfoProfileUser, getUserById, userLogin, userLogout, userSignup } from "../../controllers/User/user.controller.js";
import Authentication from "../../middleware/authentication.js";
import { Authorization } from "../../middleware/authorization_token.js";
import express, { Router } from "express";
const router = express.Router();
export default function UserRouter(router = Router()) {
  router.post("/signup", userSignup);
  router.post('/social-network/signup', createUsersBySocialAccount); // Đăng ký bằng tài khoản mạng xã hội
  router.post("/login", Authentication, userLogin);
  router.delete("/logout", userLogout);

  router.get('/info-profile/', Authentication, Authorization, getInfoProfileUser);
  router.get('/info-profile/:id', Authentication,Authorization, getInfoProfileUser);

  router.get('/all-user', Authentication, Authorization, findAllUser);

  router.get('/is-existed/:id', getUserById);

  return router;  
}
