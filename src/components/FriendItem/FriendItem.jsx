import { Link, useNavigate } from 'react-router-dom';
import images from '../../assets/imgs';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
import './FriendItem.scss';
import config from '../../configs';
import { postData } from '../../ultils/fetchAPI/fetch_API';
import {
    API_CANCEL_FRIEND_REQUEST,
} from '../../API/api_server';
import { useContext, useEffect, useState } from 'react';
import { OwnDataContext } from '../../provider/own_data';
import { getMutualFriends } from '../../services/fetch_api';


function FriendItem({ data }) {
    const navigate = useNavigate();
    const [countMutual, setCountMutual] = useState();
    const [listFriendMutuals, setListFriendMutuals] = useState([]);
    const dataOwner = useContext(OwnDataContext);
    // Handle removing friend
    const handleRemoveFriend = async (event) => {
        event.stopPropagation(); // Ngăn không cho sự kiện lan ra ngoài
        try {
            const response = await postData(API_CANCEL_FRIEND_REQUEST(data?.friend_id)); // Giả sử bạn có API này
            if (response.status === true) {
                navigate(`${config.routes.friends}/suggestion`);
            }
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    };
    useEffect(() => {
        if (!data?.friend_id) return;

        const fetchFriends = async () => {
            if (dataOwner && dataOwner.user_id !== data?.friend_id) {
                try {
                    const response = await getMutualFriends(dataOwner?.user_id, data?.friend_id);
                    setListFriendMutuals(response);
                    setCountMutual(response?.length);
                } catch (error) {
                    console.error('Failed to fetch friends:', error);
                }
            }
        };
        fetchFriends();
    }, [dataOwner, data?.friend_id]);
    return (
        <div className="invite_item_container">
            <Link to={`${config.routes.profile}/${data.friend_id}`}>
                <div className="image_invite">
                    <img src={data.avatar_link} alt="" />
                </div>
                <div className="description_invite">
                    <div className="name_invite">{data.user_name}</div>
                    <div className="count_mutual_friend">
                        {' '}
                        <div className="list_friend_mutual">
                            {listFriendMutuals.map((item, index) => (
                                <Link key={index} to={`${config.routes.profile}/${item?.friend_id}`}>
                                    <img src={item?.avatar_link} />
                                </Link>
                            ))}
                        </div>
                        {countMutual} bạn chung
                    </div>
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
