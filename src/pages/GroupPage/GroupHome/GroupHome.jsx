import React, { useEffect, useState } from 'react';
import './GroupHome.scss';
import { MdDateRange } from 'react-icons/md';
import { FaPeopleGroup } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';
import CreatePost from '../../../components/CreatePost/CreatePost';
import PostItem from '../../../components/PostItem/PostItem';
import GroupHeader from '../../../Layout/GroupHeader/GroupHeader';
import { API_GROUP_DETAIL, API_LIST_GROUP_UNAPPROVED_POST } from '../../../API/api_server';
import { getData } from '../../../ultils/fetchAPI/fetch_API';
function GroupHomePage() {
    const { group_id } = useParams();
    const [dataGroup, setDataGroup] = useState(null);
    const [listPostGroup, setListPostGroup] = useState(null);
    useEffect(() => {
        const fetchGroupDetail = async () => {
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
        <div className="group-dom">
            <div className="group-wrapper container">
                <div className="group-container">
                    <GroupHeader group_id={group_id} classNameActive={'post'} />
                    <div className="group_main_container">
                        <div className="group-main">
                            <div className="group-left">
                                <CreatePost group_id={group_id} />
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
                                        Tạo ngày: <b>{dataGroup?.created_at}</b>
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
