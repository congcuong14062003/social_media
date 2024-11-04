import { useEffect, useState } from 'react';
import FriendComponent from '../FriendComponent/FriendComponent';
import './FriendProfile.scss';
import { API_LIST_FRIEND_BY_ID } from '../../API/api_server';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { useParams } from 'react-router-dom';
function FriendProfile() {
    const { id_user } = useParams(); // Lấy id_user từ params trên URL
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
        <div className="friend_profile_container">
            <FriendComponent listFriend={listFriend} className="all_friend_profile" noAll />
        </div>
    );
}

export default FriendProfile;
