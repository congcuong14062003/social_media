import React, { useState } from 'react';
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
function MessagesPage() {
    const [message, setMessage] = useState('');
    const [openSettingChat, setOpenSettingChat] = useState(false);
    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    
    return (
        <div className="messenger_container">
            <div className="left_messenger">
                <PopoverChat />
            </div>

            <div className="center_messenger">
                <div className="messages_container">
                    <div className="chat_header">
                        <FriendItem />
                        <div className="action_call">
                            {/* <PhoneIcon /> */}
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
                            <ToolTip onClick={()=> setOpenSettingChat(!openSettingChat)} title="Thông tin về cuộc trò chuyện">
                                <div className="action_chat">
                                    <ExtendChatIcon />
                                </div>
                            </ToolTip>
                        </div>
                    </div>
                    <div className="chat_body">
                        <div className="chat_main_infor">
                            <MessagesItems message="xin chào bạn nhé" />
                            <MessagesItems message="Chào bạn" className="sender" />
                            <MessagesItems message="Chào bạn" className="sender" />
                            <MessagesItems message="Chào bạn" className="sender" />
                            <MessagesItems message="Chào bạn" className="sender" />
                            <MessagesItems message="Chào bạn" className="sender" />
                            <MessagesItems message="Chào bạn" className="sender" />
                            <MessagesItems message="Chào bạn" className="sender" />
                            <MessagesItems message="Chào bạn" className="sender" />
                            <MessagesItems message="Chào bạn" className="sender" />
                            <MessagesItems message="Chào bạn" className="sender" />

                            <MessagesItems message="hi" />
                        </div>
                    </div>
                    <div className="chat_footer">
                        <Search placeholder="Nhập tin nhắn" value={message} onChange={handleInputChange} />
                        <div className="send_file_input">
                            <SendFileIcon />
                        </div>
                        <div className={`send_mesage_action ${message ? '' : 'hidden'}`}>
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
