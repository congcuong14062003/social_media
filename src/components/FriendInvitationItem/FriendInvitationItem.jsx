import images from '../../assets/imgs';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
import './FriendInvitationItem.scss';
function FriendInvitationItem({ data }) {
    return (
        <div className="invite_item_container">
            <div className="image_invite">
                <img src={images.avt} alt="" />
            </div>
            <div className="description_invite">
                <div className="name_invite"></div>
                <div className="count_mutual_friend">100 bạn chung</div>
                <div className="button_action_invite">
                    <ButtonCustom title="Xác nhận" className="primary" />
                    <ButtonCustom title="Xoá" className="secondary" />
                </div>
            </div>
        </div>
    );
}

export default FriendInvitationItem;
