import config from '../../../configs';
import ChatItem from '../../ChatItem/ChatItem';
import FriendItem from '../../Friend/FriendItem/FriendItem';
import PrimaryIcon from '../../PrimaryIcon/PrimaryIcon';
import Search from '../../Search/Search';
import Popover from '../Popover';
import { IoMdSettings } from 'react-icons/io';
import './PopoverMe.scss';
import HorizontalItem from '../../HorizontalItem/HorizontalItem';
import AvatarUser from '../../AvatarUser/AvatarUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { deleteData } from '../../../ultils/fetchAPI/fetch_API';
import { API_LOGOUT } from '../../../API/api_server';
function PopoverMe() {
    const navigate = useNavigate();
    const handleLogout = async () => {
        const respone = await deleteData(API_LOGOUT)
        if (respone.status === 200) {
            navigate('/login');
        }
    }
    return (
        <Popover className="popover_me" title="">
            <div className="popover_me_container">
                <HorizontalItem className="item_user_main" avt={<AvatarUser />} title="Dương mạnh" />
                <div className='line'></div>
                <HorizontalItem dark icon={<PrimaryIcon icon={<FontAwesomeIcon icon={faMoon} />} />} title="Chế độ tối" />
                <HorizontalItem icon={<PrimaryIcon icon={<IoMdSettings />} />} title="Cài đặt" />
                <HorizontalItem handleClick={handleLogout} icon={<PrimaryIcon icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />} />} title="Đăng xuất" />

            </div>
        </Popover>
    );
}

export default PopoverMe;
