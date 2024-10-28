import { FaFileDownload } from 'react-icons/fa';
import AvatarUser from '../AvatarUser/AvatarUser';
import Waveform from '../WaveSurfer/wave_surfer';
import { ImReply } from 'react-icons/im';
import './MessagesItems.scss';
import { useState } from 'react';
import { MdPhoneCallback, MdPhoneMissed } from 'react-icons/md';
import { formatSecondsToTime } from '../../ultils/formatDate/format_date';
import PrimaryIcon from '../PrimaryIcon/PrimaryIcon';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
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
    handleClickCall,
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
                            {reply_type === 'call:accepted' && <p>{reply_text}</p>}
                            {reply_type === 'call:missed' && <p>{reply_text}</p>}
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
                    {/* {type === 'call:accepted' && (
                        <div className="content_receiver">
                            <span>Cuộc gọi thoại: {message} giây</span>
                        </div>
                    )} */}
                    {type?.includes('call') && (
                        <div className="content_receiver call_content">
                            <div className="call-container">
                                {type?.includes('missed') && (
                                    <>
                                        <div className="missed-container">
                                            <PrimaryIcon className="secondary" icon={<MdPhoneMissed className="missed" />} />
                                            <p>Cuộc gọi nhỡ</p>
                                        </div>
                                    </>
                                )}
                                {type?.includes('accepted') && (
                                    <>
                                        <PrimaryIcon icon={<MdPhoneCallback className="accepted" />} />
                                        <div className="infor_call">
                                            <p>Cuộc gọi thoại</p>
                                            <b>{formatSecondsToTime(message)}</b>
                                        </div>
                                    </>
                                )}
                            </div>
                            <ButtonCustom className="secondary" title="Gọi lại" onClick={handleClickCall} />
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
                                        replyContent.content = message;
                                        break;
                                    case 'call:accepted':
                                        replyContent.reply_type = 'call:accepted';
                                        replyContent.content = 'Cuộc gọi thoại';
                                        break;
                                    case 'call:missed':
                                        replyContent.reply_type = 'call:missed';
                                        replyContent.content = 'Cuộc gọi nhỡ';
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
