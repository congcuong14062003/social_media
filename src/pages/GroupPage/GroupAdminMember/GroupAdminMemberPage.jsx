import React, { useContext, useEffect, useState } from 'react';
import './GroupAdminMemberPage.scss';
import { MdAdminPanelSettings, MdDateRange, MdOutlineGroupOff } from 'react-icons/md';
import { FaAngleLeft, FaFileCircleCheck, FaPeopleGroup } from 'react-icons/fa6';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { Link, useParams } from 'react-router-dom';
import GroupHeader from '../../../Layout/GroupHeader/GroupHeader';
import config from '../../../configs';
import ButtonCustom from '../../../components/ButtonCustom/ButtonCustom';
import {
    API_ACCEPT_INVITE_MEMBER_GROUP,
    API_LIST_FRIEND,
    API_LIST_GROUP_ACCEPTED_POST,
    API_LIST_MEMBERS_OFFICAL_GROUP,
    API_LIST_MEMBERS_UNAPPROVED_GROUP,
    API_REFUSE_INVITE_MEMBER_GROUP,
    API_SET_ADMIN_MEMBER_GROUP,
} from '../../../API/api_server';
import { getData, postData } from '../../../ultils/fetchAPI/fetch_API';
import HorizontalItem from '../../../components/HorizontalItem/HorizontalItem';
import { toast } from 'react-toastify';
import { OwnDataContext } from '../../../provider/own_data';
import { useSocket } from '../../../provider/socket_context';

function GroupAdminMemberPage() {
    const { group_id } = useParams();
    const [listMemberOffical, setListMemberOffical] = useState([]);
    const [listUnapproved, setListUnapproved] = useState([]);
    const [listAcceptedPostGroup, setListAcceptedPostGroup] = useState(null);
    const socket = useSocket();

    const dataOwner = useContext(OwnDataContext);
    useEffect(() => {
        const getListMemberOffical = async () => {
            try {
                const response = await getData(API_LIST_MEMBERS_OFFICAL_GROUP(group_id));
                // Kiểm tra nếu response và response.users tồn tại
                if (response.status) {
                    setListMemberOffical(response?.data);
                } else {
                    setListMemberOffical([]); // Nếu không có dữ liệu, đặt thành mảng rỗng
                }
            } catch (error) {
                console.error('Error fetching friends:', error);
                setListMemberOffical([]); // Xử lý lỗi bằng cách đặt mảng rỗng
            }
        };
        getListMemberOffical();
    }, [group_id]);
    console.log(listMemberOffical);
    // danh sách bài viết đã đc duyệt
    useEffect(() => {
        const getAllGroupAcceptedPost = async () => {
            try {
                const response = await getData(API_LIST_GROUP_ACCEPTED_POST(group_id));
                if (response?.status) {
                    setListAcceptedPostGroup(response?.data);
                }
            } catch (error) {
                console.error('Error fetching group detail:', error);
            }
        };
        getAllGroupAcceptedPost();
    }, [group_id]);
    useEffect(() => {
        const listUnapprovedMembers = async () => {
            try {
                const response = await getData(API_LIST_MEMBERS_UNAPPROVED_GROUP(group_id));
                // Kiểm tra nếu response và response.users tồn tại
                console.log(response);
                if (response.status === true) {
                    setListUnapproved(response?.data);
                } else {
                    setListUnapproved([]); // Nếu không có dữ liệu, đặt thành mảng rỗng
                }
            } catch (error) {
                console.error('Error fetching friends:', error);
                setListUnapproved([]); // Xử lý lỗi bằng cách đặt mảng rỗng
            }
        };
        listUnapprovedMembers();
    }, [group_id]);
    // chấp nhận lời mời
    const handleAcceptJoinGroup = async (member_id) => {
        const response = await postData(API_ACCEPT_INVITE_MEMBER_GROUP(group_id), {
            member_id,
        });
        if (response.status) {
            socket.emit('accepted_join_group', {
                group_id: group_id,
                sender_id: dataOwner?.user_id,
                receiver_id: member_id,
                link_notice: `${config.routes.group}/${group_id}`,
                content: `${dataOwner?.user_name} đã chấp nhận bạn tham gia nhóm`,
                created_at: new Date().toISOString(),
            });
            window.location.reload();
        }
    };
    // từ chối lời mời
    const handleRefuseJoinGroup = async (member_id) => {
        const response = await postData(API_REFUSE_INVITE_MEMBER_GROUP(group_id), {
            member_id,
        });
        if (response.status) {
            socket.emit('decline_join_group', {
                group_id: group_id,
                sender_id: dataOwner?.user_id,
                receiver_id: member_id,
                link_notice: `${config.routes.group}/${group_id}`,
                content: `${dataOwner?.user_name} đã từ chối bạn tham gia nhóm`,
                created_at: new Date().toISOString(),
            });
            window.location.reload();
        }
    };
    const handleSetAdmin = async (member_id, user_name) => {
        const response = await postData(API_SET_ADMIN_MEMBER_GROUP(group_id), {
            member_id,
        });
        if (response.status) {
            toast.success(`Bạn đã cho ${user_name} làm quản trị nhóm`);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };
    const handleKickMember = async (member_id, user_name) => {
        const response = await postData(API_REFUSE_INVITE_MEMBER_GROUP(group_id), {
            member_id,
        });
        if (response.status) {
            toast.success(`Bạn đã xoá ${user_name} khỏi nhóm nhóm`);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };
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
                                    <h3>Quản lý thành viên ({listMemberOffical?.length} thành viên)</h3>
                                </div>
                                <form action="" method="get">
                                    <input type="text" placeholder="&#x1F50D; Nhập tên hoặc biệt danh thành viên" />
                                </form>
                                {listMemberOffical?.map((data) => (
                                    <div className="action-member--admin">
                                        <div className="action-member">
                                            {dataOwner?.user_id !== data?.member_id && (
                                                <>
                                                    <div className="btn-action btn-accept">
                                                        <ButtonCustom
                                                            onClick={() =>
                                                                handleSetAdmin(data?.member_id, data?.user_name)
                                                            }
                                                            startIcon={<MdAdminPanelSettings />}
                                                            className="primary"
                                                            title="Đặt làm quản trị viên"
                                                        />
                                                    </div>
                                                    <div className="btn-action btn-delete">
                                                        <ButtonCustom
                                                            onClick={() =>
                                                                handleKickMember(data?.member_id, data?.user_name)
                                                            }
                                                            startIcon={<MdOutlineGroupOff />}
                                                            className="secondary"
                                                            title="Khai trừ"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {/* <SuggestItem /> */}
                                        <HorizontalItem
                                            to={`${config.routes.profile}/${data?.member_id}`}
                                            avt={data?.avatar}
                                            title={data?.user_name}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="group-right">
                                <div className="title-intro box">
                                    <h3>Thống kê bài viết</h3>
                                    <div className="info-short--item info-school">
                                        <MdDateRange />
                                        {listAcceptedPostGroup?.length} bài viết
                                    </div>
                                    <div className="info-short--item info-address">
                                        <FaPeopleGroup />
                                        {listMemberOffical?.length} thành viên
                                    </div>
                                </div>
                                <div className="title-content box">
                                    <h3>Yêu cầu gia nhập ({listUnapproved?.length})</h3>
                                </div>

                                <form action="" method="get">
                                    <input type="text" placeholder="&#x1F50D; Nhập tên hoặc biệt danh người dùng" />
                                </form>
                                {listUnapproved?.map((data, index) => (
                                    <div className="action-member--admin">
                                        <div className="action-member">
                                            <div
                                                className="btn-action btn-accept"
                                                onClick={() => handleAcceptJoinGroup(data?.member_id)}
                                            >
                                                <ButtonCustom
                                                    className="primary"
                                                    title="Phê duyệt"
                                                    startIcon={<FaFileCircleCheck />}
                                                />
                                            </div>
                                            <div
                                                className="btn-action btn-delete"
                                                onClick={() => handleRefuseJoinGroup(data?.member_id)}
                                            >
                                                <ButtonCustom
                                                    className="secondary"
                                                    title="Từ chối"
                                                    startIcon={<RiDeleteBin5Fill />}
                                                />
                                            </div>
                                        </div>
                                        <HorizontalItem avt={data?.avatar} title={data?.user_name} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupAdminMemberPage;
