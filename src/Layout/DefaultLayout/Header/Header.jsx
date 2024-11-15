import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.scss';
import images from '../../../assets/imgs';
import { FriendIcon, GroupIcon, HomeIcon, MessageIcon, NoticeIcon, VideoIcon } from '../../../assets/icons/icons';
import { Popover, Typography } from '@mui/material';
import Search from '../../../components/Search/Search';
import AvatarUser from '../../../components/AvatarUser/AvatarUser';
import PrimaryIcon from '../../../components/PrimaryIcon/PrimaryIcon';
import config from '../../../configs';
import PopoverNotice from '../../../components/Popover/PopoverNotice/PopoverNotice';
import PopoverChat from '../../../components/Popover/PopoverChat/PopoverChat';
import PopoverMe from '../../../components/Popover/PopoverMe/PopoverMe';
import { OwnDataContext } from '../../../provider/own_data';
import { useDispatch } from 'react-redux';
import { darkHandle, lightHandle } from '../../../redux/Reducer/reducer';
import { useSocket } from '../../../provider/socket_context';
import ToggleButton from 'react-toggle-button';
import SideBarMobile from '../../SideBarMobile/SideBarMobile';

function Header() {
    const dataUser = useContext(OwnDataContext);
    const privateKey = localStorage.getItem('private-key');
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverContent, setPopoverContent] = useState(null);
    const [activeMessage, setActiveMessage] = useState(false);
    const [activeNotice, setActiveNotice] = useState(false);
    const [activeMe, setActiveMe] = useState(false);
    const dataOwner = useContext(OwnDataContext);
    const [darkOn, setDarkOn] = useState(dataOwner?.dark_theme === 1);
    const socket = useSocket();
    const dispatch = useDispatch();
    // Cập nhật dark theme trên server mỗi khi darkOn thay đổi
    useEffect(() => {
        if (socket && dataOwner) {
            socket.emit('dark_theme', {
                user_id: dataOwner?.user_id,
                dark_theme: darkOn ? 1 : 0,
            });
        }
    }, [darkOn, socket, dataOwner]);

    // Đồng bộ trạng thái darkOn với dữ liệu từ context
    useEffect(() => {
        setDarkOn(dataOwner?.dark_theme === 1);
    }, [dataOwner]);

    // Cập nhật Redux store mỗi khi darkOn thay đổi
    useEffect(() => {
        if (darkOn) {
            dispatch(darkHandle());
        } else {
            dispatch(lightHandle());
        }
    }, [darkOn, dispatch]);

    const handleClickPopover = (event, content) => {
        setAnchorEl(event.currentTarget);
        setPopoverContent(content);
        setActiveMessage(content === 'chat');
        setActiveNotice(content === 'notice');
        setActiveMe(content === 'me');
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
        setActiveMessage(false);
        setActiveNotice(false);
        setActiveMe(false);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const getReceiverId = (receiverId) => {
        
    };
    return (
        <div className="header_container">
            <div className="left_header">
                <div className="logo_website">
                    <Link to={config.routes.home}>
                        <img src={images.logo} alt="Logo" />
                    </Link>
                </div>
                <Search iconSearch placeholder="Tìm kiếm..." />
            </div>
            <div className="center_header">
                <NavLink to={config.routes.home} className={({ isActive }) => (isActive ? 'active' : '')}>
                    <HomeIcon />
                </NavLink>
                <NavLink to={config.routes.friends} className={({ isActive }) => (isActive ? 'active' : '')}>
                    <FriendIcon />
                </NavLink>
                <NavLink to={config.routes.messages} className={({ isActive }) => (isActive ? 'active' : '')}>
                    <MessageIcon />
                </NavLink>
                <NavLink to={config.routes.group} className={({ isActive }) => (isActive ? 'active' : '')}>
                    <GroupIcon />
                </NavLink>
            </div>
            <div className="right_header">
                <div className="navbar_mobile">
                    <SideBarMobile />
                </div>
                {privateKey && (
                    <PrimaryIcon
                        className={activeMessage ? 'active_popover' : ''}
                        icon={<MessageIcon />}
                        onClick={(e) => handleClickPopover(e, 'chat')}
                    />
                )}

                <PrimaryIcon
                    className={activeNotice ? 'active_popover' : ''}
                    icon={<NoticeIcon />}
                    onClick={(e) => handleClickPopover(e, 'notice')}
                />
                <div className="avatar_me" onClick={(e) => handleClickPopover(e, 'me')}>
                    <AvatarUser avatar={dataUser?.avatar} />
                </div>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClosePopover}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: -4,
                        horizontal: 'left',
                    }}
                    classes={{ paper: 'popover_custom' }}
                >
                    <Typography sx={{ p: 0 }}>
                        {popoverContent === 'notice' ? (
                            <PopoverNotice />
                        ) : popoverContent === 'chat' ? (
                            privateKey && (
                                <PopoverChat setReceiverId={getReceiverId} privateKey={privateKey} handleClosePopover={handleClosePopover} />
                            )
                        ) : (
                            <PopoverMe darkOn={darkOn} setDarkOn={setDarkOn} handleClosePopover={handleClosePopover} />
                        )}
                    </Typography>
                </Popover>
            </div>
        </div>
    );
}

export default Header;
