import { Link, useNavigate } from 'react-router-dom';
import { API_ACCEPT_INVITE, API_CANCEL_FRIEND_REQUEST } from '../../API/api_server';
import { postData } from '../../ultils/fetchAPI/fetch_API';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
import './FriendInvitationItem.scss';
import config from '../../configs';
import { toast } from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import { OwnDataContext } from '../../provider/own_data';
import { getMutualFriends } from '../../services/fetch_api';
import { useSocket } from '../../provider/socket_context';
function FriendInvitationItem({ data }) {
    console.log(data);
    const [countMutual, setCountMutual] = useState();
    const [listFriendMutuals, setListFriendMutuals] = useState([]);
    const dataOwner = useContext(OwnDataContext);
    const navigate = useNavigate();
    const socket = useSocket();

    const handleAcceptInvite = async (event) => {
        event.stopPropagation();
        const response = await postData(API_ACCEPT_INVITE(data?.user_id));
        if (response.status === true) {
            socket.emit('accepted_friend', {
                sender_id: dataOwner?.user_id,
                receiver_id: data?.user_id,
                content: `${dataOwner?.user_name} đã chấp nhận lời mời kết bạn`,
                link_notice: `${config.routes.friends}/list-friend`,
                created_at: new Date().toISOString(),
            });
            navigate(`${config.routes.friends}/list-friend`);
        }
        console.log(response);
    };
    const handleCancelRequest = async (event) => {
        event.stopPropagation();
        const response = await postData(API_CANCEL_FRIEND_REQUEST(data?.user_id));
        if (response.status === true) {
            socket.emit('declined_friend', {
                sender_id: dataOwner?.user_id,
                receiver_id: data?.user_id,
                content: `${dataOwner?.user_name} đã từ chối lời mời kết bạn`,
                link_notice: `${config.routes.friends}/suggestion`,
                created_at: new Date().toISOString(),
            });
            navigate(`${config.routes.friends}/suggestion`);
        }
    };
    useEffect(() => {
        if (!data?.user_id) return;

        const fetchFriends = async () => {
            if (dataOwner && dataOwner.user_id !== data?.user_id) {
                try {
                    const response = await getMutualFriends(dataOwner?.user_id, data?.user_id);
                    setListFriendMutuals(response);
                    setCountMutual(response?.length);
                } catch (error) {
                    console.error('Failed to fetch friends:', error);
                }
            }
        };
        fetchFriends();
    }, [dataOwner, data?.user_id]);
    return (
        <div className="invite_item_container">
            <Link to={`${config.routes.profile}/${data.user_id}`}>
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
                <ButtonCustom onClick={handleAcceptInvite} title="Xác nhận" className="primary" />
                <ButtonCustom onClick={handleCancelRequest} title="Xoá" className="secondary" />
            </div>
        </div>
    );
}

export default FriendInvitationItem;
