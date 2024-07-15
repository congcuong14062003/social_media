import './FriendComponent.scss';
import images from '../../assets/imgs';
import ComponentProfile from '../ComponentProfile/ComponentProfile';
import { Link } from 'react-router-dom';
function FriendComponent() {
    return (
        <ComponentProfile title="Bạn bè" linktitle="Xem tất cả bạn bè">
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
