import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { API_GET_INFO_USER_PROFILE_BY_ID, API_GET_MESSAGES } from '../../API/api_server';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { io } from 'socket.io-client'; // Import Socket.IO client
import { OwnDataContext } from '../../provider/own_data';
import { useSocket } from '../../provider/socket_context';

function MessagesPage() {
    const [message, setMessage] = useState(''); // Tin nhắn hiện tại
    const [messages, setMessages] = useState([]); // Danh sách các tin nhắn
    const [openSettingChat, setOpenSettingChat] = useState(false);
    const { id_user } = useParams();
    const [dataFriend, setDataFriend] = useState();
    const socket = useSocket();
    const dataUser = useContext(OwnDataContext);

    // Ref để cuộn đến tin nhắn mới nhất
    const messagesEndRef = useRef(null);

    // Hàm cuộn đến tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Cuộn đến tin nhắn mới nhất mỗi khi danh sách tin nhắn thay đổi
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Lấy tin nhắn
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getData(API_GET_MESSAGES(id_user));
                if (response.status === 200) {
                    setMessages(response.data);
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        fetchData();
    }, [id_user]);

    // Xử lý khi thay đổi tin nhắn
    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    // Gửi thông tin user đến server khi socket kết nối
    useEffect(() => {
        if (socket && dataUser?.user_id) {
            socket.emit('addUser', dataUser?.user_id); // Gửi id_user tới server
        }
    }, [socket, dataUser]);

    // Đăng ký sự kiện nhận tin nhắn
    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                console.log('Connected to the server', socket.id);
            });
            socket.on('getMessage', (data) => {
                console.log('Received message:', data);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        senderId: data.senderId,
                        text: data.text,
                        isSender: data.senderId === dataUser?.user_id,
                    },
                ]);
            });

            return () => {
                socket.off('getMessage'); // Ngừng lắng nghe sự kiện khi component unmount
            };
        }
    }, [socket, dataUser]);

    // Gửi tin nhắn khi click vào icon gửi tin nhắn
    const handleSendMessage = () => {
        if (socket && message.trim()) {
            const receiverId = id_user; // Lấy id người nhận từ thông tin friend
            socket.emit('sendMessage', {
                senderId: dataUser?.user_id,
                receiverId,
                text: message,
            });
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    senderId: dataUser && dataUser?.user_id,
                    text: message,
                    isSender: true,
                },
            ]);
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
                                return (
                                    <MessagesItems
                                        key={index}
                                        message={msg.content_text ?? msg.text}
                                        className={
                                            msg.sender_id === dataUser?.user_id || msg.senderId === dataUser?.user_id
                                                ? 'sender'
                                                : ''
                                        }
                                    />
                                );
                            })}
                            <div ref={messagesEndRef}></div> {/* Thêm ref tại đây */}
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
