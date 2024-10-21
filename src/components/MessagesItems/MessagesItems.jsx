import { FaFileDownload } from 'react-icons/fa';
import AvatarUser from '../AvatarUser/AvatarUser';
import Waveform from '../WaveSurfer/wave_surfer';
import { ImReply } from 'react-icons/im';
import './MessagesItems.scss';
import { useState } from 'react';

function MessagesItems({
    className,
    message,
    type,
    nameFile,
    setShowReply,
    setContentReply,
    sender_id,
    reply_text,
    inputRef,
    reply_type,
}) {
    const classes = `receiver_user_container ${className}`;
    const [hoverItem, setHoverItem] = useState(false);

    return (
        message && (
            <div onMouseEnter={() => setHoverItem(true)} onMouseLeave={() => setHoverItem(false)} className={classes}>
                {reply_text && (
                    <p className="message_reply">
                        <span>
                            {reply_type === 'image' && <img src={reply_text} alt="content" />}
                            {reply_type === 'text' && reply_text}
                            {reply_type === 'audio' && <Waveform audioUrl={reply_text} />}
                            {reply_type === 'link' && <p dangerouslySetInnerHTML={{ __html: reply_text }}></p>}
                            {reply_type === 'other' && (
                                <div className="file-container">
                                    <a href={reply_text} download>
                                        File đính kèm
                                    </a>
                                </div>
                            )}
                            {reply_type === 'video' && (
                                <a download href={reply_text}>
                                    <video controls src={reply_text} alt="content" />
                                </a>
                            )}
                        </span>
                    </p>
                )}
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
                            <video controls src={message} alt="content" />
                        </a>
                    )}
                    {type === 'link' && <p dangerouslySetInnerHTML={{ __html: message }}></p>}
                    {type === 'call:accepted' && (
                        <div className="content_receiver">
                            <span>Cuộc gọi thoại: {message} giây</span>
                        </div>
                    )}
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
                                    reply_type: '',
                                };

                                // Thiết lập nội dung cho replyContent
                                switch (type) {
                                    case 'text':
                                        replyContent.content = message;
                                        replyContent.reply_type = 'text';
                                        break;
                                    case 'audio':
                                        replyContent.title = 'Tin nhắn thoại';
                                        replyContent.content = message;
                                        replyContent.reply_type = 'audio';

                                        break;
                                    case 'image':
                                        replyContent.content = message;
                                        replyContent.reply_type = 'image';
                                        // replyContent.src = message;
                                        break;
                                    case 'video':
                                        replyContent.title = 'Video';
                                        replyContent.content = message;
                                        replyContent.reply_type = 'video';

                                        break;
                                    case 'link':
                                        replyContent.reply_type = 'link';
                                        // replyContent.content = (
                                        //     <span
                                        //         dangerouslySetInnerHTML={{
                                        //             __html: message,
                                        //         }}
                                        //     ></span>
                                        // );
                                        replyContent.content = message;
                                        break;
                                    case 'other':
                                        replyContent.name = nameFile;
                                        replyContent.content = message;
                                        replyContent.reply_type = 'other';
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
