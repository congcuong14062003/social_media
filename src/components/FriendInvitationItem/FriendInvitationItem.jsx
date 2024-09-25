import { Link } from 'react-router-dom';
import { API_ACCEPT_INVITE } from '../../API/api_server';
import images from '../../assets/imgs';
import { postData } from '../../ultils/fetchAPI/fetch_API';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
import './FriendInvitationItem.scss';
import config from '../../configs';
function FriendInvitationItem({ data }) {
    const handleAcceptInvite = async (event) => {
        event.stopPropagation();
        const response = await postData(API_ACCEPT_INVITE(data.user_id));
        console.log(response);
    };
    return (
        // <div className="invite_item_container">
        //     <div className="image_invite">
        //         <img src={data.avatar} alt="" />
        //     </div>
        //     <div className="description_invite">
        //         <div className="name_invite">{data.user_name}</div>
        //         <div className="count_mutual_friend">100 bạn chung</div>
        //         <div className="button_action_invite">
        //             <ButtonCustom onClick={handleAcceptInvite} title="Xác nhận" className="primary" />
        //             <ButtonCustom title="Xoá" className="secondary" />
        //         </div>
        //     </div>
        // </div>
        <div className="invite_item_container">
            <Link to={`${config.routes.profile}/${data.user_id}`}>
                <div className="image_invite">
                    <img src={data.avatar} alt="" />
                </div>
                <div className="description_invite">
                    <div className="name_invite">{data.user_name}</div>
                    <div className="count_mutual_friend">100 bạn chung</div>
                </div>
            </Link>
            <div className="button_action_invite">
                <ButtonCustom onClick={handleAcceptInvite} title="Xác nhận" className="primary" />
                <ButtonCustom title="Xoá" className="secondary" />
            </div>
        </div>
    );
}

export default FriendInvitationItem;
