import { Link, useNavigate } from 'react-router-dom';
import images from '../../assets/imgs';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
import './FriendItem.scss';
import config from '../../configs';
import { postData } from '../../ultils/fetchAPI/fetch_API';
import {
    API_CANCEL_FRIEND_REQUEST,
} from '../../API/api_server';


function FriendItem({ data }) {
    const navigate = useNavigate();
    // Handle removing friend
    const handleRemoveFriend = async (event) => {
        event.stopPropagation(); // Ngăn không cho sự kiện lan ra ngoài
        try {
            const response = await postData(API_CANCEL_FRIEND_REQUEST(data.friend_id)); // Giả sử bạn có API này
            if (response.status === 200) {
                navigate(`${config.routes.friends}/suggestion`);
            }
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    };

    return (
        <div className="invite_item_container">
            <Link to={`${config.routes.profile}/${data.friend_id}`}>
                <div className="image_invite">
                    <img src={data.avatar_link} alt="" />
                </div>
                <div className="description_invite">
                    <div className="name_invite">{data.user_name}</div>
                    <div className="count_mutual_friend">100 bạn chung</div>
                </div>
            </Link>
            <div className="button_action_invite">
                <>
                    <ButtonCustom onClick={handleRemoveFriend} title="Xóa bạn bè" className="secondary" />
                    <ButtonCustom
                        onClick={(event) => {
                            event.stopPropagation(); // Ngăn không cho sự kiện lan ra ngoài
                            navigate(`/messages/${data.friend_id}`); // Điều hướng đến trang nhắn tin
                        }}
                        title="Nhắn tin"
                        className="primary"
                    />
                </>
            </div>
        </div>
    );
}

export default FriendItem;
