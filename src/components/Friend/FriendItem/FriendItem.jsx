import { Link } from 'react-router-dom';
import AvatarUser from '../../AvatarUser/AvatarUser';
import './FriendItem.scss';
import config from '../../../configs';

function FriendItem({ data }) {
    return (
        <Link to={`${config.routes.profile}/${data?.friend_id || data?.user_id}`}>
            <div className="friend_item">
                <AvatarUser avatar={data?.avatar_link || data?.avatar} />
                <div className="name_friend">{data?.user_name}</div>
            </div>
        </Link>
    );
}

export default FriendItem;
