import React, { useEffect, useState } from 'react';
import './GroupMember.scss';
import { useParams } from 'react-router-dom';
import GroupHeader from '../../../Layout/GroupHeader/GroupHeader';
function GroupMemberPage({ titlePage }) {
    const { group_id } = useParams();

    return (
        <div className="group-dom--members">
            <div className="group-wrapper container">
                <div className="group-container">
                    <GroupHeader group_id={group_id} classNameActive={'members'} />
                    <div className="group_main_container">
                        <div className="group-main">
                            <h3 className="title">Thành viên nhóm</h3>
                            <form action="" method="get">
                                <input type="text" placeholder="&#x1F50D; Nhập tên hoặc biệt danh của thành viên" />
                            </form>

                            <h3 className="box">Quản trị viên (4)</h3>
                            <ul className="list-members">{/* <ListSuggest /> */}</ul>
                            <div className="temp"></div>
                            <h3 className="box">Thành viên nhóm (1334)</h3>
                            <ul className="list-members">{/* <ListSuggest /> */}</ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupMemberPage;
