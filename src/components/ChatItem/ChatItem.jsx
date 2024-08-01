import { Link } from 'react-router-dom';
import AvatarUser from '../AvatarUser/AvatarUser';
import './ChatItem.scss';
function ChatItem() {
    return (
        <Link to="/">
            <div className="chat_item_container">
                <div className="avatar_chat">
                    <AvatarUser />
                </div>
                <div className="content_chat">
                    <div className="title_chat">Vợ anh</div>
                    <div className="time_chat">Kh có mình cái ăn ngon hẳn<span>9 giờ</span></div>
                </div>
            </div>
        </Link>
    );
}

export default ChatItem;
