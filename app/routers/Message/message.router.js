import {
  checkExistKeyPair,
  checkSecretDeCryptoPrivateKey,
  createKeyPair,
  getallMessages,
} from "../../controllers/Message/message.controller.js";
import Authentication from "../../middleware/authentication.js";
import { Authorization } from "../../middleware/authorization_token.js";
import express from "express";
const router = express.Router();
export default function MessageRouter() {
  router.post(
    "/all-messages/:id",
    Authentication,
    Authorization,
    getallMessages
  );
  router.get(
    "/check-exists-keypair",
    Authentication,
    Authorization,
    checkExistKeyPair
  );
  router.post("/post-keypair", Authentication, Authorization, createKeyPair);
  router.post(
    "/post-decode-private-key",
    Authentication,
    Authorization,
    checkSecretDeCryptoPrivateKey
  );
  return router;
}
