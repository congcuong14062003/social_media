import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import HorizontalItem from '../../components/HorizontalItem/HorizontalItem';
import PrimaryIcon from '../../components/PrimaryIcon/PrimaryIcon';
import { HiUserAdd } from 'react-icons/hi';
import { FaUser, FaUserCheck } from 'react-icons/fa';
import './Friends.scss';
function Friends() {
    const location = useLocation();
    return (
        <div className="friend_home_container">
            <div className="left_container">
                <div className="content">
                    <ul className="list_items_left">
                        <li>
                            <Link to="suggestion">
                                <HorizontalItem
                                    to="suggestion"
                                    icon={<PrimaryIcon icon={<FaUser />} />}
                                    title="Gợi ý" 
                                    isActive={location.pathname.includes('suggestion')} // Kiểm tra đường dẫn hiện tại
                                />
                            </Link>
                        </li>
                        <li>
                            <Link to="invitations">
                                <HorizontalItem
                                    to="invitations"
                                    icon={<PrimaryIcon icon={<HiUserAdd />} />}
                                    title="Lời mời kết bạn"
                                    isActive={location.pathname.includes('invitations')} // Kiểm tra đường dẫn
                                />
                            </Link>
                        </li>
                        <li>
                            <Link to="list-friend">
                                <HorizontalItem
                                    to="list-friend"
                                    icon={<PrimaryIcon icon={<FaUserCheck />} />}
                                    title="Bạn bè"
                                    isActive={location.pathname.includes('list-friend')} // Kiểm tra đường dẫn
                                />
                            </Link>
                        </li>
                        <li>
                            <Link to="invited">
                                <HorizontalItem
                                    to="invited"
                                    icon={<PrimaryIcon icon={<HiUserAdd />} />}
                                    title="Lời mời đã gửi"
                                    isActive={location.pathname.includes('invited')} // Kiểm tra đường dẫn
                                />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="right_container">
                {/* Outlet sẽ render các component con tương ứng */}
                <Outlet />
            </div>
        </div>
    );
}

export default Friends;
