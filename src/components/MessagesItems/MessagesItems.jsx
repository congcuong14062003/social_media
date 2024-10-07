import { FaFileDownload } from 'react-icons/fa';
import AvatarUser from '../AvatarUser/AvatarUser';
import Waveform from '../WaveSurfer/wave_surfer';
import { ImReply } from 'react-icons/im';
import './MessagesItems.scss';
import { useState } from 'react';

function MessagesItems({ className, message, type, nameFile, setShowReply, setContentReply, sender_id, reply_text, inputRef  }) {
    const classes = `receiver_user_container ${className}`;
    const [hoverItem, setHoverItem] = useState(false);

    return (
        message && (
            <div onMouseEnter={() => setHoverItem(true)} onMouseLeave={() => setHoverItem(false)} className={classes}>
                {reply_text && <p className="message_reply"><span>{reply_text}</span></p>}
                <div className="content_row">
                    {/* Nội dung tin nhắn */}
                    {type === 'text' && (
                        <div className="content_receiver">
                            <span>{message}</span>
                        </div>
                    )}
                    {type === 'audio' && (
                        <div className="content_receiver">
                            <Waveform audioUrl={message} />
                        </div>
                    )}
                    {type === 'image' && (
                        <a download href={message}>
                            <img src={message} alt="content" />
                        </a>
                    )}
                    {type === 'video' && (
                        <a download href={message}>
                            <video controls muted src={message} alt="content" />
                        </a>
                    )}
                    {type === 'link' && <p dangerouslySetInnerHTML={{ __html: message }}></p>}
                    {type === 'other' && (
                        <div className="file-container">
                            <a href={message} download>
                                {nameFile}
                            </a>
                        </div>
                    )}

                    {/* Hiển thị icon reply khi hoveredIndex === key */}
                    {hoverItem && (
                        <div
                            className="reply_icon_message"
                            onClick={() => {

                                setShowReply(true);

                                // Tạo đối tượng replyMessage với nội dung và senderId
                                let replyContent = {
                                    content: '',
                                    senderId: sender_id,
                                };

                                // Thiết lập nội dung cho replyContent
                                switch (type) {
                                    case 'text':
                                        replyContent.content = message;
                                        break;
                                    case 'audio':
                                        replyContent.content = 'Tin nhắn âm thanh';
                                        break;
                                    case 'image':
                                        replyContent.content = 'Hình ảnh';
                                        break;
                                    case 'video':
                                        replyContent.content = 'Video';
                                        break;
                                    case 'link':
                                        replyContent.content = (
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: message,
                                                }}
                                            ></span>
                                        );
                                        break;
                                    case 'other':
                                        replyContent.content = `Tệp tin: ${nameFile}`;
                                        break;
                                    default:
                                        replyContent.content = 'Nội dung không xác định';
                                }

                                // Gọi setContentReply với đối tượng replyContent
                                setContentReply(replyContent);
                                if (inputRef.current) {
                                    inputRef.current.focus();
                                }
                            }}
                        >
                            <ImReply />
                        </div>
                    )}
                </div>
            </div>
        )
    );
}

export default MessagesItems;
