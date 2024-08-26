import FriendItem from '../FriendItem/FriendItem';

function FriendList({ListUser}) {
    return (
        <div className="friend_container">
            {ListUser && ListUser.map((user, index) => (
                <FriendItem key={index} to={`/profile/${user.user_id}`} nameUser={user.user_name} />
            ))}
        </div>
    );
}

export default FriendList;
