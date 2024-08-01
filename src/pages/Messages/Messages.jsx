import { ExtendChatIcon, PhoneIcon, VideoCallIcon } from '../../assets/icons/icons';
import FriendItem from '../../components/Friend/FriendItem/FriendItem';
import PopoverChat from '../../components/Popover/PopoverChat/PopoverChat';
import Search from '../../components/Search/Search';
import './Messages.scss';
function MessagesPage() {
    return (
        <div className="messenger_container">
            <div className="left_messenger">
                <PopoverChat />
            </div>
            <div className="center_messenger">
                <div className="messages_container">
                    <div className="chat_header">
                        <FriendItem />
                        <div className="action_call">
                            <div className="action_chat">
                                <PhoneIcon />
                            </div>
                            <div className="action_chat">
                                <VideoCallIcon />
                            </div>
                            <div className="action_chat">
                                <ExtendChatIcon />
                            </div>
                        </div>
                    </div>
                    <div className="chat_body"></div>
                    <div className="chat_footer">
                        <Search placeholder="Nhập tin nhắn "/>
                    </div>
                </div>
            </div>
            <div className="right_messenger"></div>
        </div>
    );
}

export default MessagesPage;
