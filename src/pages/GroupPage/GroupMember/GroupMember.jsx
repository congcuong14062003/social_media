import React, { useEffect, useState } from 'react';
import './GroupMember.scss';
import { useParams } from 'react-router-dom';
import GroupHeader from '../../../Layout/GroupHeader/GroupHeader';
import HorizontalItem from '../../../components/HorizontalItem/HorizontalItem';
import { API_LIST_MEMBERS_OFFICAL_GROUP } from '../../../API/api_server';
import { getData } from '../../../ultils/fetchAPI/fetch_API';
function GroupMemberPage({ titlePage }) {
    const { group_id } = useParams();
    const [listMemberOffical, setListMemberOffical] = useState([]);
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

                            <h3 className="box">Quản trị viên ({listMemberOffical?.filter(data => data?.member_role === 1).length})</h3>
                            <ul className="list-members">
                                {listMemberOffical?.map((data, index) => {
                                    if (data?.member_role === 1) {
                                        return <HorizontalItem title={data?.user_name} avt={data?.avatar} />;
                                    } 
                                    return null;
                                })}
                            </ul>
                            <div className="temp"></div>
                            <h3 className="box">Thành viên nhóm ({listMemberOffical?.length})</h3>
                            <ul className="list-members">
                                {listMemberOffical?.map((data, index) => {
                                    return <HorizontalItem title={data?.user_name} avt={data?.avatar} />;
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupMemberPage;
