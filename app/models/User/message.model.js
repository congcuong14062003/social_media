import pool from "../../../configs/database/database.js";
import {
  encryptWithPublicKey,
  generateRandomString,
} from "../../ultils/crypto.js";
import crypto from "crypto";

class Message {
  constructor(data) {
    this.private_room_id = data.private_room_id;
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
        };
      } else {
        const newRoomId = generateRandomString();
        return {
          private_room_id: newRoomId,
        };
      }
    } catch (error) {
      console.error("Error creating message: ", error);
      throw error;
    }
  }

  static async getPublicKeyReceiver(receiver_id) {
    try {
      const createMessageQuery = `
        SELECT public_key FROM userkeypair
        WHERE 
          (user_id = ?)
      `;

      const [result] = await pool.execute(createMessageQuery, [receiver_id]);

      if (result.length > 0) {
        return {
          public_key: result[0].public_key,
        };
      }
      return null;
    } catch (error) {
      console.error("Error creating message: ", error);
      throw error;
    }
  }

  async create(io, user) {
    try {
      const publicKeyReceiver = await Message.getPublicKeyReceiver(this.receiverId); // Use Message.getPublicKeyReceiver
      const textEnCryptoRSA = encryptWithPublicKey(this.contentText, publicKeyReceiver.public_key);
      
      const createMessageQuery = `
        INSERT INTO PrivateMessage (
          private_room_id,
          content_text,
          sender_id,
          receiver_id
        ) VALUES (?, ?, ?, ?);
      `;
  
      const [result] = await pool.execute(createMessageQuery, [
        this.private_room_id,
        textEnCryptoRSA,
        this.senderId,
        this.receiverId,
      ]);
  
      return (
        result.affectedRows > 0 &&
        io.to(user.socketId).emit("getMessage", {
          senderId: this.senderId,
          receiverId: this.receiverId,
          text: textEnCryptoRSA,
        })
      );
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
