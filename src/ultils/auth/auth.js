import { API_LOGIN_USER } from "../../configs/API";
import getToken from "../GetToken/GetToken";

// Hàm để xác thực và trả về dữ liệu
export default function AuthenticationClient() {
  return new Promise((resolve, reject) => {
    // Lấy token từ local storage
    const storedToken = getToken();
  
    // Thiết lập các headers mặc định
    const headers = {
      'Content-Type': 'application/json',
    };
  
    // Nếu có token, thêm Authorization header
    if (storedToken) {
      headers['Authorization'] = `Bearer ${storedToken}`;
    }
  
    // Thực hiện yêu cầu đăng nhập
    fetch(API_LOGIN_USER, {
      method: 'POST',
      headers,
      credentials: 'include',
    })
      .then(response => {
        // Kiểm tra nếu yêu cầu không thành công
        if (!response.ok) {
          console.error(`Request failed with status: ${response.status}`);
          reject('Request failed');
        }
        return response.json();
      })
      .then(data => {
        // Trả về dữ liệu từ response
        resolve(data);
      })
      .catch(error => {
        console.error('Error during authentication:', error);
        reject('Error during authentication');
      });
  });
}
