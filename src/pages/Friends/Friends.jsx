import React, { useEffect, useState } from 'react';
import HorizontalItem from '../../components/HorizontalItem/HorizontalItem';
import PrimaryIcon from '../../components/PrimaryIcon/PrimaryIcon';
import { HiUserAdd } from 'react-icons/hi';
import { FaUser } from 'react-icons/fa';
import './Friends.scss';
import FriendInvitationItem from '../../components/FriendInvitationItem/FriendInvitationItem';
import FriendSuggestItem from '../../components/FriendSuggestItem/FriendSuggestItem';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { API_GET_ALL_USERS, API_LIST_FRIEND_INVITE } from '../../API/api_server';

function Friends() {
    const [activeTab, setActiveTab] = useState('suggestions'); // state để lưu tab đang active
    const [allUser, setAllUser] = useState([]);
    const [listFriendInvite, setListFriendInvite] = useState([]);
    const getAllFriend = async () => {
        const response = await getData(API_GET_ALL_USERS);
        setAllUser(response.users);
    };
    const getListFriendInvite = async () => {
        const response = await getData(API_LIST_FRIEND_INVITE);
        setListFriendInvite(response);
    }
    useEffect(() => {
        getAllFriend();
        getListFriendInvite();
    }, [activeTab]);
    console.log("invite: ", listFriendInvite);
    
    return (
        <div className="friend_home_container">
            <div className="left_container">
                <div className="content">
                    <ul className="list_items_left">
                        <li onClick={() => setActiveTab('suggestions')}>
                            <HorizontalItem
                                icon={<PrimaryIcon icon={<FaUser />} />}
                                title="Gợi ý"
                                isActive={activeTab === 'suggestions'} // Truyền prop isActive
                            />
                        </li>
                        <li onClick={() => setActiveTab('invitations')}>
                            <HorizontalItem
                                icon={<PrimaryIcon icon={<HiUserAdd />} />}
                                title="Lời mời kết bạn"
                                isActive={activeTab === 'invitations'} // Truyền prop isActive
                            />
                        </li>
                    </ul>
                </div>
            </div>
            <div className="right_container">
                {activeTab === 'invitations' && (
                    <div className="friend_invitation">
                        {/* {listFriendInvite && listFriendInvite.map((user, index) => <FriendInvitationItem key={index} data={user} />)} */}
                        {/* <FriendInvitationItem />
                        <FriendInvitationItem /> */}
                        {/* Thêm các item khác */}
                    </div>
                )}
                {activeTab === 'suggestions' && (
                    <div className="friend_suggest friend_invitation">
                        {allUser && allUser.map((user, index) => <FriendSuggestItem key={index} data={user} />)}
                        {/* Thêm các item khác */}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Friends;
