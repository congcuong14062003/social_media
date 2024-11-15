import React, { useEffect, useState } from 'react';
import './GroupHome.scss';
import { MdDateRange } from 'react-icons/md';
import { FaPeopleGroup } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';
import CreatePost from '../../../components/CreatePost/CreatePost';
import PostItem from '../../../components/PostItem/PostItem';
import GroupHeader from '../../../Layout/GroupHeader/GroupHeader';
function GroupHomePage() {
    const { group_id } = useParams();
    return (
        <div className="group-dom">
            <div className="group-wrapper container">
                <div className="group-container">
                    <GroupHeader group_id={group_id} classNameActive={'post'} />
                    <div className="group_main_container">
                        <div className="group-main">
                            <div className="group-left">
                                <CreatePost />
                                <div className="title-content box">
                                    <h3>Bài viết</h3>
                                </div>
                                <PostItem />
                                <PostItem />
                            </div>
                            <div className="group-right">
                                <div className="title-intro box">
                                    <h3>Giới thiệu</h3>
                                    <div className="slogan">
                                        Tuyền Văn Hóa - Vlogger với những góc nhìn độc đáo về bóng đá trong nước & Quốc
                                        tế
                                    </div>
                                    <div className="info-short--item info-school">
                                        <MdDateRange />
                                        Tạo ngày: <b>29/05/2024</b>
                                    </div>
                                    <div className="info-short--item info-address">
                                        <FaPeopleGroup />
                                        Thành viên nhóm: <b> 100.000 </b> thành viên
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
