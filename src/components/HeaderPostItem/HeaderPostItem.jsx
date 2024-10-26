import './HeaderPostItem.scss';
import { Link } from 'react-router-dom';
import AvatarUser from '../AvatarUser/AvatarUser';
import ToolTip from '../ToolTip/ToolTip';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
import { MdDelete, MdModeEditOutline } from 'react-icons/md';
import config from '../../configs';
import { timeAgo } from '../../ultils/formatDate/format_date';
import images from '../../assets/imgs';
import { useContext, useState } from 'react';
import { OwnDataContext } from '../../provider/own_data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deleteData } from '../../ultils/fetchAPI/fetch_API';
import { API_DELETE_POST } from '../../API/api_server';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
function HeaderPostItem({ dataPost, setShowEditPost }) {
    // const [showEditPost, setShowEditPost] = useState(false);
    const dataOwner = useContext(OwnDataContext);

    const emoji_post = dataPost?.react_emoji ? JSON.parse(dataPost.react_emoji) : null;

    const handlEditPost = () => {
        setShowEditPost(true);
    };
    const handleDeletePost = async () => {
        try {
            const response = await deleteData(API_DELETE_POST(dataPost?.post_id));
            if (response.status === true) {
                // Xóa bài viết qua WebSocket
                // socket.emit('deletePost', dataPost?.post_id);
                // alert('Bài viết đã được xoá');
                window.location.reload(); // Reload lại trang
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };
    return (
        <div className="header_post_container">
            <div className="user_post">
                <Link to={`${config.routes.profile}/${dataPost?.user_id}`}>
                    <div className="user_post_detai">
                        <AvatarUser avatar={dataPost?.avatar} />
                        <div className="infor_user_post">
                            <div className="user_name_post">
                                {dataPost?.user_name}{' '}
                                {emoji_post ? `Đang cảm thấy ${emoji_post?.label} ${emoji_post?.icon}` : ''}
                            </div>
                            <div className="time_post">
                                {timeAgo(dataPost?.created_at)}
                                <ToolTip title={dataPost?.post_privacy === 1 ? 'Công khai' : 'Chỉ mình tôi'}>
                                    <img
                                        src={
                                            dataPost?.post_privacy === 1
                                                ? images.global // Public
                                                : dataPost?.post_privacy === 0
                                                ? images.private // Private
                                                : images.global
                                        }
                                        alt=""
                                    />
                                </ToolTip>
                            </div>
                        </div>
                    </div>
                </Link>

                {dataOwner?.user_id === dataPost?.user_id && (
                    <div className="action_user_post">
                        <FontAwesomeIcon icon={faEllipsis} />
                        <div className="action_user_post_detail">
                            <ButtonCustom
                                startIcon={<MdModeEditOutline />}
                                title="Chỉnh sửa"
                                className="primary"
                                onClick={handlEditPost}
                            />
                            <ButtonCustom
                                onClick={handleDeletePost}
                                startIcon={<MdDelete />}
                                title="Xoá"
                                className="secondary"
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className="title_post">{dataPost?.post_text}</div>
        </div>
    );
}

export default HeaderPostItem;
