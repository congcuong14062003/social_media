import React, { useContext, useState, useEffect } from 'react';
import './PopoverMe.scss';
import { IoMdSettings } from 'react-icons/io';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { deleteData, putData, getData } from '../../../ultils/fetchAPI/fetch_API';
import { API_LOGOUT, API_UPDATE_SETTING_USER, API_GET_INFO_OWNER_PROFILE_BY_ID } from '../../../API/api_server';
import { OwnDataContext } from '../../../provider/own_data';
import { useDispatch } from 'react-redux';
import { darkHandle, lightHandle } from '../../../redux/Reducer/reducer';
import HorizontalItem from '../../HorizontalItem/HorizontalItem';
import PrimaryIcon from '../../PrimaryIcon/PrimaryIcon';
import ToggleButton from 'react-toggle-button';
import Popover from '../Popover';
import config from '../../../configs';

function PopoverMe({handleClosePopover}) {
    const navigate = useNavigate();
    const dataUser = useContext(OwnDataContext);
    const [darkOn, setDarkOn] = useState(dataUser?.dark_theme === 1);
    const dispatch = useDispatch();

    // Đồng bộ state với Redux và DOM khi darkOn thay đổi
    useEffect(() => {
        setDarkOn(dataUser?.dark_theme === 1);
    }, [dataUser]);

    useEffect(() => {
        if (darkOn) {
            dispatch(darkHandle());
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            dispatch(lightHandle());
            document.documentElement.removeAttribute('data-theme');
        }
    }, [darkOn, dispatch]);

    const handleLogout = async () => {
        const response = await deleteData(API_LOGOUT);
        if (response.status === true) {
            localStorage.clear();
            navigate('/login');
        }
    };

    const updateDarkMode = async () => {
        const newTheme = darkOn ? 0 : 1; // Đổi giá trị cho chế độ tối/sáng
        const result = await putData(API_UPDATE_SETTING_USER, { dark_theme: newTheme });

        if (result.status === true) {
            setDarkOn(!darkOn); // Cập nhật state sau khi API thành công
            window.location.reload();
        } else {
            console.error('Cập nhật thất bại!');
        }
    };
    
    return (
        <Popover className="popover_me">
            <div className="popover_me_container">
                <HorizontalItem
                    className="item_user_main"
                    avt={dataUser?.avatar}
                    title={dataUser?.user_name}
                />
                <div className="line"></div>
                <div className="setting_dark_mode">
                    <HorizontalItem
                        dark
                        icon={<PrimaryIcon icon={<FontAwesomeIcon icon={faMoon} />} />}
                        title="Chế độ tối"
                    />
                    <ToggleButton
                        value={darkOn}
                        onToggle={updateDarkMode} // Chỉ cập nhật khi nhấn toggle
                        activeLabel="Bật"
                        inactiveLabel="Tắt"
                    />
                </div>
                <HorizontalItem handleClick={handleClosePopover} to={config.routes.setting} icon={<PrimaryIcon icon={<IoMdSettings />} />} title="Cài đặt" />
                <HorizontalItem
                    handleClick={handleLogout}
                    icon={<PrimaryIcon icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />} />}
                    title="Đăng xuất"
                />
            </div>
        </Popover>
    );
}

export default PopoverMe;
