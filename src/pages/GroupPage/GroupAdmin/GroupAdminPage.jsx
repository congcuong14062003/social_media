import React, { useEffect, useState } from 'react';
import './GroupAdminPage.scss';
import { MdDateRange, MdGroupOff } from 'react-icons/md';
import { FaFileCircleCheck, FaPeopleGroup, FaPeopleLine } from 'react-icons/fa6';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { Link, useParams } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import GroupHeader from '../../../Layout/GroupHeader/GroupHeader';
import PostItem from '../../../components/PostItem/PostItem';
import config from '../../../configs';
import { deleteData, getData, postData } from '../../../ultils/fetchAPI/fetch_API';
import {
    API_ACCEPT_GROUP_POST,
    API_DELETE_GROUP,
    API_LIST_GROUP_ACCEPTED_POST,
    API_LIST_GROUP_UNAPPROVED_POST,
    API_LIST_MEMBERS_OFFICAL_GROUP,
    API_REFUSE_GROUP_POST,
} from '../../../API/api_server';
import { useLoading } from '../../../components/Loading/Loading';
import ButtonCustom from '../../../components/ButtonCustom/ButtonCustom';

function GroupAdminPage() {
    const { showLoading, hideLoading } = useLoading();
    const [listUnapprovedPostGroup, setListUnapprovedPostGroup] = useState(null);
    const [listAcceptedPostGroup, setListAcceptedPostGroup] = useState(null);
    const [listMemberOffical, setListMemberOffical] = useState([]);
    console.log(listUnapprovedPostGroup);

    const { group_id } = useParams();
    const handleDeleteGroup = async () => {
        showLoading();
        const response = await deleteData(API_DELETE_GROUP(group_id));
        if (response?.status) {
            window.location.href = config.routes.group;
        }
        hideLoading();
    };
    // danh sách bài viết chưa đc duyệt
    useEffect(() => {
        const getAllGroupUnapprovedPost = async () => {
            try {
                const response = await getData(API_LIST_GROUP_UNAPPROVED_POST(group_id));
                if (response?.status) {
                    setListUnapprovedPostGroup(response?.data);
                }
            } catch (error) {
                console.error('Error fetching group detail:', error);
            }
        };
        getAllGroupUnapprovedPost();
    }, [group_id]);
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

    const handleAcceptedPost = async (group_post_id) => {
         showLoading()
        const response = await postData(API_ACCEPT_GROUP_POST(group_id), {
            status_post: '1',
            group_post_id,
        });
        if (response.status) {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        hideLoading();
    };
    const handleRefusedPost = async (group_post_id) => {
        showLoading()
        const response = await postData(API_REFUSE_GROUP_POST(group_id), { status_post: '0', group_post_id });
        if (response.status) {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        hideLoading();
    };
    return (
        <div className="group-admin">
            <div className="group-wrapper container">
                <div className="group-container">
                    <GroupHeader group_id={group_id} classNameActive={'admin'} />
                    <div className="group_main_container">
                        <div className="group-main">
                            <div className="group-left">
                                <div className="title-content box">
                                    <h3>Phê duyệt bài viết ({listUnapprovedPostGroup?.length})</h3>
                                </div>
                                <form action="" method="get">
                                    <input
                                        type="text"
                                        placeholder="&#x1F50D; Nhập tên thành viên đăng bài hoặc nội dung bài viết"
                                    />
                                </form>
                                {listUnapprovedPostGroup?.map((data, index) => (
                                    <div key={index} className="action-post--admin">
                                        <div className="action-post">
                                            <div className="btn-action btn-accept">
                                                <ButtonCustom
                                                    onClick={() => handleAcceptedPost(data?.group_post_id)}
                                                    title="Phê duyệt"
                                                    className="primary"
                                                    startIcon={<FaFileCircleCheck />}
                                                />
                                            </div>
                                            <div className="btn-action btn-delete">
                                                <ButtonCustom
                                                    onClick={() => handleRefusedPost(data?.group_post_id)}
                                                    title="Từ chối"
                                                    className="secondary"
                                                    startIcon={<RiDeleteBin5Fill />}
                                                />
                                            </div>
                                        </div>
                                        <PostItem dataPost={data} />;
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
                                <Link to={`${config.routes.group}/${group_id}/admin/edit`}>
                                    <div className="title-direct-member info box">
                                        <p>Sửa thông tin nhóm</p>
                                        <FaInfoCircle />
                                    </div>
                                </Link>
                                <Link to={`${config.routes.group}/${group_id}/admin/members`}>
                                    <div className="title-direct-member box">
                                        <p>Quản lý thành viên</p>
                                        <FaPeopleLine />
                                    </div>
                                </Link>

                                <Link to="">
                                    <div onClick={handleDeleteGroup} className="title-direct-member delete box">
                                        <p>Giải tán nhóm</p>
                                        <MdGroupOff />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupAdminPage;
