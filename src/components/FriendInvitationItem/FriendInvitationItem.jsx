import { Link, useNavigate } from 'react-router-dom';
import { API_ACCEPT_INVITE, API_CANCEL_FRIEND_REQUEST } from '../../API/api_server';
import { postData } from '../../ultils/fetchAPI/fetch_API';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
import './FriendInvitationItem.scss';
import config from '../../configs';
import { toast } from 'react-toastify';
function FriendInvitationItem({ data }) {
    const navigate = useNavigate();
    const handleAcceptInvite = async (event) => {
        event.stopPropagation();
        const response = await postData(API_ACCEPT_INVITE(data.user_id));
        if (response.status === true) {
            navigate(`${config.routes.friends}/list-friend`);
        }
        console.log(response);
    };
    const handleCancelRequest = async (event) => {
        event.stopPropagation();
        const response = await postData(API_CANCEL_FRIEND_REQUEST(data.friend_id));
        if (response.status === true) {
            navigate(`${config.routes.friends}/suggestion`);
            toast.success("Huỷ lời mời kết bạn thành công");
        }
    };
    return (
        <div className="invite_item_container">
            <Link to={`${config.routes.profile}/${data.user_id}`}>
                <div className="image_invite">
                    <img src={data.avatar_link} alt="" />
                </div>
                <div className="description_invite">
                    <div className="name_invite">{data.user_name}</div>
                    <div className="count_mutual_friend">100 bạn chung</div>
                </div>
            </Link>
            <div className="button_action_invite">
                <ButtonCustom onClick={handleAcceptInvite} title="Xác nhận" className="primary" />
                <ButtonCustom onClick={handleCancelRequest} title="Xoá" className="secondary" />
            </div>
        </div>
    );
}

export default FriendInvitationItem;
