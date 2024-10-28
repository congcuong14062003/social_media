import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AvatarUser from '../AvatarUser/AvatarUser';
import './ChatItem.scss';
import { OwnDataContext } from '../../provider/own_data';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale'; // Import ngôn ngữ tiếng Việt
import { LuDot } from 'react-icons/lu';
import { timeAgo } from '../../ultils/formatDate/format_date';

function ChatItem({ avatar, name, lastMessage, time, link, sender_id, isActive, onClick, type, nameFile }) {
    const dataOwner = useContext(OwnDataContext);
    // Kiểm tra xem sender_id có phải là ID của người dùng hiện tại không
    const isSenderCurrentUser = dataOwner && dataOwner.user_id === sender_id;
    return (
        <Link to={link}>
            <div onClick={onClick} className={`chat_item_container ${isActive ? 'active' : ''}`}>
                <div className="avatar_chat">
                    <AvatarUser avatar={avatar} alt={name} /> {/* Hiển thị avatar */}
                </div>
                <div className="content_chat">
                    <div className="title_chat">{name}</div> {/* Hiển thị tên bạn bè */}
                    <div className="time_chat">
                        <div className="content_text">
                            {isSenderCurrentUser ? 'Bạn: ' : ''}
                            {type === 'text' && lastMessage}
                            {type === 'link' && (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: lastMessage,
                                    }}
                                ></span>
                            )}
                            {type === 'other' ? 'đã gửi file đính kèm' : ''}
                            {type === 'image' ? 'đã gửi một ảnh' : ''}
                            {type === 'audio' ? 'đã gửi một tin nhắn thoại' : ''}
                            {type === 'video' ? 'đã gửi một video' : ''}
                            {type === 'call:accepted' ? 'Cuộc gọi đã kết thúc' : ''}
                            {type === 'call:missed' ? `Cuộc gọi đã bị bỏ lỡ` : ''}
                        </div>
                        {/* Hiển thị thời gian đã format */}
                        <div className="time">
                            <LuDot />
                            {timeAgo(time)}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ChatItem;
