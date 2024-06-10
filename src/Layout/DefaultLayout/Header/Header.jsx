import React, { useState } from 'react';
import './Header.scss';
import images from '../../../assets/imgs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { HomeIcon, MessageIcon, NoticeIcon } from '../../../assets/icons/icons';
import { Link } from 'react-router-dom';
function Header() {
    return (
        <div className="header_container">
            <div className="left_header">
                <div className="logo_website">
                    <img src={images.logo} alt="" />
                </div>
                <div className="search_container">
                    <div className="icon_search">
                        <FontAwesomeIcon fontSize="15px" color="#6e7074" icon={faMagnifyingGlass} />
                    </div>
                    <input type="text" placeholder="Tìm kiếm..." />
                </div>
            </div>
            <div className="center_header">
                <HomeIcon />
            </div>
            <div className="right_header">
                <div className="messenger_icon">
                    <MessageIcon fill="#000" />
                </div>
                <div className="messenger_icon">
                    <NoticeIcon fill="#000" />
                </div>
                <div className="avatar_user">
                    <img src={images.logo} alt="" />
                </div>
            </div>
        </div>
    );
}

export default Header;
