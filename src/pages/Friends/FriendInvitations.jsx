import React, { useEffect, useState } from 'react';
import FriendInvitationItem from '../../components/FriendInvitationItem/FriendInvitationItem';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { API_LIST_FRIEND_INVITE } from '../../API/api_server';
import './Friends.scss';
function FriendInvitations() {
    const [listFriendInvite, setListFriendInvite] = useState([]);

    useEffect(() => {
        const fetchFriendInvites = async () => {
            try {
                const response = await getData(API_LIST_FRIEND_INVITE);
                // Kiểm tra nếu response và response.users tồn tại
                if (response && response.users) {
                    setListFriendInvite(response.users);
                } else {
                    setListFriendInvite([]); // Nếu không có dữ liệu, đặt thành mảng rỗng
                }
            } catch (error) {
                console.error('Error fetching friend invites:', error);
                setListFriendInvite([]); // Xử lý lỗi bằng cách đặt mảng rỗng
            }
        };
        fetchFriendInvites();
    }, []);

    return (
        <>
            {listFriendInvite.length > 0 ? (
                <div className="friend_invitation">
                    {listFriendInvite.map((user, index) => (
                        <FriendInvitationItem key={index} data={user} />
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

export default FriendInvitations;
