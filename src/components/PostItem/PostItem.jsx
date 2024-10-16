import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import images from '../../assets/imgs';
import AvatarUser from '../AvatarUser/AvatarUser';
import './PostItem.scss';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { CuoiIcon } from '../../assets/icons/icons';
import { PiShareFatLight } from 'react-icons/pi';
import { FaRegComment } from 'react-icons/fa6';
import { AiOutlineLike } from 'react-icons/ai';
import { AiFillLike } from 'react-icons/ai';
import Search from '../Search/Search';
import ArticleLoader from '../../skeleton/article_loader';
import { useContext, useEffect, useState } from 'react';
import InstagramStyle from '../../skeleton/insta_style';
import DevtoCard from '../../skeleton/dev_to_card';
import ClassicPostLoader from '../../skeleton/classic_post_loader';
import BlogItem from '../../skeleton/blog_item';
import { timeAgo } from '../../ultils/formatDate/format_date';
import ToolTip from '../ToolTip/ToolTip';
import { OwnDataContext } from '../../provider/own_data';
import { getData, postData } from '../../ultils/fetchAPI/fetch_API';
import { API_CREATE_COMMENT_POST, API_CREATE_SUB_COMMENT, API_LIST_COMMENT_POST } from '../../API/api_server'; // Đảm bảo bạn đã có API_CREATE_SUB_COMMENT
import { useSocket } from '../../provider/socket_context';

function PostItem({ dataPost }) {
    const [loaded, setLoaded] = useState(false);
    const [comment, setComment] = useState('');
    const [subComment, setSubComment] = useState(''); // State cho bình luận cấp 2
    const [comments, setComments] = useState([]);
    const [showSubCommentInput, setShowSubCommentInput] = useState({}); // State để kiểm soát hiển thị input bình luận cấp 2
    const [showSubComment, setShowSubComment] = useState({});
    const dataOwner = useContext(OwnDataContext);
    const socket = useSocket();

    useEffect(() => {
        setTimeout(() => setLoaded(true), 1000);
        fetchComments();
    }, []);
    useEffect(() => {
        if (socket) {
            socket.on('newComment', (data) => {
                console.log('Dataa tin nhắn mới: ', data);
                if (data) {
                    fetchComments();
                }
            });
        }
    }, [socket]);
    const fetchComments = async () => {
        try {
            const response = await getData(API_LIST_COMMENT_POST(dataPost?.post_id));
            setComments(response.data || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleComment = async () => {
        if (!comment) return;
        const payload = {
            comment_text: comment,
            medialink: '',
            commenting_user_id: dataOwner?.user_id,
        };

        try {
            const response = await postData(API_CREATE_COMMENT_POST(dataPost?.post_id), payload);
            if (response.status === true) {
                // Gửi bình luận qua WebSocket
                socket.emit('sendComment', {
                    comment_text: comment,
                    user_id: dataOwner.user_id, // ID của người dùng đang bình luận
                    created_at: new Date().toISOString(),
                });
                setComment('');
                fetchComments(); // Refresh the comment list
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleSendSubComment = async (commentId) => {
        if (!subComment) return;
        const payload = {
            comment_text: subComment,
            medialink: '',
            replying_user_id: dataOwner?.user_id,
        };

        try {
            const response = await postData(API_CREATE_SUB_COMMENT(commentId), payload);
            if (response.status === true) {
                socket.emit('sendComment', {
                    comment_text: comment,
                    user_id: dataOwner.user_id, // ID của người dùng đang bình luận
                    created_at: new Date().toISOString(),
                });
                setSubComment(''); // Reset subComment input
                fetchComments(); // Refresh the comment list
            }
        } catch (error) {
            console.error('Error posting sub-comment:', error);
        }
    };

    const handleShowCommentInput = (commentId) => {
        setShowSubCommentInput((prev) => ({
            ...prev,
            [commentId]: !prev[commentId], // Toggle hiển thị input bình luận phụ
        }));
    };
    const handleShowSubComment = (commentId) => {
        setShowSubComment((prev) => ({
            ...prev,
            [commentId]: !prev[commentId], // Toggle hiển thị subcomment cho comment cụ thể
        }));
    };
    // Tính tổng số comment (comment chính + subcomment)
    const totalCommentsCount = comments.reduce((total, commentData) => {
        return total + 1 + commentData?.sub_comments?.length; // 1 cho comment chính và thêm số lượng subcomments
    }, 0);
    return (
        <div className="post_item_container">
            {loaded && dataPost ? (
                <>
                    <div className="header_post_container">
                        <div className="user_post">
                            <div className="user_post_detai">
                                <AvatarUser avatar={dataPost?.avatar} />
                                <div className="infor_user_post">
                                    <div className="user_name_post">{dataPost?.user_name}</div>
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
                            <div className="action_user_post">
                                <FontAwesomeIcon icon={faEllipsis} />
                            </div>
                        </div>
                        <div className="title_post">{dataPost?.post_text}</div>
                    </div>
                    <div className="content_post_container">
                        <img src={dataPost?.images} alt="" />
                    </div>
                    <div className="footer_post_container">
                        <div className="action_count_post">
                            <div className="count_icon">
                                <AiFillLike />
                                500
                            </div>
                            <div className="count_comment_shared">
                                <div className="count_comment">{totalCommentsCount} bình luận</div>
                                <div className="count_shared">17 lượt chia sẻ</div>
                            </div>
                        </div>

                        <div className="action_user_post_footer">
                            <div className="action_detail">
                                <div className="action_item">
                                    <div className="icon_action">
                                        <AiOutlineLike />
                                    </div>
                                    <div className="name_action">Thích</div>
                                </div>
                                <div className="action_item">
                                    <div className="icon_action">
                                        <FaRegComment />
                                    </div>
                                    <div className="name_action">Bình luận</div>
                                </div>
                                <div className="action_item">
                                    <div className="icon_action">
                                        <PiShareFatLight />
                                    </div>
                                    <div className="name_action">Chia sẻ</div>
                                </div>
                            </div>
                        </div>

                        <div className="comment_post_container">
                            {comments?.map((commentData) => (
                                <div key={commentData?.comment_id} className="user_comment_container">
                                    <div className="avatar_user_comment">
                                        <AvatarUser avatar={commentData?.avatar} />
                                    </div>
                                    <div className="main_comment">
                                        <div className="container_comment">
                                            <div className="username_comment">{commentData?.commenting_user_name}</div>
                                            <div className="content_comment">
                                                <p>{commentData?.comment_text}</p>
                                            </div>
                                        </div>
                                        <div className="status_post_comment">
                                            <div className="item_status time_comment">
                                                {timeAgo(commentData?.created_at)}
                                            </div>
                                            <div className="item_status like_comment">Thích</div>
                                            <div
                                                className="item_status responsive_comment"
                                                onClick={() => handleShowCommentInput(commentData?.comment_id)}
                                            >
                                                {showSubCommentInput[commentData?.comment_id] ? 'Ẩn' : 'Phản hồi'}
                                            </div>
                                        </div>
                                        <div className="count_subs_comment">
                                            {commentData?.sub_comments?.length > 0 && (
                                                <div
                                                    className="show_sub_comments"
                                                    onClick={() => handleShowSubComment(commentData?.comment_id)}
                                                >
                                                    {showSubComment[commentData?.comment_id] ? (
                                                        <span>Ẩn tất cả phản hồi</span>
                                                    ) : (
                                                        <span>
                                                            Xem tất cả{' '}
                                                            <span>{commentData?.sub_comments.length} phản hồi</span>
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {showSubComment[commentData?.comment_id] && (
                                            <div className="sub_comment_container">
                                                {commentData?.sub_comments?.map((subCommentData) => (
                                                    <div
                                                        key={subCommentData?.sub_comment_id}
                                                        className="user_comment_container"
                                                    >
                                                        <div className="avatar_user_comment">
                                                            <AvatarUser avatar={subCommentData?.replying_user_avatar} />
                                                        </div>
                                                        <div className="main_comment">
                                                            <div className="container_comment">
                                                                <div className="username_comment">
                                                                    {subCommentData?.replying_user_name}
                                                                </div>
                                                                <div className="content_comment">
                                                                    <p>{subCommentData?.comment_text}</p>
                                                                </div>
                                                            </div>
                                                            <div className="status_post_comment">
                                                                <div className="item_status time_comment">
                                                                    {timeAgo(subCommentData?.created_at)}
                                                                </div>
                                                                <div className="item_status like_comment">Thích</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {showSubCommentInput[commentData?.comment_id] && (
                                            <div className="comment_sub_input">
                                                <AvatarUser />
                                                <Search
                                                    value={subComment} // Thêm dòng này để truyền giá trị subComment
                                                    handleSendMessage={() =>
                                                        handleSendSubComment(commentData?.comment_id)
                                                    }
                                                    onChange={(e) => setSubComment(e.target.value)}
                                                    placeholder={`Bình luận với vai trò ${dataOwner.user_name}`}
                                                    icon
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="my_comment_footer">
                            <AvatarUser />
                            <Search
                                value={comment}
                                handleSendMessage={handleComment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={`Bình luận với vai trò ${dataOwner.user_name}`}
                                icon
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="loading-skeleton">
                    <InstagramStyle />
                </div>
            )}
        </div>
    );
}

export default PostItem;
