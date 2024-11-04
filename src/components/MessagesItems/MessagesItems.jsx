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
    setIDReply,
    messenger_id,
    sender_id,
    reply_id,
    inputRef,
    handleClickCall,
}) {
    const classes = `receiver_user_container ${className}`;
    const [hoverItem, setHoverItem] = useState(false);
    console.log(messenger_id);
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
    return (
        message && (
            <div onMouseEnter={() => setHoverItem(true)} onMouseLeave={() => setHoverItem(false)} className={classes}>
                {reply_id && (
                    <div className="message_reply" onClick={()=>scrollToMessage(reply_id)}>
                        <span>
                            {
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: document.querySelector(`.messenger-id-${reply_id}`)?.outerHTML ?? null,
                                    }}
                                />
                            }
                        </span>
                    </div>
                )}

                <div className={`content_row`}>
                    <div className={`messageses messenger-id-${messenger_id}`}>
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
                            // <a download href={message}>
                                <img src={message} alt="content" />
                            // </a>
                        )}
                        {type === 'video' && (
                            <a download href={message}>
                                <video controls src={message} alt="content" />
                            </a>
                        )}
                        {type === 'link' && <p dangerouslySetInnerHTML={{ __html: message }}></p>}
                        {type?.includes('call') && (
                            <div className="content_receiver call_content">
                                <div className="call-container">
                                    {type?.includes('missed') && (
                                        <>
                                            <div className="missed-container">
                                                <PrimaryIcon
                                                    className="secondary"
                                                    icon={<MdPhoneMissed className="missed" />}
                                                />
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
                    </div>

                    {hoverItem && (
                        <div
                            className="reply_icon_message"
                            onClick={() => {
                                setShowReply(true);
                                setIDReply(messenger_id);
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
