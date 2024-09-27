import React, { useEffect, useState } from 'react';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { API_LIST_FRIEND } from '../../API/api_server';
import './Friends.scss';
import FriendSuggestItem from '../../components/FriendSuggestItem/FriendSuggestItem';
import FriendItem from '../../components/FriendItem/FriendItem';
function FriendList() {
    const [listFriend, setListFriend] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await getData(API_LIST_FRIEND);
                // Kiểm tra nếu response và response.users tồn tại
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
    }, []);
    return (
        <>
            {listFriend.length > 0 ? (
                <div className="friend_suggest friend_invitation">
                    {listFriend.map((user, index) => (
                        <FriendItem key={index} data={user} />
                    ))}
                </div>
            ) : (
                <div className="blank_content">
                    <p>Danh sách trống</p>
                </div>
            )}
        </>
    );
}

export default FriendList;
