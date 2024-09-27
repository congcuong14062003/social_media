import React, { useEffect, useState } from 'react';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { API_LIST_INVITED_FRIEND } from '../../API/api_server';
import FriendInvitationItem from '../../components/FriendInvitationItem/FriendInvitationItem';
import FriendSuggestItem from '../../components/FriendSuggestItem/FriendSuggestItem';

function InvitedFriends() {
    const [listInvitedFriend, setListInvitedFriend] = useState([]);

    useEffect(() => {
        const fetchInvitedFriends = async () => {
            try {
                const response = await getData(API_LIST_INVITED_FRIEND);
                // Kiểm tra nếu response và response.users tồn tại
                if (response && response.users) {
                    setListInvitedFriend(response.users);
                } else {
                    setListInvitedFriend([]); // Nếu không có dữ liệu, đặt thành mảng rỗng
                }
            } catch (error) {
                console.error('Error fetching invited friends:', error);
                setListInvitedFriend([]); // Xử lý lỗi bằng cách đặt mảng rỗng
            }
        };
        fetchInvitedFriends();
    }, []);
    return (
        <>
            {listInvitedFriend.length > 0 ? (
                <div className="friend_suggest friend_invitation">
                    {listInvitedFriend.map((user, index) => (
                        <FriendSuggestItem key={index} data={user} />
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

export default InvitedFriends;
