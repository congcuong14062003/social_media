import { useState, useEffect } from 'react';
import FriendItem from '../FriendItem/FriendItem';
import AvatarWithText from '../../../skeleton/avatarwithtext';

function FriendList({ ListUser }) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoaded(true);
        }, 1000);

        return () => clearTimeout(timer); // Cleanup timeout on unmount
    }, []);

    return (
        <div className="friend_container">
            {ListUser && ListUser.map((user) => (
                loaded ? (
                    <FriendItem key={user.friend_id || user.user_id} data={user} />
                ) : (
                    <div key={user.friend_id || user.user_id} className="loading-skeleton">
                        <AvatarWithText />
                    </div>
                )
            ))}
        </div>
    );
}

export default FriendList;
