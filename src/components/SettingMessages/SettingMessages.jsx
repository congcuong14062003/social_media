import { Link } from 'react-router-dom';
import { BlockIcon, SearchIcon, UserIcon } from '../../assets/icons/icons';
import AvatarUser from '../AvatarUser/AvatarUser';
import PrimaryIcon from '../PrimaryIcon/PrimaryIcon';
import './SettingMessages.scss';
import { Search } from '@mui/icons-material';
import ToolTip from '../ToolTip/ToolTip';
function SettingMessages() {
    return (
        <div className="setting_message_container">
            <div className="receiver_infor">
                <div className="avatar_receiver">
                    <AvatarUser />
                </div>
                <div className="name_receiver">Nguyễn Nhật</div>

                <div className="action_sender">
                    <Link>
                        <div className="profile_receiver">
                            <ToolTip title="Trang cá nhân">
                                <PrimaryIcon icon={<UserIcon />} />
                            </ToolTip>
                        </div>
                    </Link>
                    <div className="search_messages">
                        <ToolTip title="Tìm kiếm">
                            <PrimaryIcon icon={<SearchIcon />} />
                        </ToolTip>
                    </div>
                </div>
            </div>
            <div className="list_action">
                <div className="item_action">
                    <BlockIcon /><span>Chặn</span>
                </div>
            </div>
        </div>
    );
}

export default SettingMessages;
