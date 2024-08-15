import { Token } from "../models/Token/token.js";
import { Users } from "../models/User/users.js";

export default async function Authentication(req, res, next) {
  try {
    // Kiểm tra access_token
    const access_token = req.headers?.authorization?.split(" ")[1];
    if (access_token) {
      const isValidated = await Token.validate(access_token);
      // Token validation
      if (isValidated.valid) {
        req.body.accessToken = access_token;
        next();
      } else {
        if (isValidated.msg === "TokenExpiredError") {
          const infoUser = isValidated?.data;
          const new_access_token = new Token(infoUser).generateAccessToken();
          const new_refresh_token = new Token(infoUser).generateRefreshToken();
          await new Token(infoUser).create(new_refresh_token);
          res.cookie("accessToken", new_access_token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: false,
            secure: true,
            sameSite: "None",
          });
          req.body.accessToken = new_access_token;
          next();
        } else {
          throw new Error("Token đăng nhập không hợp lệ");
        }
      }
    } else {
      const { user_email, user_password } = req.body;
      if (user_email && user_password) {
        const infoUser = await Users.findUser(user_email, user_password);
        if (infoUser?.user_id) {
          // Tạo access token và refresh token
          const new_access_token = new Token(infoUser).generateAccessToken();
          const new_refresh_token = new Token(infoUser).generateRefreshToken();

          // Kiểm tra token và gán access token cho cookies và đẩy refresh token vào database
          if (new_refresh_token && new_access_token) {
            await new Token(infoUser).create(new_refresh_token);
            // Nếu same site = None thì tiên quyết phải có https (secure = true)
            res.cookie("accessToken", new_access_token, {
              maxAge: 60 * 60 * 1000,
              httpOnly: false,
              secure: true,
              sameSite: "None",
            });
            req.body.accessToken = new_access_token;
            next();
          }
        } else {
          throw new Error("Email hoặc mật khẩu không hợp lệ");
        }
      } else {
        throw new Error("Vui lòng đăng nhập để xác minh tài khoản");
      }
    }
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
}
