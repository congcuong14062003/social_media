import { Link } from 'react-router-dom';
import AvatarUser from '../AvatarUser/AvatarUser';
import './NoticeItem.scss';
import { timeAgo } from '../../ultils/formatDate/format_date';
function NoticeItem({notification}) {
    console.log(notification);
    return (
        <Link to={notification?.target_id}>
            <div className="notice_item_container">
                <div className="avatar_notice">
                    <AvatarUser avatar={notification?.avatar}/>
                </div>
                <div className="content_notice">
                    <div className="title_notice">{notification?.content}</div>
                    <div className="time_notice">{timeAgo(notification?.created_at)}</div>
                </div>
            </div>
        </Link>
    );
}

export default NoticeItem;
