import React, { useEffect, useState } from 'react';
import ChatItem from '../../ChatItem/ChatItem';
import Search from '../../Search/Search';
import Popover from '../Popover';
import './PopoverChat.scss';
import { API_GET_CONVERSATIONS, API_UPDATE_IS_READ } from '../../../API/api_server';
import { postData } from '../../../ultils/fetchAPI/fetch_API';
import { useSocket } from '../../../provider/socket_context';
import AvatarWithText from '../../../skeleton/avatarwithtext';

function PopoverChat({ privateKey, currentChatId, handleClosePopover, setReceiverId }) {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const socket = useSocket();
    useEffect(() => {
        if (socket) {
            socket.on('updateMessage', () => {
                fetchConversations();
            });
        }
    }, [socket]);
    useEffect(() => {
        setReceiverId(conversations[0]?.friend_id)
    }, [conversations]);
    const fetchConversations = async () => {
        try {
            const response = await postData(API_GET_CONVERSATIONS, {
                private_key: privateKey,
            });
            if (response.status === true) {
                setConversations(response.data); // Gán dữ liệu từ API vào state
                setLoading(true);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };
    useEffect(() => {
        fetchConversations();
    }, [privateKey]);
    const handleChatClick = async (friend_id) => {
        try {
            // Gọi API cập nhật trạng thái is_read cho tin nhắn mới nhất của cuộc trò chuyện
            await postData(API_UPDATE_IS_READ(friend_id));
        } catch (error) {
            console.error('Error updating is_read status:', error);
        }

        // Đóng popover và chuyển đến cuộc trò chuyện
    };
    const handleClickItem = (friend_id) => {
        // Handle click item chat
        handleClosePopover && handleClosePopover();
        // handleChatClick(friend_id);
    };
    return (
        <Popover title="Đoạn chat">
            {loading ? (
                <>
                    <div className="search_chat_user">
                        <Search iconSearch placeholder="Tìm kiếm trên messenger" />
                    </div>
                    <div className="chat_container">
                        {conversations.map(
                            (conversation, index) =>
                                conversation.last_message !== null && (
                                    <ChatItem
                                        key={index}
                                        nameFile={conversation.name_file}
                                        type={conversation.content_type}
                                        onClick={() => handleClickItem(conversation.messenger_id)}
                                        avatar={conversation.friend_avatar} // Avatar của bạn bè
                                        name={conversation.friend_name} // Tên bạn bè
                                        lastMessage={conversation.last_message} // Tin nhắn cuối
                                        time={conversation.last_message_time} // Thời gian tin nhắn cuối
                                        link={`/messages/${conversation.friend_id}`} // Đường dẫn đến cuộc trò chuyện
                                        sender_id={conversation.sender_id} // ID người gửi
                                        isActive={currentChatId === conversation.friend_id} // Kiểm tra nếu đây là cuộc trò chuyện hiện tại
                                    />
                                ),
                        )}
                    </div>
                </>
            ) : (
                <div className="loading-skeleton">
                    <AvatarWithText />
                </div>
            )}
        </Popover>
    );
}

export default PopoverChat;
