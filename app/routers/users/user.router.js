import { userSignup } from "../../controllers/users/user.js";

export default function UserRouter(app) {
  app.post("/signup", userSignup);
  return app;
}
