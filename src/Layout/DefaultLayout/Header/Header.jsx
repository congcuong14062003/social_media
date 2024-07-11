import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.scss';
import images from '../../../assets/imgs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { GroupIcon, HomeIcon, MessageIcon, NoticeIcon, VideoIcon } from '../../../assets/icons/icons';
import { FormControlLabel, Switch } from '@mui/material';
import Search from '../../../components/Search/Search';
import AvatarUser from '../../../components/AvatarUser/AvatarUser';

function Header() {
    const [darkMode, setDarkMode] = useState(false);

    const handleThemeChange = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
    };
    useEffect(() => {
        const saveDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(saveDarkMode);
    });
    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [darkMode]);
    return (
        <div className="header_container">
            <div className="left_header">
                <div className="logo_website">
                    <img src={images.logo} alt="" />
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
                    to="/video"
                    className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : '')}
                >
                    <VideoIcon />
                </NavLink>
                <NavLink
                    to="/group"
                    className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : '')}
                >
                    <GroupIcon />
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
                    // label="Chế độ tối"
                    labelPlacement="start"
                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '15px', color: '#050505' } }}
                />
                <div className="messenger_icon">
                    <MessageIcon fill="#000" />
                </div>
                <div className="messenger_icon notice">
                    <NoticeIcon fill="#000" />
                </div>
                <AvatarUser />
            </div>
        </div>
    );
}

export default Header;
