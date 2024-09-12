import ChatItem from '../../ChatItem/ChatItem';
import Search from '../../Search/Search';
import Popover from '../Popover';
import './PopoverChat.scss';
function PopoverChat() {
    return (
        <Popover title="Đoạn chat">
            <div className="search_chat_user">
                <Search iconSearch placeholder="Tìm kiếm trên messenger" />
            </div>
            <div className="chat_container">
                <ChatItem />
                <ChatItem />
                <ChatItem />
            </div>
        </Popover>
    );
}

export default PopoverChat;
