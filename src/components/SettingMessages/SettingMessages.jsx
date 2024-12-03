import { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { BlockIcon, SearchIcon, SendFileIcon, UserIcon } from '../../assets/icons/icons';
import AvatarUser from '../AvatarUser/AvatarUser';
import PrimaryIcon from '../PrimaryIcon/PrimaryIcon';
import './SettingMessages.scss';
import ToolTip from '../ToolTip/ToolTip';
import config from '../../configs';
import { deleteData } from '../../ultils/fetchAPI/fetch_API';
import { toast } from 'react-toastify';
import Search from '../Search/Search';
import { API_DELETE_ALL_MESSAGE } from '../../API/api_server';
import { Cancel } from '@mui/icons-material';
import CloseBtn from '../CloseBtn/CloseBtn';

function SettingMessages({ dataFriend, messages, onsetOpenSettingChat }) {
    const [openFile, setOpenFile] = useState(false);
    const [openFileOther, setOpenFileOther] = useState(false);
    const [openFormSearch, setOpenFormSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpenFile = () => {
        setOpenFileOther(false);
        setOpenFile((prev) => !prev);
    };

    const handleOpenFileOther = () => {
        setOpenFile(false);
        setOpenFileOther((prev) => !prev);
    };

    const handleDeleteAllMessage = async () => {
        try {
            const response = await deleteData(API_DELETE_ALL_MESSAGE(dataFriend?.user_id));
            if (response.status) {
                toast.success('Xóa đoạn chat thành công!');
                window.location.href = '/messages/' + dataFriend?.user_id;
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleFindMessage = () => {
        setOpenFormSearch((prev) => !prev);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredMessages = messages.filter((message) =>
        message.content_text?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const highlightText = (text) => {
        if (!searchQuery) return text;
        const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === searchQuery.toLowerCase() ? (
                <span key={index} style={{ backgroundColor: 'yellow' }}>
                    {part}
                </span>
            ) : (
                part
            ),
        );
    };
    const scrollToMessage = (messageId) => {
        const messageElement = document.querySelector(`.messenger-id-${messageId}`);

        if (messageElement) {
            // Lưu lại màu nền ban đầu
            const originalColor = messageElement.style.backgroundColor;
            const highlightColor = '#cbd400c2'; // Màu nhấn mạnh
            let isOriginalColor = false;

            // Cuộn đến phần tử
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Đặt interval để nhấp nháy
            const intervalId = setInterval(() => {
                messageElement.style.backgroundColor = isOriginalColor ? originalColor : highlightColor;
                isOriginalColor = !isOriginalColor;
            }, 250); // Mỗi lần nhấp nháy diễn ra sau 300ms

            // Sau 3 giây dừng nhấp nháy và quay lại màu cũ
            setTimeout(() => {
                clearInterval(intervalId);
                messageElement.style.backgroundColor = originalColor;
            }, 1500); // 3000ms = 3s
        }
    };
    console.log(messages);

    return (
        <div className="setting_message_container">
            <div className="close_setting_message">
                <CloseBtn onClick={() => onsetOpenSettingChat()} />
            </div>
            <div className="receiver_infor">
                <div className="avatar_receiver">
                    <AvatarUser avatar={dataFriend.avatar || dataFriend.avatar_link} />
                </div>
                <div className="name_receiver">{dataFriend?.user_name}</div>
                <div className="action_sender">
                    <Link>
                        <div className="profile_receiver">
                            <ToolTip title="Trang cá nhân">
                                <Link to={`${config.routes.profile}/${dataFriend?.user_id}`}>
                                    <PrimaryIcon icon={<UserIcon />} />
                                </Link>
                            </ToolTip>
                        </div>
                    </Link>
                    <div className="search_messages">
                        <ToolTip title="Tìm kiếm" onClick={handleFindMessage}>
                            <PrimaryIcon icon={<SearchIcon />} />
                        </ToolTip>
                    </div>
                </div>
            </div>

            {!openFormSearch && (
                <div className="list_action">
                    <div className="item_action">
                        <BlockIcon />
                        <span>Chặn</span>
                    </div>
                    <div className="item_action" onClick={handleDeleteAllMessage}>
                        <MdDelete />
                        <span>Xoá đoạn chat</span>
                    </div>
                    <div className="item_action" onClick={handleOpenFile}>
                        <SendFileIcon />
                        <span>File phương tiện</span>
                    </div>
                    <div className="item_action" onClick={handleOpenFileOther}>
                        <SendFileIcon />
                        <span>File</span>
                    </div>
                    {openFile && (
                        <div className="media_container_chat">
                            {messages
                                .filter(
                                    (message) => message.content_type === 'image' || message.content_type === 'video',
                                )
                                .map((message, index) => (
                                    <Link
                                        key={index}
                                        to={message.content_text}
                                        className={`media_item ${message.content_type}`}
                                    >
                                        {message.content_type === 'image' && (
                                            <img src={message.content_text} alt={`image-${index}`} />
                                        )}
                                        {message.content_type === 'video' && (
                                            <video src={message.content_text} controls />
                                        )}
                                    </Link>
                                ))}
                        </div>
                    )}
                    {openFileOther && (
                        <div className="media_container_chat_file">
                            {messages
                                .filter((message) => message.content_type === 'other')
                                .map((message, index) => (
                                    <div key={index} className="media_item_other">
                                        <div className="file-container">
                                            <a href={message.content_text} download>
                                                {message.name_file}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            )}

            {openFormSearch && (
                <>
                    <div className="search_container_chat">
                        <Search
                            placeholder="Tìm kiếm trong cuôc trò chuyện"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            iconSearch
                        />
                    </div>
                    {searchQuery && (
                        <div className="message_list">
                            {filteredMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`message-item ${message.content_type}`}
                                    onClick={() => scrollToMessage(message?.messenger_id)}
                                >
                                    {message.content_type === 'text' && (
                                        <div>{highlightText(message.content_text)}</div>
                                    )}
                                    {message.content_type === 'link' && (
                                        <p
                                            className="link_mesages"
                                            dangerouslySetInnerHTML={{ __html: message.content_text }}
                                        ></p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default SettingMessages;
