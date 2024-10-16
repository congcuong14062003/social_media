import './FriendComponent.scss';
import images from '../../assets/imgs';
import ComponentProfile from '../ComponentProfile/ComponentProfile';
import { Link, useParams } from 'react-router-dom';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { API_LIST_FRIEND_BY_ID } from '../../API/api_server';
import { useEffect, useState } from 'react';

function FriendComponent({ noAll, className }) {
    const { id_user } = useParams();
    const [listFriend, setListFriend] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await getData(API_LIST_FRIEND_BY_ID(id_user));
                if (response && response.users) {
                    setListFriend(response.users);
                } else {
                    setListFriend([]); // Nếu không có dữ liệu, đặt thành mảng rỗng
                }
            } catch (error) {
                console.error('Error fetching friends:', error);
                setListFriend([]); // Xử lý lỗi bằng cách đặt mảng rỗng
            }
        };
        fetchFriends();
    }, [id_user]);

    return (
        <ComponentProfile
            className={className}
            title="Bạn bè"
            link={`/profile/${id_user}/ban-be`}
            linktitle={noAll || 'Xem tất cả bạn bè'}
        >
            <p className="count_friends">{listFriend.length} bạn bè</p>
            <div className="friend_user_profile">
                {listFriend.map((data) => (
                    <a key={data.friend_id} href={`/profile/${data.friend_id}`}>
                        <div className="friend_item_profile">
                            <img src={data?.avatar_link || images.boy} alt={data.avatar_link} />
                            <p className="friend_name">{data?.user_name}</p>
                        </div>
                    </a>
                ))}
            </div>
        </ComponentProfile>
    );
}

export default FriendComponent;
