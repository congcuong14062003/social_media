import { Link } from 'react-router-dom';
import AvatarUser from '../../AvatarUser/AvatarUser';
import './FriendItem.scss';
function FriendItem({to, nameUser, avatarUser}) {
    return (
        <Link to={to}>
            <div className="friend_item">
                <AvatarUser />
                <div className="name_friend">{nameUser}</div>
            </div>
        </Link>
    );
}

export default FriendItem;
