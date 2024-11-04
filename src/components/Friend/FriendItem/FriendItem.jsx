import { Link } from 'react-router-dom';
import AvatarUser from '../../AvatarUser/AvatarUser';
import './FriendItem.scss';
import config from '../../../configs';
import { useSocket } from '../../../provider/socket_context';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import OwnDataProvider from '../../../provider/own_data';

function FriendItem({ data }) {
    const socket = useSocket();
    const [statusFriend, setStatusFriend] = useState([]);
    const dataOwner = useContext(OwnDataProvider);
    useEffect(() => {
        if (socket && data) {
            socket.emit('registerUser', { user_id: dataOwner?.user_id });
    
            // Lắng nghe danh sách người dùng online từ server
            socket.on('onlineUsers', (dataOnline) => {
                setStatusFriend(dataOnline);
            });
        }
    
        // Cleanup listener khi component unmount
        return () => {
            socket.off('onlineUsers');
        };
    }, [socket, data]);
    
    console.log(statusFriend?.includes(data?.friend_id || data?.user_id));
    return (
        <Link to={`${config.routes.profile}/${data?.friend_id || data?.user_id}`}>
            <div
                className={`friend_item ${
                    statusFriend?.includes(data?.friend_id || data?.user_id) ? 'online' : 'offline'
                }`}
            >
                <AvatarUser avatar={data?.avatar_link || data?.avatar} />
                <div className="infor_friend">
                    <div className="name_friend">{data?.user_name}</div>
                    <div className="status_friend">
                        {statusFriend?.includes(data?.friend_id || data?.user_id) ? 'Online' : 'Offline'}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default FriendItem;
