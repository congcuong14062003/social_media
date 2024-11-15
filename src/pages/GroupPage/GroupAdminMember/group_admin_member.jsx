import React, { useEffect, useState } from "react";
import "./group_admin_member.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import PostItem from "../../../layout/ListPosts/PostItem/post_item";
import GroupHeader from "../../../layout/GroupHeader/group_header";
import { MdAdminPanelSettings, MdDateRange, MdOutlineGroupOff } from "react-icons/md";
import { FaAngleLeft, FaFileCircleCheck, FaPeopleGroup } from "react-icons/fa6";
import { RiDeleteBin5Fill } from "react-icons/ri";
import SuggestItem from "../../../layout/SideBarRight/Suggest/SuggestItem/suggest_item";
import { Link } from "react-router-dom";

function GroupAdminMemberPage({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    return (
        <React.Fragment>
            <div className="group-admin-members">
                <NavigativeBar />
                <div className="group-wrapper container">
                    <div className="group-container">
                        <GroupHeader classNameActive={"admin"} />
                        <div className="group-main">
                            <div className="group-left">
                                <Link to="/group/123/admin">
                                    <div className="title-direct--post box">
                                        <FaAngleLeft />
                                        <p>
                                            Quản lý bài viết
                                        </p>
                                    </div>
                                </Link>
                                <div className="title-content box">
                                    <h3>
                                        Quản lý thành viên (1500)
                                    </h3>
                                </div>
                                <form action="" method="get">
                                    <input type="text" placeholder="&#x1F50D; Nhập tên hoặc biệt danh thành viên" />
                                </form>

                                <div className="action-member--admin">
                                    <div className="action-member">
                                        <div className="btn-action btn-accept"><MdAdminPanelSettings /><p>Đặt làm quản trị viên</p></div>
                                        <div className="btn-action btn-delete"><MdOutlineGroupOff /><p>Khai trừ</p></div>
                                    </div>
                                    <SuggestItem />
                                </div>






                            </div>
                            <div className="group-right">
                                <div className="title-intro box">
                                    <h3>
                                        Thống kê bài viết
                                    </h3>
                                    <div className="info-short--item info-school"><MdDateRange />100.000 bài viết (+3 bài viết hôm nay)
                                    </div>
                                    <div className="info-short--item info-address"><FaPeopleGroup />100.000 thành viên (+5 thành viên hôm nay)</div>

                                </div>
                                <div className="title-content box">
                                    <h3>
                                        Yêu cầu gia nhập (1500)
                                    </h3>
                                </div>

                                <form action="" method="get">
                                    <input type="text" placeholder="&#x1F50D; Nhập tên hoặc biệt danh người dùng" />
                                </form>

                                <div className="action-member--admin">
                                    <div className="action-member">
                                        <div className="btn-action btn-accept"><FaFileCircleCheck /><p>Phê duyệt</p></div>
                                        <div className="btn-action btn-delete"><RiDeleteBin5Fill /><p>Xóa</p></div>
                                    </div>
                                    <SuggestItem />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default GroupAdminMemberPage;