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
    const usersResponse = await users.signup();

    if (usersResponse) {
      res
        .status(201)
        .json({ status: 200, message: "Tài khoản đã được tạo thành công" });
    } else {
      throw new Error("Failed to create user");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: 500, message: "Dịch vụ tạm thời gián đoạn" });
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

    const user = await Users.login(user_email, user_password);

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
    res.status(200).json({ status: 200, message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// tất cả bạn bè
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
async function getInfoProfileUser(req, res) {
  try {


    const id = req.params.id ?? req.body?.data?.user_id;
    console.log("user_id:", id)
    const dataUser = await Users.findUserById(id);
    console.log(dataUser);
    if (dataUser?.user_id) {
      return res.status(200).json({ status: 200, data: dataUser });
    } else {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // const [data_account, data_profile, data_media] = await Promise.all([
    //   Users.getById(id),
    //   UserProfile.getById(id),
    //   ProfileMedia.getById(id),
    // ]);

    // res.status(200).json({
    //   status: true,
    //   data: {
    //     ...data_account,
    //     ...data_profile,
    //     avatar: data_media.find(media => media.media_type === 'avatar').media_link ?? null,
    //     cover: data_media.find(media => media.media_type === 'cover').media_link ?? null,
    //   }

    // });
  } catch (error) {
    console.error(error); // Ghi log lỗi để dễ dàng phát hiện và sửa lỗi
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message // Trả về thông điệp lỗi cho client nếu cần
    });
  }
}
export { userSignup, userLogin, findUserById, userLogout, findAllFriend, getInfoProfileUser };


