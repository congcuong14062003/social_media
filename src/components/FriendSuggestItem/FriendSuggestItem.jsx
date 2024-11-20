import { Link, useNavigate } from 'react-router-dom';
import images from '../../assets/imgs';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
import './FriendSuggestItem.scss';
import config from '../../configs';
import { postData, getData } from '../../ultils/fetchAPI/fetch_API';
import {
    API_ADD_FRIEND,
    API_CHECK_FRIEND_REQUEST,
    API_CANCEL_FRIEND_REQUEST,
    API_CHECK_IF_FRIEND,
} from '../../API/api_server';
import { useContext, useEffect, useState } from 'react';
import { OwnDataContext } from '../../provider/own_data';
import { getMutualFriends } from '../../services/fetch_api';
import { useSocket } from '../../provider/socket_context';

function FriendSuggestItem({ data }) {
    const navigate = useNavigate();
    const [hasRequest, setHasRequest] = useState(false);
    const [isFriend, setIsFriend] = useState(false); // Trạng thái bạn bè
    const dataOwner = useContext(OwnDataContext);
    const [countMutual, setCountMutual] = useState();
    const [listFriendMutuals, setListFriendMutuals] = useState([]);
    const socket = useSocket();

    // Kiểm tra trạng thái yêu cầu bạn bè khi component được mount
    useEffect(() => {
        const checkRequestStatus = async () => {
            try {
                const response = await getData(API_CHECK_FRIEND_REQUEST(data.friend_id));
                setHasRequest(response.hasRequest);
            } catch (error) {
                console.error('Error checking friend request status:', error);
            }
        };
        checkRequestStatus();
    }, [data.friend_id]);

    // Thêm bạn bè
    const handleAddFriend = async (event) => {
        event.stopPropagation();
        event.preventDefault();
        try {
            let response;
            if (hasRequest) {
                response = await postData(API_CANCEL_FRIEND_REQUEST(data.friend_id));
                if (response.status === true) {
                    setHasRequest(false);
                    navigate(`${config.routes.friends}/suggestion`);
                }
            } else {
                response = await postData(API_ADD_FRIEND(data.friend_id));
                if (response.status === true) {
                    socket.emit('add_friend', {
                        sender_id: dataOwner?.user_id,
                        receiver_id: data.friend_id,
                        content: `${dataOwner?.user_name} đã gửi cho bạn lời mời kết bạn`,
                        link_notice: `${config.routes.friends}/invitations`,
                        created_at: new Date().toISOString(),
                    });
                    setHasRequest(true);
                    navigate(`${config.routes.friends}/invited`);
                }
            }
        } catch (error) {
            console.error('Error handling friend request:', error);
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
                {/* {isFriend ? ( // Kiểm tra nếu là bạn bè
                    <>
                        <ButtonCustom
                            onClick={handleRemoveFriend}
                            title="Xóa bạn bè"
                            className="secondary"
                        />
                        <ButtonCustom
                            onClick={(event) => {
                                event.stopPropagation(); // Ngăn không cho sự kiện lan ra ngoài
                                navigate(`/messages/${data.friend_id}`); // Điều hướng đến trang nhắn tin
                            }}
                            title="Nhắn tin"
                            className="primary"
                        />
                    </>
                ) : ( */}
                <ButtonCustom
                    onClick={handleAddFriend}
                    title={hasRequest ? 'Huỷ yêu cầu' : 'Thêm bạn bè'}
                    className={hasRequest ? 'secondary' : 'primary'}
                />
                {/* )} */}
            </div>
        </div>
    );
}

export default FriendSuggestItem;
