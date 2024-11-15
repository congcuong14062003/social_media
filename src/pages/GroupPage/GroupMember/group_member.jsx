import React, { useEffect, useState } from "react";
import "./group_member.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import PostItem from "../../../layout/ListPosts/PostItem/post_item";
import GroupHeader from "../../../layout/GroupHeader/group_header";
import { MdDateRange } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import FormPost from "../../../component/FormPost/form_post";
import ListSuggest from "../../../layout/SideBarRight/Suggest/list_suggest";
import { CgPushChevronLeft, CgPushChevronRight } from "react-icons/cg";
import SuggestItem from "../../../layout/SideBarRight/Suggest/SuggestItem/suggest_item";


function GroupMemberPage({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    return (
        <React.Fragment>
            <div className="group-dom--members">
                <NavigativeBar />
                <div className="group-wrapper container">
                    <div className="group-container">
                        <GroupHeader classNameActive={"members"} />
                        <div className="group-main">
                        <h3 className="title">Thành viên nhóm</h3>
                        <form action="" method="get">
                            <input type="text" placeholder="&#x1F50D; Nhập tên hoặc biệt danh của thành viên"/>
                        </form>

                            <h3 className="box">Quản trị viên (4)</h3>
                            <ul className="list-members">
                                <ListSuggest />

                            </ul>
                            <div className="temp"></div>
                            <h3 className="box">Thành viên nhóm (1334)</h3>
                            <ul className="list-members">
                                <ListSuggest />
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default GroupMemberPage;