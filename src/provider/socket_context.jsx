import React, { useState, useEffect, createContext, useContext } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { getData, postData } from '../ultils/fetchAPI/fetch_API';
import { FaPhoneAlt, FaPhoneSlash } from 'react-icons/fa';
import { OwnDataContext } from './own_data';
import { toast } from 'react-toastify';
import { API_CREATE_NOTIFICATION, API_GET_INFO_USER_PROFILE_BY_ID } from '../API/api_server';


const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const dataOwner = useContext(OwnDataContext);
    const navigate = useNavigate();
    const [toastId, setToastId] = useState(null);  // Lưu ID của toast để đóng sau
    useEffect(() => {
        const newSocket = io('http://localhost:8900', { transports: ['websocket'] });
        setSocket(newSocket);
    }, []);

    const handleAccept = (data) => {
        if (socket) {
            socket.emit('acceptCallUser', {
                status: 'Accepted',
                ...data,
            });
            navigate(data?.link_call);
        }
    };

    const handleDecline = (data) => {
        toast('Bạn đã từ chối cuộc gọi');
        if (socket) {
            socket.emit('acceptCallUser', {
                status: 'Declined',
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
    // const addNotification = async (sender_id, receiver_id, content, link_notice, created_at) => {
    //     try {
    //         const response = await postData(API_CREATE_NOTIFICATION, {
    //             sender_id,
    //             receiver_id,
    //             content,
    //             link_notice,
    //             created_at,
    //         });
    //         if (response?.status) {
    //             console.log('Thông báo đã được thêm thành công');
    //         }
    //     } catch (error) {
    //         console.error('Lỗi khi thêm thông báo:', error);
    //     }
    // };
    useEffect(() => {
        if (socket && dataOwner) {
            socket.emit('registerUser', { user_id: dataOwner?.user_id });
            socket.on('receiver_notify', async (data) => {
                const { sender_id, receiver_id, content, link_notice, created_at } = data;
                if (dataOwner?.user_id !== data?.sender_id) {
                    toast.info(content, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        icon: false,
                    });
                    // Gọi API thêm thông báo
                    // await addNotification(sender_id, receiver_id, content, link_notice, created_at);
                }
            });
            // Nhận cuộc gọi
            
            // Lắng nghe sự kiện gọi cuộc gọi
            socket.on('user-calling', async (data) => {
                if (data && dataOwner && data?.receiver_id === dataOwner?.user_id) {
                    const callerInfo = await getInfoCaller(data?.sender_id);
                    if (callerInfo) {
                        const toastId = toast.info(
                            ({ closeToast }) => (
                                <div>
                                    <p>
                                        <b style={{ color: 'green' }}>{callerInfo.user_name}</b> đang gọi cho bạn!
                                    </p>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            gap: '10px',
                                            marginTop: '10px',
                                        }}
                                    >
                                        <button
                                            onClick={() => {
                                                handleAccept(data);
                                                closeToast(); // Đóng toast khi nghe cuộc gọi
                                            }}
                                        >
                                            <FaPhoneAlt /> Nghe
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDecline(data);
                                                closeToast(); // Đóng toast khi từ chối cuộc gọi
                                            }}
                                        >
                                            <FaPhoneSlash /> Từ chối
                                        </button>
                                    </div>
                                </div>
                            ),
                            {
                                position: 'top-right',
                                autoClose: 15000,
                                closeOnClick: true,
                                pauseOnHover: false,
                                hideProgressBar: false,
                                icon: false,
                            },
                        );
                        setToastId(toastId);  // Lưu toastId
                    }
                }
            });

            // Lắng nghe khi có cuộc gọi đã được chấp nhận hoặc từ chối để tắt toast trên các thiết bị còn lại
            socket.on('statusAcceptedCallUser', (data) => {
                if (toastId) {
                    toast.dismiss(toastId);  // Tắt toast khi có trạng thái cuộc gọi
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('receiver_notify'); 
                socket.off('user-calling');
            }
        };
    }, [dataOwner, socket]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    return useContext(SocketContext);
};
