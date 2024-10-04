import React, { useState, useEffect, createContext, useContext } from 'react';
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import { getData } from "../ultils/fetchAPI/fetch_API";
import { FaPhoneAlt, FaPhoneSlash } from "react-icons/fa";
import { OwnDataContext } from './own_data';
import { toast } from 'react-toastify';
import { API_GET_INFO_USER_PROFILE_BY_ID } from '../API/api_server';
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const dataOwner = useContext(OwnDataContext);
  const navigate = useNavigate();
  useEffect(() => {
    const newSocket = io('http://localhost:8900', { transports: ['websocket'] });
    setSocket(newSocket);
  }, []);


  const handleAccept = (data) => {
    if (socket) {
      socket.emit("acceptCallUser", {
        status: "Accepted",
        ...data,
      });
      navigate(data?.link_call);
    }
  };

  const handleDecline = (data) => {
    toast("Bạn đã từ chối cuộc gọi");
    if (socket) {
      socket.emit("acceptCallUser", {
        status: "Declined",
        ...data,
      });
    }
  };

  const getInfoCaller = async (sender_id) => {
    try {
      const response = await getData(API_GET_INFO_USER_PROFILE_BY_ID(sender_id));
      if (response?.status) {
        return response?.data;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    if (socket && dataOwner) {
      // Nhận thông báo gọi từ người gọi
      socket.on("user-calling", async (data) => {
        if (data && dataOwner && data?.receiver_id === dataOwner?.user_id) {
          const callerInfo = await getInfoCaller(data?.sender_id);
          if (callerInfo) {
            toast.info(
              ({ closeToast }) => (
                <div>
                  <p><b style={{color: "green"}}>{callerInfo.user_name}</b> đang gọi cho bạn!</p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#4CAF50", // Màu xanh cho nút nghe
                        color: "white",
                        padding: "6px 10px",
                        fontSize: "12px", // Làm nhỏ chữ
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                      }}
                      onClick={() => {
                        handleAccept(data);
                        closeToast();
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#45A049")
                      } // Thay đổi màu khi hover
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#4CAF50")
                      }
                    >
                      <FaPhoneAlt style={{ marginRight: "5px" }} />
                      Nghe
                    </button>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#F44336", // Màu đỏ cho nút từ chối
                        color: "white",
                        padding: "6px 10px",
                        fontSize: "12px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                      }}
                      onClick={() => {
                        handleDecline(data);
                        closeToast();
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#E53935")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#F44336")
                      }
                    >
                      <FaPhoneSlash style={{ marginRight: "5px" }} />
                      Từ chối
                    </button>
                  </div>
                </div>
              ),
              {
                position: "top-right",
                autoClose: 60000, // Tự động đóng sau 60 giây
                closeOnClick: true,
                hideProgressBar: false, // Hiển thị thanh tiến trình
                icon: false, // Ẩn icon mặc định của toast
              }
            );
          }
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("user-calling"); // Cleanup listener khi socket thay đổi hoặc component unmount
      }
    };
  }, [dataOwner, socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};