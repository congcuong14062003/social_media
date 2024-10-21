import { Link } from 'react-router-dom';
import { BlockIcon, SearchIcon, SendFileIcon, UserIcon } from '../../assets/icons/icons';
import AvatarUser from '../AvatarUser/AvatarUser';
import PrimaryIcon from '../PrimaryIcon/PrimaryIcon';
import './SettingMessages.scss';
import { Search } from '@mui/icons-material';
import ToolTip from '../ToolTip/ToolTip';
import config from '../../configs';
import { useState } from 'react';

function SettingMessages({ dataFriend, messages }) {
    const [openFile, setOpenFile] = useState(false);
    const [openFileOther, setOpenFileOther] = useState(false);
    const handleOpenFile = () => {
        setOpenFileOther(false)
        setOpenFile((pre) => {
            return !pre;
        });
    };
    const handleOpenFileOther = () => {
        setOpenFile(false)
        setOpenFileOther((pre) => {
            return !pre;
        });
    };
    return (
        <div className="setting_message_container">
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
                        <ToolTip title="Tìm kiếm">
                            <PrimaryIcon icon={<SearchIcon />} />
                        </ToolTip>
                    </div>
                </div>
            </div>
            <div className="list_action">
                <div className="item_action">
                    <BlockIcon />
                    <span>Chặn</span>
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
                        {messages.map((message, index) => {
                            // Chỉ hiển thị nếu content_type là image hoặc video
                            if (message.content_type !== 'image' && message.content_type !== 'video') {
                                return null;
                            }

                            return (
                                <Link
                                    key={index}
                                    to={message.content_text}
                                    className={`media_item ${message.content_type}`}
                                >
                                    {message.content_type === 'image' && (
                                        <img src={message.content_text} alt={`image-${index}`} />
                                    )}
                                    {message.content_type === 'video' && <video src={message.content_text} controls />}
                                </Link>
                            );
                        })}
                    </div>
                )}
                {openFileOther && (
                    <div className="media_container_chat_file">
                        {messages.map((message, index) => {
                            // Chỉ hiển thị nếu content_type là image hoặc video
                            if (message.content_type !== 'other') {
                                return null;
                            }

                            return (
                                <div
                                    key={index}
                                    className={`media_item_other`}
                                >
                                    {message.content_type === 'other' && (
                                         <div className="file-container">
                                         <a href={message.content_text} download>
                                             {message.name_file}
                                         </a>
                                     </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SettingMessages;
