import React, { useEffect, useState } from 'react';
import FriendSuggestItem from '../../components/FriendSuggestItem/FriendSuggestItem';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { API_LIST_FRIEND_SUGGEST } from '../../API/api_server';
import './Friends.scss';
function FriendSuggestion() {
    const [allUser, setAllUser] = useState([]);

    useEffect(() => {
        const fetchAllFriends = async () => {
            const response = await getData(API_LIST_FRIEND_SUGGEST);
            setAllUser(response.users);
        };
        fetchAllFriends();
    }, []);
    return (
        <>
            {allUser.length > 0 ? (
                <div className="friend_invitation">
                    {allUser.map((user, index) => (
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

export default FriendSuggestion;
