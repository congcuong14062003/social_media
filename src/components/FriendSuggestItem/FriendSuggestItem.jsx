import { Link, useNavigate } from 'react-router-dom';
import images from '../../assets/imgs';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
import './FriendSuggestItem.scss';
import config from '../../configs';
import { postData, getData } from '../../ultils/fetchAPI/fetch_API';
import { API_ADD_FRIEND, API_CHECK_FRIEND_REQUEST, API_CANCEL_FRIEND_REQUEST, API_CHECK_IF_FRIEND } from '../../API/api_server';
import { useContext, useEffect, useState } from 'react';
import { OwnDataContext } from '../../provider/own_data';

function FriendSuggestItem({ data }) {
    const navigate = useNavigate();
    const [hasRequest, setHasRequest] = useState(false);
    const [isFriend, setIsFriend] = useState(false); // Trạng thái bạn bè
    const dataUser = useContext(OwnDataContext);

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

        const checkIfFriend = async () => {
            try {
                const response = await getData(API_CHECK_IF_FRIEND(data.friend_id));
                setIsFriend(response.isFriend); // Cập nhật trạng thái bạn bè
            } catch (error) {
                console.error('Error checking if friend:', error);
            }
        };

        checkRequestStatus();
        checkIfFriend();
    }, [data.friend_id]);

    // Handle adding or canceling a friend request
    const handleAddFriend = async (event) => {
        event.stopPropagation();
        event.preventDefault();
        try {
            let response;
            if (hasRequest) {
                response = await postData(API_CANCEL_FRIEND_REQUEST(data.friend_id));
                if (response.status === 200) {
                    setHasRequest(false);
                    window.location.reload();
                }
            } else {
                response = await postData(API_ADD_FRIEND(data.friend_id));
                if (response.status === 200) {
                    setHasRequest(true);
                }
            }
        } catch (error) {
            console.error('Error handling friend request:', error);
        }
    };

    // Handle removing friend
    const handleRemoveFriend = async (event) => {
        event.stopPropagation(); // Ngăn không cho sự kiện lan ra ngoài
        try {
            const response = await postData(API_CANCEL_FRIEND_REQUEST(data.friend_id)); // Giả sử bạn có API này
            if (response.status === 200) {
                setIsFriend(false);
                window.location.reload(); // Làm mới danh sách bạn bè
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
                {isFriend ? ( // Kiểm tra nếu là bạn bè
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
                ) : (
                    <ButtonCustom
                        onClick={handleAddFriend}
                        title={hasRequest ? "Huỷ yêu cầu" : "Thêm bạn bè"}
                        className={hasRequest ? "secondary" : "primary"}
                    />
                )}
            </div>
        </div>
    );
}

export default FriendSuggestItem;
