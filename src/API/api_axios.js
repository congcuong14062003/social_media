import axios from "axios";
import getToken from "../ultils/getToken/get_token";
// Tạo một instance của Axios
const api = axios.create({
  baseURL: "https://api.sampleapis.com/coffee", // Thay thế bằng URL của bạn
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Timeout sau 10 giây
});

// Thêm Interceptor để tự động thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý lỗi response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Xử lý lỗi HTTP (401, 403, 500, ...)
      console.error("Lỗi từ server:", error.response.data);
      if (error.response.status === 401) {
        console.warn("Token hết hạn, vui lòng đăng nhập lại!");
      }
    } else {
      console.error("Lỗi kết nối hoặc server không phản hồi!");
    }
    return Promise.reject(error);
  }
);

export default api;
