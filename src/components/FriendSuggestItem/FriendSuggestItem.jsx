import { Link } from 'react-router-dom';
import images from '../../assets/imgs';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
import './FriendSuggestItem.scss';
import config from '../../configs';
import { postData, getData } from '../../ultils/fetchAPI/fetch_API';
import { API_ADD_FRIEND, API_CHECK_FRIEND_REQUEST, API_CANCEL_FRIEND_REQUEST } from '../../API/api_server';
import { useContext, useEffect, useState } from 'react';
import { OwnDataContext } from '../../provider/own_data';

function FriendSuggestItem({ data }) {
    const [hasRequest, setHasRequest] = useState(false);
    const dataUser = useContext(OwnDataContext);

    // Check if there's an existing friend request when component mounts
    useEffect(() => {
        const checkRequestStatus = async () => {
            try {
                const response = await getData(API_CHECK_FRIEND_REQUEST(data.user_id));
                setHasRequest(response.hasRequest);
            } catch (error) {
                console.error('Error checking friend request status:', error);
            }
        };

        checkRequestStatus();
    }, [data.user_id]);

    // Handle adding or canceling a friend request
    const handleAddFriend = async (event) => {
        event.stopPropagation();
        event.preventDefault();

        try {
            let response;

            if (hasRequest) {
                response = await postData(API_CANCEL_FRIEND_REQUEST(data.user_id));
                if (response.success) {
                    setHasRequest(false);
                }
            } else {
                response = await postData(API_ADD_FRIEND(data.user_id));
                if (response.success) {
                    setHasRequest(true);
                }
            }
        } catch (error) {
            console.error('Error handling friend request:', error);
        }
    };

    return (
        <div className="invite_item_container">
            <Link to={`${config.routes.profile}/${data.user_id}`}>
                <div className="image_invite">
                    <img src={images.avt} alt="" />
                </div>
                <div className="description_invite">
                    <div className="name_invite">{data.user_name}</div>
                    <div className="count_mutual_friend">100 bạn chung</div>
                    <div className="button_action_invite">
                        <ButtonCustom
                            onClick={handleAddFriend}
                            title={hasRequest ? "Huỷ yêu cầu" : "Thêm bạn bè"}
                            className={hasRequest ? "secondary" : "primary"}
                        />
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default FriendSuggestItem;
