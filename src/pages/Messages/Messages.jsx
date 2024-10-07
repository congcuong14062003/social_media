import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    AudioIcon,
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
import MessagesItems from '../../components/MessagesItems/MessagesItems';
import SettingMessages from '../../components/SettingMessages/SettingMessages';
import ToolTip from '../../components/ToolTip/ToolTip';
import { ImReply } from 'react-icons/im';
import { IoMdCloseCircle } from 'react-icons/io';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    API_CHECK_EXIST_KEY_PAIR,
    API_CHECK_IF_FRIEND,
    API_CHECK_KEY_FRIEND,
    API_DELETE_KEY_PAIR,
    API_GET_INFO_USER_PROFILE_BY_ID,
    API_GET_MESSAGES,
    API_POST_DECODE_PRIVATE_KEY_PAIR,
    API_POST_KEY_PAIR,
    API_SEND_MESSAGE,
} from '../../API/api_server';
import { deleteData, getData, postData } from '../../ultils/fetchAPI/fetch_API';
import { OwnDataContext } from '../../provider/own_data';
import { useSocket } from '../../provider/socket_context';
import {
    FaUserCircle,
    FaFacebookMessenger,
    FaVideo,
    FaPhoneAlt,
    FaEllipsisV,
    FaStop,
    FaMicrophone,
    FaUserLock,
    FaFileDownload,
} from 'react-icons/fa';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { toast } from 'react-toastify';
import config from '../../configs';
import ButtonCustom from '../../components/ButtonCustom/ButtonCustom';

function MessagesPage() {
    const [files, setFiles] = useState([]);
    const [showFilePond, setShowFilePond] = useState(false);
    const [message, setMessage] = useState(''); // Tin nhắn hiện tại
    const [messages, setMessages] = useState([]); // Danh sách các tin nhắn
    const [showAudio, setShowAudio] = useState(false); // mở audio
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const inputRef = useRef(null); // Tạo ref để tham chiếu đến input
    const [isRecording, setIsRecording] = useState(false);
    const [openSettingChat, setOpenSettingChat] = useState(false);
    const { id_receiver } = useParams();
    const audioChunks = useRef([]);
    const [hasKeyPairFriend, setHasKeyPairFriend] = useState(false);
    const [dataFriend, setDataFriend] = useState();
    const [codeMessage, setCodeMessage] = useState(false);
    const [hasPrivateKey, setHasPrivateKey] = useState(false);
    const [showReply, setShowReply] = useState(false);
    const [contentReply, setContentReply] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [receiverIsTyping, setReceiverIsTyping] = useState(false);
    const socket = useSocket();
    const dataOwner = useContext(OwnDataContext);
    const navigate = useNavigate();
    const [isOnline, setIsOnline] = useState(false);
    // Ref để cuộn đến tin nhắn mới nhất
    const messagesEndRef = useRef(null);
    const privateKey = localStorage.getItem('private-key');

    // Hàm cuộn đến tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    // check xem đã là bạn bè chưa
    const checkIfFriend = async () => {
        try {
            const response = await getData(API_CHECK_IF_FRIEND(id_receiver));
            if (response.isFriend === false) {
                navigate('/');
                toast.error('Bạn với người này chưa phải bạn bè vui lòng kết bạn để nhắn tin');
            }
        } catch (error) {
            console.error('Error checking if friend:', error);
        }
    };
    useEffect(() => {
        checkIfFriend();
    }, [id_receiver]);

    //Check xem người dùng đã có cặp key chưa
    const checkExistKeyPair = async () => {
        try {
            const response = await getData(API_CHECK_EXIST_KEY_PAIR);
            if (response.status === true) {
                setCodeMessage(true);
            } else {
                setCodeMessage(false);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    useEffect(() => {
        checkExistKeyPair();
    }, []);

    // Cuộn đến tin nhắn mới nhất mỗi khi danh sách tin nhắn thay đổi
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Kiểm tra xem "private-key" có tồn tại trong localStorage không
        const privateKey = localStorage.getItem('private-key');
        if (privateKey) {
            setHasPrivateKey(true); // Cập nhật trạng thái thành true nếu tìm thấy
        } else {
            setHasPrivateKey(false); // Nếu không có, trạng thái là false
        }
    }, []);

    // Lấy tin nhắn
    useEffect(() => {
        if (socket && dataOwner && id_receiver && privateKey) {
            socket.emit('registerUser', { user_id: dataOwner?.user_id });

            // Kiểm tra trạng thái online khi component được mount
            socket.on('onlineUsers', (data) => {
                setIsOnline(data.includes(id_receiver));
            });

            const getAllMessages = async () => {
                try {
                    const response = await postData(API_GET_MESSAGES(id_receiver), {
                        private_key: privateKey,
                    });
                    if (response?.status === true) {
                        setMessages(response?.data);
                    }
                } catch (error) {
                    console.log('Error: ' + error);
                }
            };

            getAllMessages();

            socket.on('receiveMessage', (data) => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        reply_text: data?.reply_text,
                        sender_id: data?.sender_id,
                        receiver_id: id_receiver,
                        content_text: data?.content_text,
                        content_type: data?.content_type,
                        name_file: data?.name_file ?? 'Không xác định',
                    },
                ]);
                setMessage(''); // Reset input
            });

            // Dọn dẹp khi component bị hủy
            return () => {
                socket.off('connect');
                socket.off('registerUser');
                // socket.off('onlineUsers');
                socket.off('onlineUsers');
                socket.off('receiveMessage');
            };
        }
    }, [socket, dataOwner, id_receiver, privateKey]);

    // Xử lý khi thay đổi tin nhắn
    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    // Gửi thông tin user đến server khi socket kết nối
    useEffect(() => {
        if (socket && dataOwner?.user_id) {
            socket.emit('addUser', dataOwner?.user_id); // Gửi id_receiver tới server
        }
    }, [socket, dataOwner]);

    // Lấy thông tin bạn bè từ API
    useEffect(() => {
        const checkKeyFriend = async () => {
            try {
                const response = await getData(API_CHECK_KEY_FRIEND(id_receiver));
                if (response.status === true) {
                    setHasKeyPairFriend(true);
                } else {
                    setHasKeyPairFriend(false);
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        const fetchData = async () => {
            try {
                const response = await getData(API_GET_INFO_USER_PROFILE_BY_ID(id_receiver));
                if (response.status === true) {
                    setDataFriend(response.data);
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        checkKeyFriend();
        fetchData();
    }, [id_receiver]);

    // xử lý khi ai đó đang nhắn:
    //Sự kiện có đang nhắn?
    useEffect(() => {
        try {
            //Gửi sự kiện mình đang nhắn
            socket.emit('senderWritting', {
                sender_id: dataOwner?.user_id,
                receiver_id: id_receiver,
                status: isTyping,
            });
            //Lắng nghe sự kiện đối phương nhắn tin
            socket.on('receiverNotifiWritting', (data) => {
                console.log("dataaaaaa: ", data);
                setReceiverIsTyping(data?.status);
            });

        } catch (error) {
            // console.log("error", error);
        }
    }, [isTyping]);

    console.log("Typing: ", isTyping);
    console.log("receiverIsTyping: ", receiverIsTyping);
    
    // Controlled input code verification
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const handleCodeChange = (e, index) => {
        const newCode = [...code];
        const value = e.target.value;

        // Validate input is numeric
        if (!isNaN(value) && value !== '') {
            newCode[index] = value;

            // Automatically focus on next input
            if (index < 5) {
                document.getElementById(`code-input-${index + 1}`).focus();
            }
        } else {
            newCode[index] = '';
        }

        setCode(newCode);
    };

    const handleBackspace = (e, index) => {
        if (e.key === 'Backspace' && code[index] === '') {
            if (index > 0) {
                document.getElementById(`code-input-${index - 1}`).focus();
            }
        }
    };

    // Handle form submit code
    const handleSubmit = async (e) => {
        e.preventDefault();
        const codeString = code.join('');
        const submitterName = e.nativeEvent.submitter.name; // Lấy tên của nút submit
        if (submitterName === 'set-password') {
            if (codeMessage === false) {
                const createKey = await postData(API_POST_KEY_PAIR, { code: codeString });
                if (createKey.status === true) {
                    navigate(`${config.routes.messages}/${id_receiver}`);
                    setCodeMessage(true);
                }
            } else {
                const checkPrivateKey = await postData(API_POST_DECODE_PRIVATE_KEY_PAIR, { code: codeString });
                if (checkPrivateKey.status === true) {
                    localStorage.setItem('private-key', checkPrivateKey.data.private_key);
                    setHasPrivateKey(true);
                }
            }
        } else if (submitterName === 'change-password') {
            if (window.confirm('Dữ liệu tin nhắn trước đó của bạn sẽ mất vĩnh viễn?')) {
                try {
                    const response = await deleteData(API_DELETE_KEY_PAIR);
                    if (response.status === true) {
                        localStorage.clear();
                        window.location.reload();
                    }
                } catch (error) {
                    console.log('Error: ', error);
                }
            }
        }

        setCode(['', '', '', '', '', '']); // Reset mã code sau khi submit
    };

    const handleOpenAudio = () => {
        setShowAudio(!showAudio);
    };

    useEffect(() => {
        if (mediaRecorder) {
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);
                audioChunks.current = [];

                handleSendAudio(audioBlob); // Send audio when recording stops
            };
        }
    }, [mediaRecorder]);
    // bắt đầu ghi âm
    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);

        setMediaRecorder(recorder);
        recorder.start();
        setIsRecording(true);
    };
    // dừng ghi âm
    const stopRecording = () => {
        mediaRecorder.stop();
        setIsRecording(false);
    };

    // Gửi tin nhắn khi click vào icon gửi tin nhắn
    const handleSendMessage = async () => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        // Kiểm tra nếu tin nhắn là văn bản
        let newMessage = {};
        if (message.trim()) {
            if (urlRegex.test(message)) {
                const formattedMessage = message.replace(
                    urlRegex,
                    (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`,
                );
                newMessage = {
                    content_type: 'link',
                    content_text: formattedMessage,
                    sender_id: dataOwner?.user_id,
                    receiver_id: id_receiver,
                    reply_text: contentReply?.content,
                };
            } else {
                newMessage = {
                    content_type: 'text',
                    content_text: message,
                    sender_id: dataOwner?.user_id,
                    receiver_id: id_receiver,
                    reply_text: contentReply?.content,
                };
            }

            // Gửi tin nhắn văn bản qua API
            try {
                await postData(API_SEND_MESSAGE(id_receiver), {
                    content_type: newMessage.content_type,
                    content_text: newMessage.content_text,
                    sender_id: newMessage.sender_id,
                    receiver_id: newMessage.receiver_id,
                    reply_text: newMessage.reply_text,
                });
            } catch (error) {
                console.log('Error sending text message: ', error);
            }
        }

        // Xử lý gửi từng file
        if (files.length > 0) {
            for (const file of files) {
                const formData = new FormData();
                const fileType = file.file.type;

                // Tạo link tạm thời cho file
                const localFileURL = URL.createObjectURL(file.file);

                // Xác định loại file
                let contentType;
                if (fileType.startsWith('image/')) {
                    contentType = 'image';
                } else if (fileType.startsWith('video/')) {
                    contentType = 'video';
                } else if (fileType.startsWith('audio/')) {
                    contentType = 'audio';
                } else {
                    contentType = 'other';
                }

                // Append file vào FormData

                formData.append('file', file.file, file.file.name); // Thay đổi key cho phù hợp

                // Append các thông tin khác vào FormData
                formData.append('content_type', contentType);
                formData.append('content_text', file.file.name); // Hoặc tên file nếu cần
                formData.append('name_file', file.file.name); // Hoặc tên file nếu cần
                formData.append('sender_id', dataOwner?.user_id);
                formData.append('receiver_id', id_receiver);
                if (showReply) {
                    formData.append('reply_text', contentReply?.content);
                }
                // Gửi từng file qua API
                try {
                    await postData(API_SEND_MESSAGE(id_receiver), formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    // Thêm tin nhắn vào state với link tạm thời
                    const fileMessage = {
                        content_type: contentType,
                        content_text: localFileURL, // Sử dụng link tạm thời
                        sender_id: dataOwner?.user_id,
                        receiver_id: id_receiver,
                        name_file: file.file.name ?? 'Không xác định',
                        reply_text: contentReply?.content,
                    };

                    setMessages((prevMessages) => [...prevMessages, fileMessage]);
                } catch (error) {
                    console.log('Error sending file: ', error);
                }
            }
        }

        // Cập nhật tin nhắn vào state với tin nhắn văn bản
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        // Reset lại input và tệp tin
        setMessage(''); // Reset input
        setFiles([]);
        setShowFilePond(false);
        setShowAudio(false);
        setShowReply(false);
        setContentReply({});
    };
    // gửi audio
    const handleSendAudio = async (audioFile) => {
        // Create FormData for the audio file
        const formData = new FormData();
        // Create a temporary local URL for the audio file
        const localAudioURL = URL.createObjectURL(audioFile);
        // Construct the new message object for UI update
        const newMessage = {
            content_type: 'audio',
            content_text: localAudioURL, // Use the temporary link
            sender_id: dataOwner?.user_id,
            receiver_id: id_receiver,
            name_file: audioFile.name ?? 'Unknown', // Default to 'Unknown' if no name
            reply_text: contentReply?.content,
        };
        formData.append('file', audioFile, audioFile.name); // Assuming audioFile contains the file object
        formData.append('content_type', 'audio');
        formData.append('name_file', audioFile.name);
        formData.append('content_text', Date.now()); // Hoặc tên file nếu cần
        formData.append('sender_id', dataOwner?.user_id);
        formData.append('receiver_id', id_receiver);
        if (showReply) {
            formData.append('reply_text', contentReply?.content);
        }
        // Try sending the audio file via API
        try {
            await postData(API_SEND_MESSAGE(id_receiver), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Update the UI with the new message
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        } catch (error) {
            console.log('Error sending audio message: ', error);
        }
        // Reset lại input và tệp tin
        setMessage(''); // Reset input
        setFiles([]);
        setShowFilePond(false);
        setShowAudio(false);
        setShowReply(false);
        setContentReply({});
    };

    return (
        <div className="messenger_container">
            {hasPrivateKey && ( // Chat UI
                <>
                    <div className="left_messenger">
                        <PopoverChat inputRef={inputRef} privateKey={privateKey} currentChatId={id_receiver} />
                    </div>
                    <div className="center_messenger">
                        <div className="messages_container">
                            <div className="chat_header">
                                <FriendItem to={`${config.routes.profile}/${id_receiver}`} data={dataFriend} />
                                <div className="action_call">
                                    <ToolTip title="Bắt đầu gọi thoại">
                                        <div className="action_chat">
                                            <PhoneIcon />
                                        </div>
                                    </ToolTip>
                                    <ToolTip title="Bắt đầu gọi video">
                                        <Link
                                            to={`${config.routes.messages}/video-call?ROOM_ID=${
                                                id_receiver + dataOwner?.user_id
                                            }&sender_id=${dataOwner?.user_id}&receiver_id=${id_receiver}`}
                                        >
                                            <div className="action_chat">
                                                <VideoCallIcon />
                                            </div>
                                        </Link>
                                    </ToolTip>
                                    <ToolTip
                                        onClick={() => setOpenSettingChat(!openSettingChat)}
                                        title="Thông tin về cuộc trò chuyện"
                                    >
                                        <div className="action_chat">
                                            <ExtendChatIcon />
                                        </div>
                                    </ToolTip>
                                    {/* <VideoCall id_receiver={id_receiver} /> */}
                                </div>
                            </div>
                            <div className="chat_body">
                                <div className="chat_main_infor">
                                    {/* Render danh sách tin nhắn */}
                                    {messages.map((msg, index) => (
                                        <MessagesItems
                                            reply_text={msg.reply_text}
                                            setShowReply={setShowReply}
                                            setContentReply={setContentReply}
                                            key={index}
                                            inputRef={inputRef} // Truyền ref vào MessagesItems
                                            index={index}
                                            nameFile={msg.name_file}
                                            type={msg.content_type}
                                            message={msg.content_text ?? msg.text}
                                            sender_id={msg.sender_id}
                                            className={
                                                msg.sender_id === dataOwner?.user_id ||
                                                msg.senderId === dataOwner?.user_id
                                                    ? 'sender'
                                                    : ''
                                            }
                                        />
                                    ))}
                                    <div ref={messagesEndRef}></div>
                                </div>
                            </div>
                            {receiverIsTyping && (
                                <i style={{ fontSize: '12px' }} className="writting">
                                    {dataFriend && dataFriend?.user_name} đang nhắn ...
                                </i>
                            )}
                            {showReply && (
                                <div className="reply_context">
                                    <div className="left_reply">
                                        <div className="title_reply">
                                            Trả lời tin nhắn{' '}
                                            {contentReply?.senderId === id_receiver
                                                ? dataFriend?.user_name
                                                : 'chính mình'}
                                        </div>
                                        <p>{contentReply?.content || 'Nội dung trả lời...'}</p>
                                    </div>
                                    <div className="right_reply">
                                        <IoMdCloseCircle
                                            className="close_reply_message"
                                            onClick={() => setShowReply(false)}
                                        />
                                    </div>
                                </div>
                            )}
                            {showFilePond && (
                                <FilePond
                                    files={files}
                                    allowMultiple={true}
                                    onupdatefiles={setFiles}
                                    labelIdle='Kéo và Thả tệp phương tiện or <span className="filepond--label-action">Duyệt</span>'
                                />
                            )}
                            {showAudio && (
                                <div className="hear" onClick={isRecording ? stopRecording : startRecording}>
                                    {isRecording ? (
                                        <>
                                            <FaStop /> Đang nghe...
                                        </>
                                    ) : (
                                        <>
                                            <FaMicrophone /> Bấm để ghi âm
                                        </>
                                    )}
                                </div>
                            )}
                            {hasKeyPairFriend ? (
                                <div className="chat_footer">
                                    <div className="send_file_input" onClick={handleOpenAudio}>
                                        <AudioIcon />
                                    </div>
                                    <div className="send_file_input" onClick={() => setShowFilePond(!showFilePond)}>
                                        <SendFileIcon />
                                    </div>
                                    <Search
                                        onFocus={() => setIsTyping(true)}
                                        onBlur={() => setIsTyping(false)}
                                        inputRef={inputRef} // Gắn ref vào input
                                        onkeydown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Nhập tin nhắn"
                                        value={message}
                                        onChange={handleInputChange}
                                    />

                                    <div
                                        className={`send_mesage_action ${message || files.length > 0 ? '' : 'hidden'}`}
                                        onClick={handleSendMessage}
                                    >
                                        <SendMessageIcon />
                                    </div>

                                    {/* <div className={`send_mesage_action`} onClick={handleSendMessage}>
                                    <SendMessageIcon />
                                </div> */}
                                    <div
                                        className={`like_message_action ${message || files.length > 0 ? 'hidden' : ''}`}
                                    >
                                        <LikeMessageIcon />
                                    </div>
                                </div>
                            ) : (
                                <div className="chat_footer">
                                    <h5 className="notice_key_friend">
                                        Bạn bè chưa thiết lập tin nhắn vui lòng quay lại sau!
                                    </h5>
                                </div>
                            )}
                        </div>
                    </div>
                    {openSettingChat && (
                        <div className="right_messenger">
                            <SettingMessages />
                        </div>
                    )}
                </>
            )}
            {!hasPrivateKey && ( // Input Code Section
                <div className="container_input_code">
                    {codeMessage || <h3>Vui lòng nhập mật khẩu để thiết lập tin nhắn</h3>}
                    <form onSubmit={handleSubmit} className="input_code_chat">
                        <div id="input_code" className="inputs">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`code-input-${index}`}
                                    className="input"
                                    type="text"
                                    value={digit}
                                    maxLength="1"
                                    onChange={(e) => handleCodeChange(e, index)}
                                    onKeyUp={(e) => handleBackspace(e, index)}
                                />
                            ))}
                        </div>
                        <div className="button_container_code">
                            <ButtonCustom
                                className="primary"
                                type="submit"
                                name="set-password"
                                disabled={code.some((digit) => digit === '')}
                                title={codeMessage === false ? 'Thiết lập mật khẩu' : 'Nhập mật khẩu'}
                            />
                            <div className="btn_change_pass_code">
                                {codeMessage && (
                                    <ButtonCustom
                                        className="secondary"
                                        type="submit"
                                        name="change-password"
                                        title="Đổi mật khẩu"
                                    />
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default MessagesPage;
