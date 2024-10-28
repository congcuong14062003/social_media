import React, { useContext } from 'react';
import './PopoverMe.scss';
import { IoMdSettings } from 'react-icons/io';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { deleteData, putData, getData } from '../../../ultils/fetchAPI/fetch_API';
import { API_LOGOUT, API_UPDATE_SETTING_USER, API_GET_INFO_OWNER_PROFILE_BY_ID } from '../../../API/api_server';
import HorizontalItem from '../../HorizontalItem/HorizontalItem';
import PrimaryIcon from '../../PrimaryIcon/PrimaryIcon';
import ToggleButton from 'react-toggle-button';
import Popover from '../Popover';
import config from '../../../configs';
import { OwnDataContext } from '../../../provider/own_data';
import { useSocket } from '../../../provider/socket_context';
function PopoverMe({ darkOn, setDarkOn, handleClosePopover }) {
    const navigate = useNavigate();
    const dataOwner = useContext(OwnDataContext);
    const socket = useSocket()
    const handleLogout = async () => {
        const response = await deleteData(API_LOGOUT);
        if (response.status === true) {
            localStorage.clear();
            if (socket) {
                // Gửi sự kiện "userDisconnected" để thông báo server
                socket.emit('userDisconnected', { user_id: dataOwner?.user_id });
                socket.disconnect(); // Ngắt kết nối socket
            }
            navigate('/login');
        }
    };
    

    return (
        <Popover className="popover_me">
            <div className="popover_me_container">
                <HorizontalItem className="item_user_main" avt={dataOwner?.avatar} title={dataOwner?.user_name} />
                <div className="line"></div>
                <div className="setting_dark_mode">
                    <HorizontalItem
                        dark
                        icon={<PrimaryIcon icon={<FontAwesomeIcon icon={faMoon} />} />}
                        title="Chế độ tối"
                    />
                    <ToggleButton
                        onToggle={() => setDarkOn((prev) => !prev)}
                        value={darkOn}
                        activeLabel="Bật"
                        inactiveLabel="Tắt"
                    />
                </div>
                <HorizontalItem
                    handleClick={handleClosePopover}
                    to={config.routes.setting}
                    icon={<PrimaryIcon icon={<IoMdSettings />} />}
                    title="Cài đặt"
                />
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
