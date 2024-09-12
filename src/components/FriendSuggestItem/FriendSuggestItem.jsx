import { Link } from 'react-router-dom';
import images from '../../assets/imgs';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
import './FriendSuggestItem.scss';
import config from '../../configs';
import { postData } from '../../ultils/fetchAPI/fetch_API';
import { API_ADD_FRIEND } from '../../API/api_server';
function FriendSuggestItem({ data }) {
    const handleAddFriend = async (event) => {
        event.stopPropagation();
        const response = await postData(API_ADD_FRIEND(data.user_id));
        console.log(response);
    };
    return (
        <Link to={`${config.routes.profile}/${data.user_id}`}>
            <div className="invite_item_container">
                <div className="image_invite">
                    <img src={images.avt} alt="" />
                </div>
                <div className="description_invite">
                    <div className="name_invite">{data.user_name}</div>
                    <div className="count_mutual_friend">100 bạn chung</div>
                    <div className="button_action_invite">
                        <ButtonCustom onClick={handleAddFriend} title="Thêm bạn bè" className="primary" />
                        <ButtonCustom title="Gỡ" className="secondary" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default FriendSuggestItem;
