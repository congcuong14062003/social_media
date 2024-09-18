import React, { useContext, useEffect, useState } from 'react';
import {
    ExtendChatIcon,
    LikeMessageIcon,
    PhoneIcon,
    SendFileIcon,
    SendMessageIcon,
    VideoCallIcon,
} from '../../assets/icons/icons';
import FriendItem from '../../components/Friend/FriendItem/FriendItem';
import PopoverChat from '../../components/Popover/PopoverChat/PopoverChat';
import Search from '../../components/Search/Search';
import './Messages.scss';
import AvatarUser from '../../components/AvatarUser/AvatarUser';
import MessagesItems from '../../components/MessagesItems/MessagesItems';
import SettingMessages from '../../components/SettingMessages/SettingMessages';
import ToolTip from '../../components/ToolTip/ToolTip';
import { useParams } from 'react-router-dom';
import { API_GET_INFO_USER_PROFILE_BY_ID } from '../../API/api_server';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { io } from 'socket.io-client'; // Import Socket.IO client
import { OwnDataContext } from '../../provider/own_data';

function MessagesPage() {
    const [message, setMessage] = useState(''); // Tin nhắn hiện tại
    const [messages, setMessages] = useState([]); // Danh sách các tin nhắn
    const [openSettingChat, setOpenSettingChat] = useState(false);
    const { id_user } = useParams();
    const [dataFriend, setDataFriend] = useState();
    const [socket, setSocket] = useState(null); // Socket instance
    const dataUser = useContext(OwnDataContext);

    useEffect(() => {
        console.log("Current User Data:", dataUser); // In ra để kiểm tra xem dataUser có undefined không
    }, [dataUser]);
    
    // Xử lý khi thay đổi tin nhắn
    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    // Kết nối với Socket.IO khi component mount
    useEffect(() => {
        const newSocket = io('http://localhost:8900'); // Kết nối tới server Socket.IO
        setSocket(newSocket);

        return () => newSocket.disconnect(); // Ngắt kết nối khi component unmount
    }, []);

    // Gửi thông tin user đến server khi socket kết nối
    useEffect(() => {
        if (socket) {
            socket.emit('addUser', id_user); // Gửi id_user tới server
        }
    }, [socket, id_user]);

    // Nhận tin nhắn từ server
    useEffect(() => {
        if (socket && dataUser?.user_id) {
            socket.on('getMessage', (data) => {

                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        senderId: data?.senderId,
                        text: data.text,
                        isSender: data.senderId == dataUser?.user_id, // Xác định người gửi
                    },
                ]);
            });
        }
    }, [socket, id_user, dataUser]);
    // Gửi tin nhắn khi click vào icon gửi tin nhắn
    const handleSendMessage = () => {
        if (socket && message.trim()) {
            const receiverId = id_user; // Lấy id người nhận từ thông tin friend
            socket.emit('sendMessage', {
                senderId: dataUser?.user_id,
                receiverId,
                text: message,
            });
            setMessage(''); // Reset input
        }
    };

    // Lấy thông tin bạn bè từ API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getData(API_GET_INFO_USER_PROFILE_BY_ID(id_user));
                if (response.status === 200) {
                    setDataFriend(response.data);
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        fetchData();
    }, [id_user]);

    return (
        <div className="messenger_container">
            <div className="left_messenger">
                <PopoverChat />
            </div>

            <div className="center_messenger">
                <div className="messages_container">
                    <div className="chat_header">
                        <FriendItem data={dataFriend} />
                        <div className="action_call">
                            <ToolTip title="Bắt đầu gọi thoại">
                                <div className="action_chat">
                                    <PhoneIcon />
                                </div>
                            </ToolTip>

                            <ToolTip title="Bắt đầu gọi video">
                                <div className="action_chat">
                                    <VideoCallIcon />
                                </div>
                            </ToolTip>
                            <ToolTip
                                onClick={() => setOpenSettingChat(!openSettingChat)}
                                title="Thông tin về cuộc trò chuyện"
                            >
                                <div className="action_chat">
                                    <ExtendChatIcon />
                                </div>
                            </ToolTip>
                        </div>
                    </div>
                    <div className="chat_body">
                        <div className="chat_main_infor">
                            {/* Render danh sách tin nhắn */}
                            {messages.map((msg, index) => {
                                console.log(msg);

                                return (
                                    <MessagesItems
                                        key={index}
                                        message={msg.text}
                                        className={msg.isSender ? 'sender' : ''}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className="chat_footer">
                        <Search placeholder="Nhập tin nhắn" value={message} onChange={handleInputChange} />
                        <div className="send_file_input">
                            <SendFileIcon />
                        </div>
                        <div className={`send_mesage_action ${message ? '' : 'hidden'}`} onClick={handleSendMessage}>
                            <SendMessageIcon />
                        </div>
                        <div className={`like_message_action ${message ? 'hidden' : ''}`}>
                            <LikeMessageIcon />
                        </div>
                    </div>
                </div>
            </div>
            {openSettingChat && (
                <div className="right_messenger">
                    <SettingMessages />
                </div>
            )}
        </div>
    );
}

export default MessagesPage;
