import React, { useContext, useEffect, useState } from 'react';
import ChatItem from '../../ChatItem/ChatItem';
import Search from '../../Search/Search';
import Popover from '../Popover';
import './PopoverChat.scss';
import { API_GET_CONVERSATIONS } from '../../../API/api_server';
import { postData } from '../../../ultils/fetchAPI/fetch_API';
import { useSocket } from '../../../provider/socket_context';
import AvatarWithText from '../../../skeleton/avatarwithtext';
import { OwnDataContext } from '../../../provider/own_data';

function PopoverChat({ privateKey, currentChatId, handleClosePopover, setReceiverId }) {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const socket = useSocket();
    const dataOwner = useContext(OwnDataContext);

    // Lấy danh sách cuộc hội thoại ban đầu
    const fetchConversations = async () => {
        try {
            const response = await postData(API_GET_CONVERSATIONS, {
                private_key: privateKey,
            });
            if (response.status === true) {
                setConversations(response.data);
                setLoading(true);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    // Lắng nghe sự kiện nhận tin nhắn mới
    useEffect(() => {
        if (socket) {
            socket.on('receiveMessage', (data) => {
                console.log('Nhận tin nhắn mới:', data);

                setConversations((prevConversations) => {
                    const updatedConversations = prevConversations.map((conversation) => {
                        // Kiểm tra nếu cuộc trò chuyện có sẵn và cập nhật thông tin
                        if (conversation.friend_id === data.sender_id || conversation.friend_id === data.receiver_id) {
                            // Kiểm tra người gửi có phải là người dùng hiện tại không
                            return {
                                ...conversation,
                                sender_id: data.sender_id,
                                last_message: data.content_text, // Nếu là người nhận thì chỉ hiển thị nội dung tin nhắn
                                last_message_time: data.created_at,
                                content_type: data.content_type,
                                name_file: data.name_file,
                            };
                        }
                        return conversation;
                    });

                    // Kiểm tra nếu cuộc trò chuyện chưa có trong danh sách, chỉ thêm nếu không có
                    const isConversationExist = updatedConversations.some(
                        (conversation) => conversation.sender_id === data.sender_id,
                    );

                    if (!isConversationExist) {
                        const newConversation = {
                            friend_id: data.sender_id,
                            friend_name: data.sender_name, // Tên người gửi
                            friend_avatar: data.sender_avatar, // Avatar người gửi
                            last_message: data.content_text,
                            last_message_time: data.created_at,
                            messenger_id: data.messenger_id,
                            content_type: data.content_type,
                            name_file: data.name_file,
                        };

                        updatedConversations.unshift(newConversation); // Thêm cuộc trò chuyện mới vào đầu danh sách
                    }

                    return updatedConversations;
                });
            });
        }
    }, [socket, dataOwner]); // dataOwner là state lưu thông tin người dùng hiện tại

    console.log('Conversation: ', conversations);

    useEffect(() => {
        fetchConversations();
    }, [privateKey]);

    useEffect(() => {
        if (conversations.length > 0) {
            setReceiverId(conversations[0]?.friend_id);
        }
    }, [conversations]);

    const handleClickItem = (friend_id) => {
        handleClosePopover && handleClosePopover();
    };

    return (
        <Popover title="Đoạn chat">
            {loading ? (
                <>
                    <div className="search_chat_user">
                        <Search iconSearch placeholder="Tìm kiếm trên messenger" />
                    </div>
                    <div className="chat_container">
                        {conversations
                            .filter((conversation) => conversation.last_message !== null) // Only show conversations with a non-null last message
                            .map((conversation, index) => (
                                <ChatItem
                                    key={index}
                                    nameFile={conversation.name_file}
                                    type={conversation.content_type}
                                    onClick={() => handleClickItem(conversation.messenger_id)}
                                    avatar={conversation.friend_avatar}
                                    name={conversation.friend_name}
                                    lastMessage={conversation.last_message}
                                    time={conversation.last_message_time}
                                    link={`/messages/${conversation.friend_id}`}
                                    sender_id={conversation.sender_id}
                                    isActive={currentChatId === conversation.friend_id}
                                />
                            ))}
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
