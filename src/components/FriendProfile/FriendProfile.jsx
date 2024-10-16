import FriendComponent from '../FriendComponent/FriendComponent';
import './FriendProfile.scss';
function FriendProfile() {
    return (
        <div className="friend_profile_container">
            <FriendComponent className="all_friend_profile" noAll />
        </div>
    );
}

export default FriendProfile;
