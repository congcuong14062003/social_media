import { Link } from 'react-router-dom';
import AvatarUser from '../AvatarUser/AvatarUser';
import './NoticeItem.scss';
function NoticeItem() {
    return (
        <Link to="/">
            <div className="notice_item_container">
                <div className="avatar_notice">
                    <AvatarUser />
                </div>
                <div className="content_notice">
                    <div className="title_notice">Dương Mạnh đã bình luận về bài viết của bạn</div>
                    <div className="time_notice">9 giờ</div>
                </div>
            </div>
        </Link>
    );
}

export default NoticeItem;
