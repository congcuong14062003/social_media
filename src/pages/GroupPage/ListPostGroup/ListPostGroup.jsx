import React, { useEffect, useState } from 'react';
import './ListPostGroup.scss';
import { Link, useParams } from 'react-router-dom';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { FaLayerGroup } from 'react-icons/fa6';
import { getData } from '../../../ultils/fetchAPI/fetch_API';
import { API_LIST_GROUP_ACCEPTED_POST, API_LIST_GROUP_BY_OWNER } from '../../../API/api_server';
import PostItem from '../../../components/PostItem/PostItem';
import GroupItem from '../../../components/GroupItem/group_item';
import ButtonCustom from '../../../components/ButtonCustom/ButtonCustom';
function ListPostGroup() {
    const [dataGroup, setDataGroup] = useState([]);
    const { group_id } = useParams();
    const [listPostGroup, setListPostGroup] = useState(null);
    useEffect(() => {
        const icon = document.querySelector('.icon-gr');
        const sideLeft = document.querySelector('.side-left');
        const handleToggle = () => {
            sideLeft.classList.toggle('active');
        };
        icon.addEventListener('click', handleToggle);
        return () => {
            if (icon) {
                icon.removeEventListener('click', handleToggle);
            }
        };
    }, []);

    useEffect(() => {
        const getAllGroupByOwner = async () => {
            const response = await getData(API_LIST_GROUP_BY_OWNER);
            if (response.status) {
                setDataGroup(response.data);
            }
        };
        getAllGroupByOwner();
    }, []);
    // useEffect(() => {
    //     const getAllGroupPost = async () => {
    //         try {
    //             const response = await getData(API_LIST_GROUP_ACCEPTED_POST(group_id));
    //             if (response?.status) {
    //                 setListPostGroup(response?.data);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching group detail:', error);
    //         }
    //     };
    //     getAllGroupPost();
    // }, [group_id]);
    // console.log(group_id);
    
    return (
        <div className="list_group_container">
            <div className="list-post-group">
                <div className="container">
                    <FaLayerGroup className="icon-gr" />

                    <div className="side-left">
                        <ul className="list-gr">
                            <h2>Nhóm của bạn</h2>
                            <Link className="create-gr" to="/group/create">
                                <ButtonCustom startIcon={<MdOutlineGroupAdd />} title="Tạo nhóm" />

                                {/* <h5>Tạo nhóm</h5> */}
                            </Link>
                            {dataGroup.length > 0 &&
                                dataGroup.map((data, index) => <GroupItem key={index} group_id={data?.group_id} />)}
                        </ul>
                    </div>
                    <div className="side-right">
                        <ul className="list-gr">
                            {/* {listPostGroup?.map((data, index) => (
                                <PostItem key={index} dataPost={data} />
                            ))} */}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListPostGroup;
