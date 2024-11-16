import React, { useEffect, useState } from 'react';
import './GroupAdminMemberPage.scss';
import { MdAdminPanelSettings, MdDateRange, MdOutlineGroupOff } from 'react-icons/md';
import { FaAngleLeft, FaFileCircleCheck, FaPeopleGroup } from 'react-icons/fa6';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { Link, useParams } from 'react-router-dom';
import GroupHeader from '../../../Layout/GroupHeader/GroupHeader';
import config from '../../../configs';
import ButtonCustom from '../../../components/ButtonCustom/ButtonCustom';
import { API_LIST_FRIEND } from '../../../API/api_server';
import { getData } from '../../../ultils/fetchAPI/fetch_API';
import HorizontalItem from '../../../components/HorizontalItem/HorizontalItem';

function GroupAdminMemberPage() {
    const { group_id } = useParams();
    const [listGroup, setListGroup] = useState([]);

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
        <div className="group-admin-members">
            <div className="group-wrapper container">
                <div className="group-container">
                    <GroupHeader group_id={group_id} classNameActive={'admin'} />
                    <div className="group_main_container">
                        <div className="group-main">
                            <div className="group-left">
                                <Link to={`${config.routes.group}/${group_id}/admin`}>
                                    <div className="title-direct--post box">
                                        <FaAngleLeft />
                                        <p>Quản lý bài viết</p>
                                    </div>
                                </Link>
                                <div className="title-content box">
                                    <h3>Quản lý thành viên (1500)</h3>
                                </div>
                                <form action="" method="get">
                                    <input type="text" placeholder="&#x1F50D; Nhập tên hoặc biệt danh thành viên" />
                                </form>
                                {listFriend?.map((data) => (
                                    <div className="action-member--admin">
                                        <div className="action-member">
                                            <div className="btn-action btn-accept">
                                                <ButtonCustom
                                                    startIcon={<MdAdminPanelSettings />}
                                                    className="primary"
                                                    title="Đặt làm quản trị viên"
                                                />
                                            </div>
                                            <div className="btn-action btn-delete">
                                                <ButtonCustom
                                                    startIcon={<MdOutlineGroupOff />}
                                                    className="secondary"
                                                    title="Khai trừ"
                                                />
                                            </div>
                                        </div>
                                        {/* <SuggestItem /> */}
                                        <HorizontalItem avt={data?.avatar_link} title={data?.user_name} />
                                    </div>
                                ))}
                            </div>
                            <div className="group-right">
                                <div className="title-intro box">
                                    <h3>Thống kê bài viết</h3>
                                    <div className="info-short--item info-school">
                                        <MdDateRange />
                                        100.000 bài viết (+3 bài viết hôm nay)
                                    </div>
                                    <div className="info-short--item info-address">
                                        <FaPeopleGroup />
                                        100.000 thành viên (+5 thành viên hôm nay)
                                    </div>
                                </div>
                                <div className="title-content box">
                                    <h3>Yêu cầu gia nhập (1500)</h3>
                                </div>

                                <form action="" method="get">
                                    <input type="text" placeholder="&#x1F50D; Nhập tên hoặc biệt danh người dùng" />
                                </form>
                                <div className="action-member--admin">
                                    <div className="action-member">
                                        <div className="btn-action btn-accept">
                                            <FaFileCircleCheck />
                                            <p>Phê duyệt</p>
                                        </div>
                                        <div className="btn-action btn-delete">
                                            <RiDeleteBin5Fill />
                                            <p>Xóa</p>
                                        </div>
                                    </div>
                                    {/* <SuggestItem /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupAdminMemberPage;
