import pool from "../../../configs/database/database.js";

export const signUpAction = async (param) => {
  console.log(param);
  try {
    const query = "INSERT INTO users (email, password) VALUES (?, ?)";
    const [result] = await pool.execute(query, [param.email, param.password]);
    return result;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};
export const loginAction = async (param) => {
  try {
    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
    const [rows] = await pool.execute(query, [param.email, param.password]);
    if (rows.length === 0) {
      return { success: false, message: "Email hoặc mật khẩu không đúng" };
    }
    const user = rows[0];
    return { success: true, message: "Đăng nhập thành công", user };
  } catch (error) {
    console.error(error.message);
    return { success: false, message: "Lỗi server." };
  }
};

export const findUser = async (userId) => {
  try {
    const query = "SELECT * FROM users WHERE id = ?";
    const [rows] = await pool.execute(query, [userId]);
    if (rows.length === 0) {
      return { success: false, message: "Không tồn tài user" };
    }
    const user = rows[0];
    return { success: true, message: "Tồn tại user", user };
  } catch (error) {
    console.error(error.message);
    return { success: false, message: "Lỗi server." };
  }
};

// export const checkPhoneNumber = async (phone_number) => {
//   try {
//     const query = "SELECT * FROM Users WHERE phone_number = ?";
//     const [result] = await pool.execute(query, [phone_number]);

//     if (result.length > 0) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     console.error(error.message);
//     return null;
//   }
// };
