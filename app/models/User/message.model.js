import pool from "../../../configs/database/database.js";
import { generateRandomString } from "../../ultils/crypto.js";
import crypto from "crypto";

class Message {
  constructor(data) {
    this.private_room_id = data.private_room_id;
    this.public_key = data.public_key;
    this.private_key = data.private_key;
    this.contentText = data.contentText;
    this.mediaLink = data.mediaLink;
    this.contentType = data.contentType;
    this.replyToId = data.replyToId;
    this.senderId = data.senderId;
    this.receiverId = data.receiverId;
  }

  static async getRoom(sender_id, receiver_id) {
    try {
      const createMessageQuery = `
        SELECT * FROM PrivateMessage
        WHERE 
          (sender_id = ? AND receiver_id = ?)
          OR 
          (sender_id = ? AND receiver_id = ?)
        ORDER BY created_at DESC
        LIMIT 1
      `;

      const [result] = await pool.execute(createMessageQuery, [
        sender_id,
        receiver_id,
        receiver_id,
        sender_id,
      ]);

      if (result.length > 0) {
        return {
          private_room_id: result[0].private_room_id,
          public_key: result[0].public_key,
          private_key: result[0].private_key,
        };
      } else {
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 2048,
        });
        const newRoomId = generateRandomString();

        return {
          private_room_id: newRoomId,
          public_key: publicKey.export({ type: "spki", format: "pem" }),
          private_key: privateKey.export({ type: "pkcs8", format: "pem" }),
        };
      }
    } catch (error) {
      console.error("Error creating message: ", error);
      throw error;
    }
  }

  async create() {
    try {
      const createMessageQuery = `
        INSERT INTO PrivateMessage (
          private_room_id,
          content_text,
          sender_id,
          receiver_id,
          public_key,
          private_key
        ) VALUES (?, ?, ?, ?, ?, ?);
      `;

      const [result] = await pool.execute(createMessageQuery, [
        this.private_room_id,
        this.contentText,
        this.senderId,
        this.receiverId,
        this.public_key,
        this.private_key,
      ]);

      return result.affectedRows > 0 ? result : false;
    } catch (error) {
      console.error("Error creating message: ", error);
      throw error;
    }
  }

  static async getMessage(user_id, friend_id) {
    try {
      const getMessageQuery = `
        SELECT 
          messenger_id,
          private_room_id,
          content_text,
          media_link,
          content_type,
          reply_to_id,
          sender_id,
          receiver_id,
          created_at
        FROM PrivateMessage
        WHERE 
          (sender_id = ? AND receiver_id = ?)
          OR 
          (sender_id = ? AND receiver_id = ?)
        ORDER BY created_at ASC;
      `;

      const [result] = await pool.execute(getMessageQuery, [
        user_id,
        friend_id,
        friend_id,
        user_id,
      ]);

      return result;
    } catch (error) {
      console.error("Error fetching messages: ", error);
      throw error;
    }
  }
}

export default Message;
