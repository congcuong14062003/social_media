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
import { deleteData, getData } from '../../../ultils/fetchAPI/fetch_API';
import { API_DELETE_GROUP, API_LIST_GROUP_UNAPPROVED_POST } from '../../../API/api_server';
import { useLoading } from '../../../components/Loading/Loading';
import ButtonCustom from '../../../components/ButtonCustom/ButtonCustom';

function GroupAdminPage() {
    const { showLoading, hideLoading } = useLoading();
    const [listPostGroup, setListPostGroup] = useState(null);

    const { group_id } = useParams();
    const handleDeleteGroup = async () => {
        showLoading();
        const response = await deleteData(API_DELETE_GROUP(group_id));
        if (response?.status) {
            window.location.href = config.routes.group;
        }
        hideLoading();
    };
    useEffect(() => {
        const getAllGroupPost = async () => {
            try {
                const response = await getData(API_LIST_GROUP_UNAPPROVED_POST(group_id));
                if (response?.status) {
                    setListPostGroup(response?.data);
                }
            } catch (error) {
                console.error('Error fetching group detail:', error);
            }
        };
        getAllGroupPost();
    }, [group_id]);
    return (
        <div className="group-admin">
            <div className="group-wrapper container">
                <div className="group-container">
                    <GroupHeader group_id={group_id} classNameActive={'admin'} />
                    <div className="group_main_container">
                        <div className="group-main">
                            <div className="group-left">
                                <div className="title-content box">
                                    <h3>Phê duyệt bài viết (15)</h3>
                                </div>
                                <form action="" method="get">
                                    <input
                                        type="text"
                                        placeholder="&#x1F50D; Nhập tên thành viên đăng bài hoặc nội dung bài viết"
                                    />
                                </form>
                                {listPostGroup?.map((data, index) => (
                                    <div key={index} className="action-post--admin">
                                        <div className="action-post">
                                            <div className="btn-action btn-accept">
                                                <ButtonCustom title="Phê duyệt" className="primary" startIcon={<FaFileCircleCheck />} />
                                            </div>
                                            <div className="btn-action btn-delete">
                                                <ButtonCustom title="Xóa bài" className="secondary" startIcon={<RiDeleteBin5Fill />} />
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
                                        100.000 bài viết (+3 bài viết hôm nay)
                                    </div>
                                    <div className="info-short--item info-address">
                                        <FaPeopleGroup />
                                        100.000 thành viên (+5 thành viên hôm nay)
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
