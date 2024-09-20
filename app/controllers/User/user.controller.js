import pool from "../../../configs/database/database.js";
import Friend from "../../models/User/friend.model.js";
import Message from "../../models/User/message.model.js";
import { ProfileMedia } from "../../models/User/profile_media.model.js";
import { UserProfile } from "../../models/User/user_profile.model.js";
import { UserSetting } from "../../models/User/user_setting.model.js";
import { UserKeyPair, Users } from "../../models/User/users.model.js";

// Tạo người dùng
const userSignup = async (req, res) => {
  try {
    const data = req.body;

    // Kiểm tra email đã tồn tại hay chưa
    const emailExists = await Users.checkEmailExists(data.user_email);
    if (emailExists) {
      return res
        .status(400)
        .json({ status: false, message: "Email đã tồn tại" });
    }
    // Tiếp tục tạo người dùng nếu email không tồn tại
    const users = new Users(data);
    const user_id = await users.create();
    if (user_id) {
      new ProfileMedia({
        user_id: user_id,
        media_type: "avatar",
        media_link:
          "https://static.vecteezy.com/system/resources/previews/026/266/484/original/default-avatar-profile-icon-social-media-user-photo-image-vector.jpg",
      }).create();
      new UserProfile({
        user_id,
        ...data,
      }).create();

      const userSetting = new UserSetting({
        user_id: user_id,
        ...data,
      });
      await userSetting.create();
      res
        .status(201)
        .json({ status: 200, message: "Tài khoản đã được tạo thành công" });
    } else {
      throw new Error(usersResponse);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message ?? error });
  }
};

// đăng ký bằng sgg, fb
const createUsersBySocialAccount = async (req, res) => {
  try {
    const data = req.body;
    const users = new Users({ ...data, user_id: `uid_${data?.user_id}` });
    const user_id = await users.create();

    if (user_id) {
      new ProfileMedia({
        user_id: user_id,
        media_type: "avatar",
        media_link:
          "https://static.vecteezy.com/system/resources/previews/026/266/484/original/default-avatar-profile-icon-social-media-user-photo-image-vector.jpg",
      }).create();
      new UserProfile({
        user_id,
        ...data,
      }).create();

      const userSetting = new UserSetting({
        user_id: user_id,
        ...data,
      });
      await userSetting.create();
      res.status(201).json({ status: 200 });
    } else {
      throw new Error(usersResponse);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message ?? error });
  }
};

// đăng nhập
const userLogin = async (req, res) => {
  try {
    // console.log(req.body);
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
    res.clearCookie("accessToken"); // Thay đổi tên cookie tùy thuộc vào cấu hình của bạn
    res.clearCookie("key_refresh_token_encode"); // Thay đổi tên cookie tùy thuộc vào cấu hình của bạn
    res.clearCookie("refreshToken"); // Thay đổi tên cookie tùy thuộc vào cấu hình của bạn

    // Nếu bạn sử dụng token, xóa token ở đây (ví dụ xóa khỏi database nếu cần)
    // await TokenModel.deleteOne({ userId: req.user.id });

    // Phản hồi thành công
    res.status(200).json({ status: 200, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// tất cả bạn bè
const findAllFriend = async (req, res) => {
  try {
    // console.log(req.body);
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

// tất cả người dùng
const findAllUser = async (req, res) => {
  try {
    const user_id = req.body?.data?.user_id;
    console.log("user_id: ", user_id);
    const data = await Users.getAllUser(user_id);
    console.log("data: ", data);
    if (data) {
      res.status(200).json({ status: 200, users: data });
    } else {
      res.status(401).json({ status: 401 });
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
    // console.log(req.body);
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
    const [data_account, data_profile, data_media, data_setting] =
      await Promise.all([
        Users.getById(id),
        UserProfile.getById(id),
        ProfileMedia.getById(id),
        UserSetting.getById(id),
      ]);

    const getLastMediaLink = (mediaArray, mediaType) =>
      mediaArray
        .filter((media) => media.media_type === mediaType)
        .reduce((_, media) => media.media_link, null);

    res.status(200).json({
      status: 200,
      data: {
        ...data_account,
        ...data_profile,
        ...data_setting,
        avatar: getLastMediaLink(data_media, "avatar"),
        cover: getLastMediaLink(data_media, "cover"),
      },
    });
  } catch (error) {
    console.error(error); // Ghi log lỗi để dễ dàng phát hiện và sửa lỗi
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message, // Trả về thông điệp lỗi cho client nếu cần
    });
  }
}

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await Users.findUserById(req.params.id);
    if (user) {
      res.status(200).json({ status: true, data: user });
    } else {
      res.status(404).json({ status: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message ?? error });
  }
};

// add bạn bè
const addFriend = async (req, res) => {
  try {
    // console.log(req.body);
    const friend_id = req.params.id;
    const user_id = req.body?.data?.user_id;

    // console.log(req.body);

    const user = await Users.findUserById(user_id);
    const friend = await Users.findUserById(friend_id);

    if (!user || !friend) {
      return res
        .status(401)
        .json({ status: 401, message: "Không tồn tại người dùng" });
    }
    const addFriend = await Users.addFriendById(user_id, friend_id);
    if (addFriend === 1) {
      res
        .status(200)
        .json({ status: 200, message: "Gửi lời mời kết bạn thành công" });
    } else {
      res.status(401).json({ status: 401, message: "Lỗi khi gửi lời mời" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message ?? error });
  }
};

// chấp nhận lời mời
const AcceptFriend = async (req, res) => {
  try {
    const requestor_id = req.params.id;
    const receiver_id = req.body?.data?.user_id;

    // Kiểm tra sự tồn tại của người gửi và người nhận
    const [checkRequestor, checkReceiver] = await Promise.all([
      Users.getById(requestor_id),
      Users.getById(receiver_id),
    ]);

    if (checkRequestor?.user_id && checkReceiver?.user_id) {
      const result = await Friend.updateStatus(requestor_id, receiver_id, 1);
      if (result === 1) {
        res.status(200).json({
          status: 200,
          message: "Các bạn đã trở thành bạn bè, hãy trò chuyện ngay",
        });
      } else {
        res.status(404).json({ status: false, message: "Lỗi bất định" });
      }
    } else {
      throw new Error("Người dùng không tồn tại");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message ?? error });
  }
};

const ListUserInvite = async (req, res) => {
  try {
    // console.log(req.body);
    const user_id = req.body?.data?.user_id;
    const user = await Users.ListInviting(user_id);
    if (user) {
      res.status(200).json({ status: 200, data: user });
    } else {
      res.status(401).json({ status: 401 });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message ?? error });
  }
};

// controllers/User/user.controller.js
export async function checkFriendRequest(req, res) {
  const requestor_id = req.params.id;
  const receiver_id = req.body?.data?.user_id;
  try {
    const query = `
          SELECT * FROM friend 
          WHERE requestor_id = ? AND receiver_id = ? 
             OR requestor_id = ? AND receiver_id = ?
      `;
    const [rows] = await pool.execute(query, [
      requestor_id,
      receiver_id,
      receiver_id,
      requestor_id,
    ]);

    // Return status based on whether a request exists
    res.json({ hasRequest: rows.length > 0 });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// controllers/User/user.controller.js
export async function cancelFriendRequest(req, res) {
  const requestor_id = req.params.id;
  const receiver_id = req.body?.data?.user_id;

  try {
    const query = `
          DELETE FROM friend 
          WHERE requestor_id = ? AND receiver_id = ? 
             OR requestor_id = ? AND receiver_id = ?
      `;
    await pool.execute(query, [
      requestor_id,
      receiver_id,
      receiver_id,
      requestor_id,
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const getallMessages = async (req, res) => {
  try {
    const user_id = req.body?.data?.user_id;
    const friend_id = req.params.id;

    // Lấy tin nhắn từ cơ sở dữ liệu
    console.log(user_id, friend_id);

    const result = await Message.getMessage(user_id, friend_id);

    // Gửi phản hồi về cho client
    res.status(200).json({ status: 200, data: result });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 500, message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
};

const checkExistKeyPair = async (req, res) => {
  try {
    const user_id = req.body?.data?.user_id;
    const result = await UserKeyPair.getKeyPair(user_id);
    console.log("result: ", result);
    
    if (result) {
      res.status(200).json({ status: 200, message: "đã tồn tại cặp khoá"});
    } else {
      res.status(401).json({ status: 401, message: "chưa tồn tại cặp khoá"});
    }
    // Gửi phản hồi về cho client
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 500, message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
};

const createKeyPair = async (req, res) => {
  try {
    const user_id = req.body?.data?.user_id;
    const secretKey = req.body?.secret_key;
    const result = await UserKeyPair.generateKeyPair(user_id, secretKey);
    console.log("result: ", result);
    if (result) {
      res.status(200).json({ status: 200, message: "Tạo khoá thành công"});
    } else {
      res.status(401).json({ status: 401, message: "Tạo khoá thất bại"});
    }
    // Gửi phản hồi về cho client
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 500, message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
};


const checkSecretDeCryptoPrivateKey = async (req, res) => {
  try {
    const user_id = req.body?.data?.user_id;
    const secretKey = req.body?.secret_key;
    const result = await UserKeyPair.checkPrivateKey(user_id, secretKey);
    console.log("result: ", result);
    if (result) {
      res.status(200).json({ status: 200, data: result});
    } else {
      res.status(401).json({ status: 401, message: "Mã khoá sai"});
    }
    // Gửi phản hồi về cho client
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 500, message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
};

export {
  userSignup,
  userLogin,
  findUserById,
  userLogout,
  findAllFriend,
  getInfoProfileUser,
  getUserById,
  createUsersBySocialAccount,
  addFriend,
  AcceptFriend,
  findAllUser,
  ListUserInvite,
  getallMessages,
  checkExistKeyPair,
  createKeyPair,
  checkSecretDeCryptoPrivateKey
};
