import React, { useContext, useEffect, useState } from 'react';
import './GroupHeader.scss';
import { MdGroupAdd } from 'react-icons/md';
import { MdGroupRemove } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { FaUserLock } from 'react-icons/fa';
import { FaFacebookMessenger } from 'react-icons/fa6';
import { IoQrCodeOutline } from 'react-icons/io5';
import { FcInvite } from 'react-icons/fc';
// import QRCodePopup from "../../component/QRCode/qr_code";
import { API_CHECK_ROLE_MEMBER_GROUP, API_GROUP_DETAIL, API_INVITE_MEMBER_GROUP } from '../../API/api_server';
import { getData, postData } from '../../ultils/fetchAPI/fetch_API';
import ButtonCustom from '../../components/ButtonCustom/ButtonCustom';
import QRCodePopup from '../../components/QRCode/QRCodePopup';
import { useSocket } from '../../provider/socket_context';
import { OwnDataContext } from '../../provider/own_data';
import config from '../../configs';

function GroupHeader({ classNameActive, group_id }) {
    const [showQRCodePopup, setShowQRCodePopup] = useState(false);
    const socket = useSocket();
    const dataOwner = useContext(OwnDataContext);
    const [statusMember, setStatusMember] = useState({
        isInvite: false,
        isMember: false,
        isAdmin: false,
    });
    const [dataGroup, setDataGroup] = useState();
    useEffect(() => {
        try {
            const getGroupDetail = async () => {
                const response = await getData(API_GROUP_DETAIL(group_id));
                if (response?.status) {
                    setDataGroup(response?.data);
                }
            };
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

            getGroupDetail();
            checkRole();
        } catch (error) {
            console.error(error.message);
        }
    }, [group_id]);
    const handleQRCodeClick = () => {
        setShowQRCodePopup(true);
    };

    const handleClosePopup = () => {
        setShowQRCodePopup(false);
    };

    const currentURL = window.location.href;
    useEffect(() => {
        const listNavigation = document.querySelectorAll('.group-navigation a li');
        listNavigation.forEach((navigation) => {
            if (navigation.classList.contains(classNameActive)) {
                document.querySelector('.group-navigation a li.active').classList.remove('active');
                navigation.classList.add('active');
            }
        });
    }, [classNameActive, statusMember]);

    const handleSendInvited = async () => {
        try {
            const response = await postData(API_INVITE_MEMBER_GROUP(group_id));
            if (response?.status) {
                socket.emit('join_group', {
                    group_id: group_id,
                    sender_id: dataOwner?.user_id,
                    link_notice: `${config.routes.group}/${group_id}/admin/members`,
                    content: `${dataOwner?.user_name} muốn vào nhóm ${dataGroup?.group_name} của bạn`,
                    created_at: new Date().toISOString(),
                });
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleCancelInvited = async () => {};
    console.log(statusMember);

    return (
        <div className="group-header--main">
            <div className="group-header--container">
                <div className="group-header">
                    <div className="cover_image">
                        <Link target="blank">
                            <img src={dataGroup?.cover_media_link} alt="" />
                        </Link>
                    </div>
                    <div className="group-avatar--img">
                        <img src={dataGroup?.avatar_media_link} alt="" />
                        <div className="header-container">
                            <div className="info-analyst">
                                <h1 className="name">{dataGroup?.group_name}</h1>
                                <div className="analyst">
                                    <p
                                        className="private"
                                        style={{
                                            margin: '5px 0',
                                        }}
                                    >
                                        <FaUserLock />
                                        {dataGroup?.group_privacy === 1 ? 'Nhóm công khai' : 'Nhóm riêng tư'}
                                    </p>
                                </div>
                            </div>
                            <div className="btn-action">
                                {/* <IoQrCodeOutline onClick={handleQRCodeClick} className="code-qr" />
                                <QRCodePopup show={showQRCodePopup} url={currentURL} onClose={handleClosePopup} /> */}
                                {(statusMember?.isAdmin || statusMember?.isMember) && (
                                    <Link>
                                        <div className="btn btn-messenger">
                                            <ButtonCustom
                                                startIcon={<FaFacebookMessenger />}
                                                // className="secondary"
                                                title="Nhắn tin"
                                            />
                                        </div>
                                    </Link>
                                )}
                                <div
                                    className={`btn btn-add--gr ${
                                        statusMember.isAdmin || statusMember.isMember ? 'active' : ''
                                    }`}
                                >
                                    {statusMember.isAdmin || statusMember.isMember ? (
                                        <>
                                            <ButtonCustom
                                                startIcon={<MdGroupRemove />}
                                                className="secondary"
                                                title="Rời nhóm"
                                            />
                                        </>
                                    ) : statusMember.isInvite ? (
                                        <div onClick={handleCancelInvited}>
                                            <ButtonCustom
                                                startIcon={<FcInvite />}
                                                className="secondary"
                                                title="Huỷ lời mời"
                                            />
                                        </div>
                                    ) : (
                                        <div onClick={handleSendInvited}>
                                            <ButtonCustom
                                                startIcon={<MdGroupAdd />}
                                                className="primary"
                                                title="Tham gia nhóm"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ul className="group-navigation">
                    <Link to={`/group/${group_id}`}>
                        <li className="group-navigation--item post active">Bài viết</li>
                    </Link>
                    <Link to={`/group/${group_id}/members`}>
                        <li className="group-navigation--item members">Thành viên</li>
                    </Link>
                    {statusMember?.isAdmin && (
                        <Link to={`/group/${group_id}/admin`}>
                            <li className="group-navigation--item admin">Quản trị nhóm</li>
                        </Link>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default GroupHeader;
