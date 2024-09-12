import './FriendComponent.scss';
import images from '../../assets/imgs';
import ComponentProfile from '../ComponentProfile/ComponentProfile';
import { Link, useParams } from 'react-router-dom';
function FriendComponent() {
    const { id_user } = useParams();
    return (
        <ComponentProfile title="Bạn bè" link={`/profile/${id_user}/ban-be`} linktitle="Xem tất cả bạn bè">
            <p className="count_friends">385 bạn bè</p>
            <div className="friend_user_profile">
                <Link>
                    <div className="friend_item">
                        <img src={images.boy} alt="" />
                        <p className="friend_name">Công Cường</p>
                    </div>
                </Link>
            </div>
        </ComponentProfile>
    );
}

export default FriendComponent;
