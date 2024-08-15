import { Users } from "../../models/User/users.js";

// Tạo người dùng
const userSignup = async (req, res) => {
  try {
    const { user_name, user_email, user_password } = req.body;

    // Kiểm tra nếu thiếu thông tin
    if (!user_name || !user_email || !user_password) {
      return res
        .status(400)
        .json({ status: 400, message: "Vui lòng nhập đầy đủ thông tin" });
    }

    // Kiểm tra email đã tồn tại hay chưa
    const emailExists = await Users.checkEmailExists(user_email);
    if (emailExists) {
      return res.status(400).json({ status: 400, message: "Email đã tồn tại" });
    }

    const userData = { user_name, user_email, user_password };
    const users = new Users(userData);
    const usersResponse = await users.createUser();

    if (usersResponse) {
      res
        .status(201)
        .json({ status: 200, message: "Tài khoản đã được tạo thành công" });
    } else {
      throw new Error("Failed to create user");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: 400, message: error.message });
  }
};



// đăng nhập
const userLogin = async (req, res) => {
  try {
    console.log(req.body);
    const { user_email, user_password } = req.body;

    // Kiểm tra nếu thiếu thông tin
    if (!user_email || !user_password) {
      return res
        .status(400)
        .json({ status: 400, message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const user = await Users.findUser(user_email, user_password);

    if (user) {
      res
        .status(200)
        .json({ status: 200, message: "Đăng nhập thành công", user: user });
    } else {
      res
        .status(401)
        .json({ status: 401, message: "Thông tin đăng nhập không chính xác" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 500, message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
};

// đăng xuất
async function userLogout(req, res) {
  try {
      // Xóa cookie (nếu bạn sử dụng cookie để lưu trữ session)
      res.clearCookie('accessToken'); // Thay đổi tên cookie tùy thuộc vào cấu hình của bạn
      
      // Nếu bạn sử dụng token, xóa token ở đây (ví dụ xóa khỏi database nếu cần)
      // await TokenModel.deleteOne({ userId: req.user.id });

      // Phản hồi thành công
      res.status(200).json({status: 200, message: 'Logout successful' });
  } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
}


const findAllFriend = async (req, res) => {
  try {
    console.log(req.body);
    const { user_id } = req.body;

    const user = await Users.findUserById(user_id);

    if (user) {
      res
        .status(200)
        .json({ status: 200, message: "Tồn tại người dùng", user: user });
    } else {
      res
        .status(401)
        .json({ status: 401, message: "Không tồn tại người dùng" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 500, message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
};

const findUserById = async (req, res) => {
  try {
    console.log(req.body);
    const { user_id } = req.body;

    const user = await Users.findUserById(user_id);

    if (user) {
      res
        .status(200)
        .json({ status: 200, message: "Tồn tại người dùng", user: user });
    } else {
      res
        .status(401)
        .json({ status: 401, message: "Không tồn tại người dùng" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 500, message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
};

export { userSignup, userLogin, findUserById, userLogout, findAllFriend };
