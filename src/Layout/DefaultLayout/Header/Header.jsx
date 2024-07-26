import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Header.scss';
import images from '../../../assets/imgs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { GroupIcon, HomeIcon, MessageIcon, NoticeIcon, VideoIcon } from '../../../assets/icons/icons';
import { FormControlLabel, Switch } from '@mui/material';
import Search from '../../../components/Search/Search';
import AvatarUser from '../../../components/AvatarUser/AvatarUser';
import PrimaryIcon from '../../../components/PrimaryIcon/PrimaryIcon';
import config from '../../../configs';
import ButtonCustom from '../../../components/ButtonCustom/ButtonCustom';

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
    });
    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [darkMode]);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/users/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                navigate('/login'); // Chuyển hướng về trang login ngay lập tức
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('There was a problem with the logout request:', error);
        }
    };
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
                <ButtonCustom title="đăng xuất" onClick={handleLogout} />
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

                <PrimaryIcon icon={<MessageIcon />} />
                <PrimaryIcon icon={<NoticeIcon />} />

                <AvatarUser />
            </div>
        </div>
    );
}

export default Header;
