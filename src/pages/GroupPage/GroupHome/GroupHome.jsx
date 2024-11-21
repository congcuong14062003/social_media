import React, { useEffect, useState } from 'react';
import './GroupHome.scss';
import { MdDateRange } from 'react-icons/md';
import { FaPeopleGroup } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';
import CreatePost from '../../../components/CreatePost/CreatePost';
import PostItem from '../../../components/PostItem/PostItem';
import GroupHeader from '../../../Layout/GroupHeader/GroupHeader';
import {
    API_CHECK_ROLE_MEMBER_GROUP,
    API_GROUP_DETAIL,
    API_LIST_GROUP_ACCEPTED_POST,
    API_LIST_GROUP_UNAPPROVED_POST,
} from '../../../API/api_server';
import { getData } from '../../../ultils/fetchAPI/fetch_API';
import { formatDate, formatJoinDate } from '../../../ultils/formatDate/format_date';
import { toast } from 'react-toastify';
function GroupHomePage() {
    const { group_id } = useParams();
    const [dataGroup, setDataGroup] = useState(null);
    const [listPostGroup, setListPostGroup] = useState(null);
    const navigate = useNavigate();
    const [statusMember, setStatusMember] = useState({
        isInvite: false,
        isMember: false,
        isAdmin: false,
    });
    useEffect(() => {
        const fetchGroupDetail = async () => {
            if (!group_id) return;
            try {
                const response = await getData(API_GROUP_DETAIL(group_id));
                if (response?.status) {
                    setDataGroup(response.data);
                }
            } catch (error) {
                console.error('Error fetching group detail:', error);
            }
        };
        fetchGroupDetail();
    }, [group_id]);

    console.log(group_id);

    useEffect(() => {
        const getAllGroupPost = async () => {
            if (!group_id) return;
            try {
                const response = await getData(API_LIST_GROUP_ACCEPTED_POST(group_id));
                if (response?.status) {
                    setListPostGroup(response?.data);
                } else {
                    navigate(-1);
                    // toast.error('Bạn không có quyền truy cập bài viết');
                }
            } catch (error) {
                console.error('Error fetching group detail:', error);
            }
        };
        getAllGroupPost();
    }, [group_id]);
    useEffect(() => {
        try {
            // const getGroupDetail = async () => {
            //     const response = await getData(API_GROUP_DETAIL(group_id));
            //     if (response?.status) {
            //         setDataGroup(response?.data);
            //     }
            // };
            const checkRole = async () => {
                const response = await getData(API_CHECK_ROLE_MEMBER_GROUP(group_id));
                if (!response?.status) {
                    return setStatusMember({
                        isInvite: false,
                        isMember: false,
                        isAdmin: false,
                    });
                }
                if (!response?.data) return;
                const { member_status, member_role } = response?.data;
                if (member_status === 0) {
                    setStatusMember({ isInvite: true, isMember: false, isAdmin: false });
                } else if (member_status === 1) {
                    setStatusMember({
                        isInvite: false,
                        isMember: member_role === 0,
                        isAdmin: member_role === 1,
                    });
                }
            };

            // getGroupDetail();
            checkRole();
        } catch (error) {
            console.error(error.message);
        }
    }, [group_id]);
    return (
        <div className="group-dom">
            <div className="group-wrapper container">
                <div className="group-container">
                    <GroupHeader group_id={group_id} classNameActive={'post'} />
                    <div className="group_main_container">
                        <div className="group-main">
                            <div className="group-left">
                                {(statusMember?.isMember || statusMember?.isAdmin) && (
                                    <CreatePost group_id={group_id} />
                                )}
                                <div className="title-content box">
                                    <h3>Bài viết</h3>
                                </div>
                                {listPostGroup?.map((data, index) => {
                                    return <PostItem dataPost={data} />;
                                })}
                            </div>
                            <div className="group-right">
                                <div className="title-intro box">
                                    <h3>Giới thiệu</h3>
                                    <div className="slogan">{dataGroup?.group_slogan}</div>
                                    <div className="info-short--item info-school">
                                        <MdDateRange />
                                        Ngày tạo nhóm: <b>{formatDate(dataGroup?.created_at, 'dd/mm/yy')}</b>
                                    </div>
                                    <div className="info-short--item info-address">
                                        <FaPeopleGroup />
                                        Thành viên nhóm: <b> {dataGroup?.member_count} </b> thành viên
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupHomePage;
