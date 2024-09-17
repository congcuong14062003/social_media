import { Token } from "../models/Token/token.js";
import { Users } from "../models/User/users.model.js";
import { encryptAES, generateRandomString } from "../ultils/crypto.js";
require("dotenv").config();
export default async function Authentication(req, res, next) {
  try {
      // Kiểm tra access_token 
      const access_token = req.headers?.authorization?.split(' ')[1];
      if (access_token) {
        //   console.log("Đăng nhập bằng token");
          
          const isValidated = await Token.validate(access_token);
          // Token validation
          if (isValidated.valid) {
              req.body.accessToken = access_token;
              next();
          } 
      } else {
        //   console.log("Đăng nhập bình thường");
          const { user_email, user_password } = req.body;
          if (user_email && user_password) {
              const infoUser = await Users.login(user_email, user_password);
              console.log("infoUser:", infoUser);
              
              if (infoUser?.user_id) {
                  const randomKeyRefreshToken = generateRandomString(); // Tạo chuỗi tự sinh 8 ký tự
                //   console.log("key chưa encode sau đăng nhập:", randomKeyRefreshToken);
                  const key_encode = encryptAES(randomKeyRefreshToken); // Mã hóa chuỗi tự sinh
                  const new_access_token = new Token(infoUser).generateAccessToken();
                  const new_refresh_token = new Token(infoUser).generateRefreshToken(randomKeyRefreshToken);
                  await new Token(infoUser).create(new_refresh_token, randomKeyRefreshToken);
                  res.cookie('key_refresh_token_encode', key_encode, { maxAge: parseInt(process.env.TIME_EXPIRED_REFRESH_TOKEN) * 24 * 60 * 60 * 1000, httpOnly: false, secure: true, sameSite: 'None' });
                  res.cookie('accessToken', new_access_token, { maxAge: parseInt(process.env.TIME_EXPIRED_ACCESS_TOKEN) * 60 * 1000, httpOnly: false, secure: true, sameSite: 'None' });
                  res.cookie('refreshToken', new_refresh_token, { maxAge: parseInt(process.env.TIME_EXPIRED_REFRESH_TOKEN) * 24 * 60 * 60 * 1000, httpOnly: false, secure: true, sameSite: 'None' });
                  req.body.accessToken = new_access_token;
                  next();
                  console.log("vào 2");
              } else {
                  throw new Error('Email hoặc mật khẩu không hợp lệ');
              }
          }
      }
  } catch (error) {
      res.status(400).json({ status: false, message: error.message });
  }
}
