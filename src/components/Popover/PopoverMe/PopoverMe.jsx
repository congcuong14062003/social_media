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
function PopoverMe() {
    return (
        <Popover className="popover_me" title="">
            <div className="popover_me_container">
                <HorizontalItem className="item_user_main" avt={<AvatarUser />} title="Dương mạnh" />
                <div className='line'></div>
                <HorizontalItem icon={<PrimaryIcon icon={<IoMdSettings />} />} title="Cài đặt" />
                <HorizontalItem icon={<PrimaryIcon icon={<IoMdSettings />} />} title="Đăng xuất" />

            </div>
        </Popover>
    );
}

export default PopoverMe;
