import { Link } from 'react-router-dom';
import AvatarUser from '../AvatarUser/AvatarUser';
import './NoticeItem.scss';
import { timeAgo } from '../../ultils/formatDate/format_date';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import ToolTip from '../ToolTip/ToolTip';
import { deleteData } from '../../ultils/fetchAPI/fetch_API';
import { API_DELETE_NOTIFICATION_BY_ID } from '../../API/api_server';
import { useLoading } from '../Loading/Loading';
import { Hidden } from '@mui/material';
function NoticeItem({ notification, onClick }) {
    console.log(notification);
    const { showLoading, hideLoading } = useLoading();

    const handleDeleteNotice = async (notice_id, e) => {
        e.preventDefault();
        showLoading();
        try {
            const response = await deleteData(API_DELETE_NOTIFICATION_BY_ID(notice_id));
            if (response.status === true) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error.message);
        }
        hideLoading();
    };
    return (
        <Link to={notification?.target_id} onClick={onClick}>
            <ToolTip
                placement
                title={
                    <div className="btn_delete_notice">
                        <ButtonCustom
                            title="Xoá"
                            className="secondary"
                            onClick={(e) => handleDeleteNotice(notification?.notice_id, e)}
                            startIcon={<RiDeleteBin5Fill />}
                        />
                    </div>
                }
            >
                <div className="action_chat">
                    <div className="notice_item_container">
                        <div className="avatar_notice">
                            <AvatarUser avatar={notification?.avatar} />
                        </div>
                        <div className="content_notice">
                            <div className="title_notice">{notification?.content}</div>
                            <div className="time_notice">{timeAgo(notification?.created_at)}</div>
                        </div>
                    </div>
                </div>
            </ToolTip>
        </Link>
    );
}

export default NoticeItem;
