import Message from "../../models/Message/message.model";
import { UserKeyPair } from "../../models/User/users.model";
import { decryptWithPrivateKey } from "../../ultils/crypto";

// lấy tất cả tin nhắn của mình mới 1 người nào đó
const getallMessages = async (req, res) => {
  try {
    const user_id = req.body?.data?.user_id;
    const friend_id = req.params.id;
    const private_key = req.body?.private_key;
    console.log("code: ", private_key);

    // Lấy tất cả tin nhắn giữa user_id và friend_id từ cơ sở dữ liệu
    const result = await Message.getMessage(user_id, friend_id);

    // Khởi tạo một mảng để lưu các tin nhắn đã giải mã
    const listMsgDecrypt = [];

    // Lặp qua tất cả các tin nhắn và giải mã từng tin nhắn
    for (const item of result) {
      let content_text = "Tin nhắn mã hoá";

      if (item.sender_id === user_id) {
        content_text = decryptWithPrivateKey(
          item.content_text_encrypt_by_owner,
          private_key
        );
      }

      if (item.sender_id === friend_id) {
        content_text = decryptWithPrivateKey(
          item.content_text_encrypt,
          private_key
        );
      }

      // Thêm tin nhắn đã giải mã vào mảng kết quả
      listMsgDecrypt.push({
        message_id: item.id, // ID của tin nhắn
        sender_id: item.sender_id, // ID của người gửi
        receiver_id: item.receiver_id, // ID của người nhận
        content_text, // Nội dung tin nhắn đã giải mã
        created_at: item.created_at, // Thời gian gửi tin nhắn
      });
    }

    // Gửi phản hồi về client với mảng các tin nhắn đã giải mã
    res.status(200).json({ status: 200, data: listMsgDecrypt });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 500, message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
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
      res.status(401).json({ status: 401 });
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
    const secretKey = req.body?.secret_key;
    const result = await UserKeyPair.checkPrivateKey(user_id, secretKey);
    if (result) {
      res.status(200).json({ status: 200, data: result });
    } else {
      res.status(401).json({ status: 401, message: "Mã khoá sai" });
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
    const secretKey = req.body?.secret_key;
    const result = await UserKeyPair.generateKeyPair(user_id, secretKey);
    if (result) {
      res.status(200).json({ status: 200, message: "Tạo khoá thành công" });
    } else {
      res.status(401).json({ status: 401, message: "Tạo khoá thất bại" });
    }
    // Gửi phản hồi về cho client
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 500, message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
};
export { getallMessages, checkExistKeyPair, checkSecretDeCryptoPrivateKey, createKeyPair };
