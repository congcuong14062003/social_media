import {
  findUser,
  loginAction,
  signUpAction,
} from "../../models/users/user.js";

export const userSignup = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res
        .status(401)
        .json({ success: false, message: "Please fill all infomation" });
    } else {
      await signUpAction({
        email: req.body.email,
        password: req.body.password,
      });
      res.status(200).json({ success: true, message: "Đăng ký thành công" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};
const sessions = {};

export const UserLogin = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(401)
        .json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });
    }

    const result = await loginAction({
      email: req.body.email,
      password: req.body.password,
    });

    if (result.success) {
      const sessionId = Date.now().toString();
      sessions[sessionId] = {
        userId: result.user.id,
      };

      res.setHeader(
        "Set-Cookie",
        `sessionId=${sessionId}; Max-Age=3600; HttpOnly`
      );

      return res
        .status(200)
        .json({ success: true, message: result.message, user: result.user });
    } else {
      return res.status(401).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

export const UserInfor = async (req, res) => {
  const session = sessions[req.cookies.sessionId];
  console.log(session);
  if (!session) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization failed." });
  }
  const user = await findUser(session.userId);
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization failed." });
  }
  res.json(user);
};

export const Logout = async (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    delete sessions[sessionId]; // Xóa session từ bộ nhớ
    res.setHeader("Set-Cookie", "sessionId=; Max-Age=0; HttpOnly"); // Xóa cookie sessionId
  }
  res.status(200).json({ success: true, message: "Đăng xuất thành công" });
};