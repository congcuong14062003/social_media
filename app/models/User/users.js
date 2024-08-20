import pool from "../../../configs/database/database.js";
import { generateId, hashString } from "../../ultils/crypto.js";

class Users {
  constructor(data) {
    this.user_id = data.user_id || generateId("USER_");
    this.user_name = data.user_name;
    this.user_email = data.user_email;
    this.user_password = data.user_password;
    this.user_status = data.user_status || 1;
    this.created_at = data.created_at || Date.now();
    this.user_role = data.user_role || 0;
  }

  async signup() {
    try {
      const createUserQuery =
        "INSERT INTO users (user_id, user_name, user_email, user_password) VALUES (?, ?, ?, ?);";
      const result = await pool.execute(createUserQuery, [
        this.user_id,
        this.user_name,
        this.user_email,
        this.user_password,
      ]);
      return result[0].affectedRows === 1; // Kiểm tra kết quả và trả về boolean
    } catch (error) {
      console.error("Database error:", error); // Ghi log lỗi để dễ debug
      return false;
    }
  }

  // tìm người dùng
  static async login(user_email, user_password) {
    console.log("vào");
    
    try {
      const findUserQuery =
        "SELECT * FROM users WHERE user_email = ? and user_password = ?;";
      const [rows] = await pool.execute(findUserQuery, [user_email, user_password]);
      return rows.length > 0 ? rows[0] : null; // Trả về thông tin người dùng nếu tìm thấy
    } catch (error) {
      console.error("Database error:", error);
      return null;
    }
  }

  // tìm người dùng theo id
  static async findUserById(id_user) {
    try {
      const findUserQuery =
        "SELECT * FROM users WHERE user_id = ?";
      const [rows] = await pool.execute(findUserQuery, [id_user]);
      return rows.length > 0 ? rows[0] : null; 
    } catch (error) {
      console.error("Database error:", error);
      return null;
    }
  }


  // check email address
  static async checkEmailExists(email) {
    try {
      const checkEmailQuery =
        "SELECT COUNT(*) as count FROM users WHERE user_email = ?;";
      const [rows] = await pool.execute(checkEmailQuery, [email]);
      return rows[0].count > 0;
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  }
}

export { Users };
