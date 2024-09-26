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
import { useNavigate, useParams } from 'react-router-dom';
import {
    API_CHECK_EXIST_KEY_PAIR,
    API_CHECK_IF_FRIEND,
    API_GET_INFO_USER_PROFILE_BY_ID,
    API_GET_MESSAGES,
    API_POST_DECODE_PRIVATE_KEY_PAIR,
    API_POST_KEY_PAIR,
} from '../../API/api_server';
import { getData, postData } from '../../ultils/fetchAPI/fetch_API';
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
import "filepond/dist/filepond.min.css";

function MessagesPage() {
    const [files, setFiles] = useState([]);
    const [showFilePond, setShowFilePond] = useState(false);
    const [message, setMessage] = useState(''); // Tin nhắn hiện tại
    const [messages, setMessages] = useState([]); // Danh sách các tin nhắn
    const [showAudio, setShowAudio] = useState(false); // mở audio
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [openSettingChat, setOpenSettingChat] = useState(false);
    const { id_user } = useParams();
    const audioChunks = useRef([]);
    const [dataFriend, setDataFriend] = useState();
    const [codeMessage, setCodeMessage] = useState();
    const [hasPrivateKey, setHasPrivateKey] = useState(false);
    const socket = useSocket();
    const dataUser = useContext(OwnDataContext);
    const privateKey = localStorage.getItem('private-key');
    const navigate = useNavigate();
    // Ref để cuộn đến tin nhắn mới nhất
    const messagesEndRef = useRef(null);

    // Hàm cuộn đến tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    // check xem đã là bạn bè chưa
    // const checkIfFriend = async () => {
    //     try {
    //         const response = await getData(API_CHECK_IF_FRIEND(id_user));
    //         console.log("response: ", response);
    //         if (response.isFriend === false) {
    //             navigate('/')
    //             toast.error("Bạn với người này chưa phải bạn bè vui lòng kết bạn để nhắn tin")
    //         }

    //     } catch (error) {
    //         console.error('Error checking if friend:', error);
    //     }
    // };

    // useEffect(()=> {
    //     checkIfFriend()
    // }, [id_user])
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
        const fetchData = async () => {
            const codeString = code.join(''); // Ghép mảng `code` thành chuỗi
            try {
                const response = await postData(API_GET_MESSAGES(id_user), {
                    private_key: privateKey, // Truyền code
                });
                if (response.status === 200) {
                    setMessages(response.data); // Lưu tin nhắn đã giải mã vào state
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        fetchData();
    }, [id_user]);

    // Xử lý khi thay đổi tin nhắn
    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    // Gửi thông tin user đến server khi socket kết nối
    useEffect(() => {
        if (socket && dataUser?.user_id) {
            socket.emit('addUser', dataUser?.user_id); // Gửi id_user tới server
        }
    }, [socket, dataUser]);

    // Đăng ký sự kiện nhận tin nhắn
    useEffect(() => {
        if (socket) {
            // socket.on('connect', () => {
            //     console.log('Connected to the server', socket.id);
            // });
            socket.on('getMessage', (data) => {
                // console.log('Received message:', data);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        senderId: data.senderId,
                        text: data.text,
                        isSender: data.senderId === dataUser?.user_id,
                    },
                ]);
            });

            return () => {
                socket.off('getMessage'); // Ngừng lắng nghe sự kiện khi component unmount
            };
        }
    }, [socket, dataUser]);

    // Gửi tin nhắn khi click vào icon gửi tin nhắn
    const handleSendMessage = () => {
        if (socket && message.trim()) {
            const receiverId = id_user; // Lấy id người nhận từ thông tin friend
            socket.emit('sendMessage', {
                senderId: dataUser?.user_id,
                receiverId,
                text: message,
            });
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    senderId: dataUser?.user_id,
                    text: message,
                    isSender: true,
                },
            ]);
            setMessage(''); // Reset input
        }
    };

    // Lấy thông tin bạn bè từ API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getData(API_GET_INFO_USER_PROFILE_BY_ID(id_user));
                if (response.status === 200) {
                    setDataFriend(response.data);
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        fetchData();
    }, [id_user]);

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

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const codeString = code.join(''); // Join the code into a single string
        // console.log('Code entered:', codeString);
        // Send the codeString or do something with it
        if (codeMessage === true) {
            const createKey = await postData(API_POST_KEY_PAIR, { secret_key: codeString });
            if (createKey.status === 200) {
                console.log('tạo cặp key thành công');
            }
        } else {
            ////// đăng nhập chỗ khác
            const checkPrivateKey = await postData(API_POST_DECODE_PRIVATE_KEY_PAIR, { secret_key: codeString });
            if (checkPrivateKey.status === 200) {
                localStorage.setItem('private-key', checkPrivateKey.data.private_key);
                setHasPrivateKey(true);
            }
        }
        setCode(['', '', '', '', '', '']); // Reset code input
    };

    const checkExistKeyPair = async () => {
        try {
            const response = await getData(API_CHECK_EXIST_KEY_PAIR);
            if (response.status === 200) {
                setCodeMessage(false);
            } else {
                setCodeMessage(true);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };
    useEffect(() => {
        checkExistKeyPair();
    }, []);

    // event
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

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        recorder.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorder.stop();
        setIsRecording(false);
    };

    const handleSendAudio = async (audioFile) => {
        // Create FormData for the audio file
        // const formData = new FormData();
        // // Create a temporary local URL for the audio file
        // const localAudioURL = URL.createObjectURL(audioFile);
        // // Construct the new message object for UI update
        // const newMessage = {
        //   content_type: "audio",
        //   content_text: localAudioURL, // Use the temporary link
        //   sender_id: dataOwner?.user_id,
        //   receiver_id: id_receiver,
        //   name_file: audioFile.name ?? "Unknown", // Default to 'Unknown' if no name
        // };
        // formData.append("file", audioFile, audioFile.name); // Assuming audioFile contains the file object
        // formData.append("content_type", "audio");
        // formData.append("content_text", Date.now()); // Hoặc tên file nếu cần
        // formData.append("sender_id", dataOwner?.user_id);
        // formData.append("receiver_id", id_receiver);
        // // Try sending the audio file via API
        // try {
        //   await postData(API_SEND_MESSAGE(id_receiver), formData, {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //   });
        //   // Update the UI with the new message
        //   setMessages((prevMessages) => [...prevMessages, newMessage]);
        // } catch (error) {
        //   console.log("Error sending audio message: ", error);
        // }
    };
    console.log(audioURL);
    console.log("files: ", files);
    
    return (
        <div className="messenger_container">
            {hasPrivateKey && ( // Chat UI
                <>
                    <div className="left_messenger">
                        <PopoverChat />
                    </div>
                    <div className="center_messenger">
                        <div className="messages_container">
                            <div className="chat_header">
                                <FriendItem data={dataFriend} />
                                <div className="action_call">
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
                                    <ToolTip
                                        onClick={() => setOpenSettingChat(!openSettingChat)}
                                        title="Thông tin về cuộc trò chuyện"
                                    >
                                        <div className="action_chat">
                                            <ExtendChatIcon />
                                        </div>
                                    </ToolTip>
                                </div>
                            </div>
                            <div className="chat_body">
                                <div className="chat_main_infor">
                                    {/* Render danh sách tin nhắn */}
                                    {messages.map((msg, index) => {
                                        return (
                                            <MessagesItems
                                                key={index}
                                                message={msg.content_text ?? msg.text}
                                                className={
                                                    msg.sender_id === dataUser?.user_id ||
                                                    msg.senderId === dataUser?.user_id
                                                        ? 'sender'
                                                        : ''
                                                }
                                            />
                                        );
                                    })}

                                    <div ref={messagesEndRef}></div>
                                </div>
                            </div>
                            {showFilePond && (
                                <FilePond
                                    files={files}
                                    allowMultiple={true}
                                    onupdatefiles={setFiles}
                                    labelIdle='Kéo và Thả tệp phương tiện or <span class="filepond--label-action">Duyệt</span>'
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
                            <div className="chat_footer">
                                <div className="send_file_input" onClick={handleOpenAudio}>
                                    <AudioIcon />
                                </div>
                                <div className="send_file_input" onClick={() => setShowFilePond(!showFilePond)}>
                                    <SendFileIcon />
                                </div>
                                <Search placeholder="Nhập tin nhắn" value={message} onChange={handleInputChange} />

                                {/* <div
                                    className={`send_mesage_action ${message ? '' : 'hidden'}`}
                                    onClick={handleSendMessage}
                                >
                                    <SendMessageIcon />
                                </div>
                                 */}
                                <div
                                    className={`send_mesage_action`}
                                    onClick={handleSendMessage}
                                >
                                    <SendMessageIcon />
                                </div>
                                <div className={`like_message_action hidden}`}>
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
                </>
            )}
            {!hasPrivateKey && ( // Input Code Section
                <div className="container_input_code">
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
                            <button type="submit" disabled={code.some((digit) => digit === '')}>
                                {codeMessage === true ? 'Thêm mã code' : 'Xác nhận'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default MessagesPage;
