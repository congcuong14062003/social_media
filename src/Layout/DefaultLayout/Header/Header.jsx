import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Header.scss';
import images from '../../../assets/imgs';
import { FriendIcon, GroupIcon, HomeIcon, MessageIcon, NoticeIcon, VideoIcon } from '../../../assets/icons/icons';
import { FormControlLabel, Switch, Popover, Typography } from '@mui/material';
import Search from '../../../components/Search/Search';
import AvatarUser from '../../../components/AvatarUser/AvatarUser';
import PrimaryIcon from '../../../components/PrimaryIcon/PrimaryIcon';
import config from '../../../configs';
import PopoverNotice from '../../../components/Popover/PopoverNotice/PopoverNotice';
import PopoverChat from '../../../components/Popover/PopoverChat/PopoverChat';
import PopoverMe from '../../../components/Popover/PopoverMe/PopoverMe';
import { OwnDataContext } from '../../../provider/own_data';

function Header() {
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();
    const handleThemeChange = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
    };

    useEffect(() => {
        const saveDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(saveDarkMode);
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [darkMode]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverContent, setPopoverContent] = useState(null);
    const [activeMessage, setActiveMessage] = useState(false);
    const [activeNotice, setActiveNotice] = useState(false);
    const [activeMe, setActiveMe] = useState(false);

    const handleClickPopover = (event, content) => {
        if (anchorEl && popoverContent) {
            handleClosePopover(); // This will close the current popover
        }
        setAnchorEl(event.currentTarget);
        setPopoverContent(content);
        if (content === 'chat') {
            setActiveMessage(true);
        } else if (content === 'notice') {
            setActiveNotice(true);
        } else if (content === 'me') {
            setActiveMe(true);
        }
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
        setActiveMessage(false);
        setActiveNotice(false);
        setActiveMe(false);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const dataUser = useContext(OwnDataContext);

    return (
        <div className="header_container">
            <div className="left_header">
                <div className="logo_website">
                    <Link to={config.routes.home}>
                        <img src={images.logo} alt="" />
                    </Link>
                </div>
                <Search iconSearch placeholder="Tìm kiếm..." />
            </div>
            <div className="center_header">
                <NavLink
                    to="/"
                    className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : '')}
                >
                    <HomeIcon />
                </NavLink>
                <NavLink
                    to="/friends"
                    className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : '')}
                >
                    <FriendIcon />
                </NavLink>
                <NavLink
                    to="/video"
                    className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : '')}
                >
                    <VideoIcon />
                </NavLink>
            </div>
            <div className="right_header">
                <FormControlLabel
                    value="start"
                    control={
                        <Switch
                            checked={darkMode}
                            onChange={handleThemeChange}
                            color="primary"
                            sx={{ marginRight: '20px' }}
                        />
                    }
                    labelPlacement="start"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '15px', color: '#050505' } }}
                />
                <PrimaryIcon
                    className={activeMessage ? 'active_popover' : ''}
                    icon={<MessageIcon />}
                    onClick={(e) => handleClickPopover(e, 'chat')}
                />
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
                            <PopoverChat />
                        ) : (
                            <PopoverMe />
                        )}
                    </Typography>
                </Popover>
            </div>
        </div>
    );
}

export default Header;
