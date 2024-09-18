import { Link } from 'react-router-dom';
import AvatarUser from '../../AvatarUser/AvatarUser';
import './FriendItem.scss';
function FriendItem({data}) {
    return (
        <Link>
            <div className="friend_item">
                <AvatarUser avatar={data && data?.avatar} />
                <div className="name_friend">{data && data?.user_name}</div>
            </div>
        </Link>
    );
}

export default FriendItem;
