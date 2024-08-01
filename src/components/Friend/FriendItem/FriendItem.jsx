import { Link } from 'react-router-dom';
import AvatarUser from '../../AvatarUser/AvatarUser';
import './FriendItem.scss';
function FriendItem() {
    return (
        <Link to="/">
            <div className="friend_item">
                <AvatarUser />
                <div className="name_friend">Dương Mạnh</div>
            </div>
        </Link>
    );
}

export default FriendItem;
