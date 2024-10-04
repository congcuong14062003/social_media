import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AvatarUser from '../AvatarUser/AvatarUser';
import './ChatItem.scss';
import { OwnDataContext } from '../../provider/own_data';

function ChatItem({ avatar, name, lastMessage, time, link, sender_id, isActive }) {
    const dataOwner = useContext(OwnDataContext);

    // Kiểm tra xem sender_id có phải là ID của người dùng hiện tại không
    const isSenderCurrentUser = dataOwner && dataOwner.user_id === sender_id;

    return (
        <Link to={link}>
            <div className={`chat_item_container ${isActive ? 'active' : ''}`}>
                <div className="avatar_chat">
                    <AvatarUser src={avatar} alt={name} /> {/* Hiển thị avatar */}
                </div>
                <div className="content_chat">
                    <div className="title_chat">{name}</div> {/* Hiển thị tên bạn bè */}
                    <div className="time_chat">
                        {isSenderCurrentUser ? 'Bạn: ' : ''}
                        {lastMessage}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ChatItem;
