import { io, users } from "../../..";
import uploadFile from "../../../configs/cloud/cloudinary.config";
import { getSocketIdByUserId } from "../../../configs/socketIO/socketManager";
import Message from "../../models/Message/message.model";
import { UserKeyPair } from "../../models/User/users.model";
import { decryptWithPrivateKey } from "../../ultils/crypto";
const createMessage = async (req, res) => {
  try {
    const files = req.files || {};
    const user_id = req.body?.data?.user_id ?? null;
    const friend_id = req.params?.id ?? null;
    let content_text = req.body?.content_text ?? "";
    const content_type = req.body?.content_type ?? "";
    const name_file = req.body?.name_file ?? "";
    console.log(files[0]);

    const friendHasKey = await UserKeyPair.getKeyPair(friend_id);

    if (!friendHasKey) {
      return res
        .status(401)
        .json({
          status: 401,
          message: "Bạn bè chưa thiết lập tin nhắn vui lòng thử lại sau",
        });
    }

    if (files.length > 0) {
      content_text = (
        await uploadFile(files[0], process.env.NAME_FOLDER_MESSENGER)
      )?.url;
    }

    // Check for missing required fields
    if (!user_id || !friend_id || !content_text) {
      return res
        .status(400)
        .json({ status: false, message: "Dữ liệu nhập vào không hợp lệ" });
    }

    // Create a new message instance
    const newMessage = new Message({
      sender_id: user_id,
      receiver_id: friend_id,
      content_type: content_type,
      name_file: name_file,
    });

    // Attempt to create the message in the database
    const result = await newMessage.create(content_text);

    // Respond based on the result of the message creation
    if (result) {
      // Send message to receiver regardless of database result
      io.to(getSocketIdByUserId(friend_id, users)).emit("receiveMessage", {
        sender_id: user_id,
        receiver_id: friend_id,
        content_text: content_text,
        content_type: content_type,
        name_file: name_file,
      });
      return res.status(201).json({ status: 200 });
    } else {
      return res
        .status(500)
        .json({ status: false, message: "Failed to create message" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      status: false,
      message: "An error occurred, please try again later",
    });
  }
};
// lấy tất cả tin nhắn của mình mới 1 người nào đó
const getAllMessages = async (req, res) => {
  try {
    const user_id = req.body?.data?.user_id ?? null;
    const friend_id = req.params?.id ?? null;
    const private_key = req.body?.private_key ?? "";
    console.log("user_id", user_id);
    console.log("friend_id", friend_id);
    console.log("private_key", private_key);

    if (!user_id || !friend_id || !private_key) {
      return res.status(400).json({ status: false });
    }

    const result = await Message.getMessage(user_id, friend_id);

    const listMsgDecrypt = await Promise.all(
      result.map(async (item) => {
        let content_text = "Encrypted message";

        if (item.sender_id === user_id) {
          content_text = decryptWithPrivateKey(
            item.content_text_encrypt_by_owner,
            private_key
          );
        } else if (item.sender_id === friend_id) {
          content_text = decryptWithPrivateKey(
            item.content_text_encrypt,
            private_key
          );
        }

        return {
          message_id: item.id,
          sender_id: item.sender_id,
          receiver_id: item.receiver_id,
          content_text,
          name_file: item.name_file,
          content_type: item.content_type,
          created_at: item.created_at,
        };
      })
    );

    return res.status(200).json({ status: 200, data: listMsgDecrypt });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "An error occurred, please try again later",
    });
  }
};
// kiểm tra cặp khoá đã tồn tại chưa
const checkExistKeyPair = async (req, res) => {
  try {
    const user_id = req.body?.data?.user_id;
    const result = await UserKeyPair.getKeyPair(user_id);

    if (result) {
      res.status(200).json({ status: 200 });
    } else {
      res.status(401).json({
        status: 401,
      });
    }
    // Gửi phản hồi về cho client
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 500, message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
};
// kiểm tra mã code
const checkSecretDeCryptoPrivateKey = async (req, res) => {
  try {
    const user_id = req.body?.data?.user_id;
    const code = req.body?.code;
    const result = await UserKeyPair.checkPrivateKey(user_id, code);
    if (result) {
      res.status(200).json({ status: 200, data: result });
    } else {
      res.status(401).json({
        status: 401,
        message: "Mật khẩu không chính xác vui lòng thử lại",
      });
    }
    // Gửi phản hồi về cho client
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 500, message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
};
// tạo cặp khoá
const createKeyPair = async (req, res) => {
  try {
    const user_id = req.body?.data?.user_id;
    const code = req.body?.code;
    // const userKeyPair = new UserKeyPair();
    const result = await UserKeyPair.generateKeyPair(user_id, code);
    if (result) {
      res
        .status(201)
        .json({ status: 200, message: "Thiết lập mật khẩu thành công" });
    } else {
      res.status(400).json({
        status: false,
        message: "Tạo khoá thất bại, thử lại với mã khác",
      });
    }
    // Gửi phản hồi về cho client
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
};
// xoá cặp khoá
const deleteKeysPair = async (req, res) => {
  try {
    const user_id = req.body?.data?.user_id;

    if (!user_id) {
      return res
        .status(400)
        .json({ status: false, message: "Missing user_id" });
    }

    const result = await UserKeyPair.deleteKeysPair(user_id);

    if (result) {
      // Nếu xóa thành công
      return res
        .status(200)
        .json({ status: 200 });
    } else {
      // Nếu không tìm thấy hoặc không xóa được
      return res
        .status(404)
        .json({ status: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Đã xảy ra lỗi, vui lòng thử lại sau",
    });
  }
};

export {
  createMessage,
  getAllMessages,
  checkExistKeyPair,
  checkSecretDeCryptoPrivateKey,
  createKeyPair,
  deleteKeysPair,
};
