import React, { useState, useEffect, createContext, useContext } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { getData, postData } from '../ultils/fetchAPI/fetch_API';
import { FaPhoneAlt, FaPhoneSlash } from 'react-icons/fa';
import { OwnDataContext } from './own_data';
import { toast } from 'react-toastify';
import { API_CREATE_NOTIFICATION, API_GET_INFO_USER_PROFILE_BY_ID } from '../API/api_server';
import config from '../configs';

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
    const addNotification = async (user_create_notice, post_owner_id, post_id, message, created_at, type) => {
        try {
            const response = await postData(API_CREATE_NOTIFICATION, {
                user_create_notice,
                user_id: post_owner_id,
                content: message,
                target_id: `${config.routes.post}/${post_id}`,
                created_at,
                type: type, // Bạn có thể thêm các loại thông báo nếu cần
            });
            if (response?.status) {
                console.log('Thông báo đã được thêm thành công');
            }
        } catch (error) {
            console.error('Lỗi khi thêm thông báo:', error);
        }
    };
    useEffect(() => {
        if (socket && dataOwner) {
            socket.emit('registerUser', { user_id: dataOwner?.user_id });

            // Lắng nghe sự kiện thông báo bình luận
            socket.on('newCommentNotification', async (data) => {
                const { user_create_notice, post_owner_id, post_id, message, created_at } = data;
                console.log('data: ', data);
                // Kiểm tra xem người dùng hiện tại có phải là người đăng bài không
                if (dataOwner?.user_id === post_owner_id) {
                    // Hiển thị thông báo
                    toast.info(message, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        icon: false,
                    });
                    // Gọi API thêm thông báo
                    await addNotification(user_create_notice, post_owner_id, post_id, message, created_at,"comment");
                }
            });
            socket.on('newSubCommentNotification', async (data) => {
                const { user_create_notice, post_owner_id, post_id, message, created_at } = data;
                console.log('data: ', data);
                if (dataOwner?.user_id === post_owner_id) {
                    // Kiểm tra xem người dùng hiện tại có phải là người đăng bài không
                    // Hiển thị thông báo
                    toast.info(message, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        icon: false,
                    });
                    // Gọi API thêm thông báo
                    await addNotification(user_create_notice, post_owner_id, post_id, message, created_at,"subcomment");
                }
            });
            // lắng nghe sự kiện đăng bài

            socket.on('newPostNotification', async (data) => {
                console.log('data: ', data);
                const {user_create_post, friend_id, post_id, message, created_at } = data
                if (dataOwner?.user_id !== data.user_create_post) {
                    toast.info(message, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        icon: false,
                    });
                    // Gọi API thêm thông báo
                    await addNotification(user_create_post , friend_id,  post_id, message, created_at, "createPost");
                }
               
            });
            // Nhận cuộc gọi
            socket.on('user-calling', async (data) => {
                if (data && dataOwner && data?.receiver_id === dataOwner?.user_id) {
                    const callerInfo = await getInfoCaller(data?.sender_id);
                    if (callerInfo) {
                        toast.info(
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
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                backgroundColor: '#4CAF50',
                                                color: 'white',
                                                padding: '6px 10px',
                                                fontSize: '12px',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.3s ease',
                                            }}
                                            onClick={() => {
                                                handleAccept(data);
                                                closeToast();
                                            }}
                                            onMouseOver={(e) => (e.target.style.backgroundColor = '#45A049')}
                                            onMouseOut={(e) => (e.target.style.backgroundColor = '#4CAF50')}
                                        >
                                            <FaPhoneAlt style={{ marginRight: '5px' }} />
                                            Nghe
                                        </button>
                                        <button
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                backgroundColor: '#F44336',
                                                color: 'white',
                                                padding: '6px 10px',
                                                fontSize: '12px',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.3s ease',
                                            }}
                                            onClick={() => {
                                                handleDecline(data);
                                                closeToast();
                                            }}
                                            onMouseOver={(e) => (e.target.style.backgroundColor = '#E53935')}
                                            onMouseOut={(e) => (e.target.style.backgroundColor = '#F44336')}
                                        >
                                            <FaPhoneSlash style={{ marginRight: '5px' }} />
                                            Từ chối
                                        </button>
                                    </div>
                                </div>
                            ),
                            {
                                position: 'top-right',
                                autoClose: 5000,
                                closeOnClick: true,
                                pauseOnHover: false,
                                hideProgressBar: false,
                                icon: false,
                            },
                        );
                    }
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('newCommentNotification'); // Cleanup listener khi socket thay đổi hoặc component unmount
                socket.off('newSubCommentNotification'); // Cleanup listener khi socket thay đổi hoặc component unmount
                socket.off('newPostNotification'); // Cleanup listener khi socket thay đổi hoặc component unmount
                socket.off('user-calling'); // Dọn dẹp khi component unmount
            }
        };
    }, [dataOwner, socket]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    return useContext(SocketContext);
};
