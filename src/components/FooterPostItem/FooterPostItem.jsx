import { useContext, useEffect, useRef, useState } from 'react';
import './FooterPostItem.scss';
import ToolTip from '../ToolTip/ToolTip';
import { OwnDataContext } from '../../provider/own_data';
import { AiOutlineLike } from 'react-icons/ai';
import { deleteData, getData, postData } from '../../ultils/fetchAPI/fetch_API';
import {
    API_CREATE_COMMENT_POST,
    API_CREATE_REACT_POST,
    API_CREATE_SUB_COMMENT,
    API_DELETE_REACT_POST,
    API_LIST_COMMENT_POST,
} from '../../API/api_server';
import { FaRegComment } from 'react-icons/fa6';
import { PiShareFatLight } from 'react-icons/pi';
import AvatarUser from '../AvatarUser/AvatarUser';
import { timeAgo } from '../../ultils/formatDate/format_date';
import Search from '../Search/Search';
import { useSocket } from '../../provider/socket_context';
function FooterPostItem({ dataPost }) {
    const reactionIcons = [
        { id: 'like', icon: '👍' },
        { id: 'heart', icon: '❤️' },
        { id: 'laugh', icon: '😂' },
        { id: 'wow', icon: '😮' },
        { id: 'sad', icon: '😢' },
        { id: 'angry', icon: '😡' },
    ];
    const dataOwner = useContext(OwnDataContext);
    const [showReactions, setShowReactions] = useState(false);
    const [showCommentPost, setShowCommentPost] = useState(false);
    const [showSubComment, setShowSubComment] = useState({});
    const [comment, setComment] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [subComment, setSubComment] = useState(''); // State cho bình luận cấp 2
    const [comments, setComments] = useState([]);
    const [showSubCommentInput, setShowSubCommentInput] = useState({}); // State để kiểm soát hiển thị input bình luận cấp 2
    const socket = useSocket();
    const [selectedReaction, setSelectedReaction] = useState(() => {
        const userReaction = dataPost?.reacts?.find((item) => item?.user_id === dataOwner?.user_id);
        return reactionIcons.find((i) => i.id === userReaction?.react);
    });
    const inputRef = useRef(null); // Tạo ref cho input
    useEffect(() => {
        setTimeout(() => setLoaded(true), 1000);
        fetchComments();
    }, [dataPost]);
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
    const getTopReactions = () => {
        const reactionCount = {};

        // Đếm số lượng từng loại cảm xúc
        dataPost?.reacts?.forEach((react) => {
            if (reactionCount[react.react]) {
                reactionCount[react.react]++;
            } else {
                reactionCount[react.react] = 1;
            }
        });

        // Chuyển đổi thành mảng và sắp xếp để lấy 3 loại cảm xúc nhiều nhất
        const sortedReactions = Object.entries(reactionCount)
            .map(([react, count]) => ({ react, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        return sortedReactions;
    };
    const topReactions = getTopReactions();
    const handleFocusComment = () => {
        inputRef.current.focus(); // Focus vào ô input khi click vào "Bình luận"
    };
    const handleShowCommentPost = () => {
        setShowCommentPost((prev) => {
            return !prev; // Toggle hiển thị comment post
        });
    };
    const handleShowSubComment = (commentId) => {
        setShowSubComment((prev) => ({
            ...prev,
            [commentId]: !prev[commentId], // Toggle hiển thị subcomment cho comment cụ thể
        }));
    };
    const handleShowCommentInput = (commentId, comment_user_name, comment_user_id) => {
        const comment = `Trả lời ${comment_user_name}: `;
        setSubComment(comment);
        setShowSubCommentInput((prev) => ({
            ...prev,
            [commentId]: !prev[commentId], // Toggle hiển thị input bình luận phụ
        }));
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
    const handleReactionSelect = async (reaction, event) => {
        event.stopPropagation(); // Chặn sự kiện lan truyền

        if (selectedReaction) {
            await handleDeleteReactPost(); // Xóa reaction cũ nếu tồn tại
        }

        try {
            const payload = {
                user_id: dataOwner?.user_id,
                react: reaction.id,
            };
            const response = await postData(API_CREATE_REACT_POST(dataPost?.post_id), payload);
            if (response.status === true) {
                setSelectedReaction(reaction); // Cập nhật phản ứng
                setShowReactions(false); // Ẩn popup
            }
        } catch (error) {
            console.error('Error saving reaction:', error);
        }
    };
    const handleDeleteReactPost = async () => {
        if (!selectedReaction) {
            const payload = {
                user_id: dataOwner?.user_id,
                react: reactionIcons[0].id,
            };
            const response = await postData(API_CREATE_REACT_POST(dataPost?.post_id), payload);
            setSelectedReaction(reactionIcons[0]); // Cập nhật phản ứng
        } else {
            try {
                const response = await deleteData(API_DELETE_REACT_POST(dataPost?.post_id));
                if (response.status === true) {
                    setSelectedReaction(null); // Xóa phản ứng trong state
                }
            } catch (error) {
                console.error('Error deleting reaction:', error);
            }
        }
    };
    const totalCommentsCount = comments.reduce((total, commentData) => {
        return total + 1 + commentData?.sub_comments?.length; // 1 cho comment chính và thêm số lượng subcomments
    }, 0);
    return (
        <div className="footer_post_container">
            <div className="action_count_post">
                <div className="count_icon">
                    {topReactions.map((reaction, index) => (
                        <ToolTip title={`${reaction.count} lượt ${reaction.react}`}>
                            <div key={index} className="reaction_icon">
                                {reactionIcons.find((icon) => icon.id === reaction.react)?.icon}
                            </div>
                        </ToolTip>
                    ))}
                    {dataPost?.reacts.length > 0 && dataPost?.reacts.length}
                </div>
                <div className="count_comment_shared">
                    <div className="count_comment" onClick={handleShowCommentPost}>
                        {totalCommentsCount} bình luận
                    </div>
                    <div className="count_shared">17 lượt chia sẻ</div>
                </div>
            </div>
            <div className="action_user_post_footer">
                <div className="action_detail">
                    <div className="action_item" onClick={handleDeleteReactPost}>
                        <div className="name_action react_post">
                            {selectedReaction ? (
                                <span className="icon_react_post">{selectedReaction.icon}</span>
                            ) : (
                                <>
                                    <AiOutlineLike />
                                    Thích
                                </>
                            )}
                            <div className="reactions-popup">
                                {reactionIcons.map((reaction) => (
                                    <span
                                        key={reaction.id}
                                        className="reaction-icon"
                                        onClick={(event) => handleReactionSelect(reaction, event)}
                                    >
                                        {reaction.icon}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="action_item">
                        <div className="icon_action">
                            <FaRegComment />
                        </div>
                        <div className="name_action" onClick={handleFocusComment}>
                            Bình luận
                        </div>
                    </div>
                    <div className="action_item">
                        <div className="icon_action">
                            <PiShareFatLight />
                        </div>
                        <div className="name_action">Chia sẻ</div>
                    </div>
                </div>
            </div>
            {showCommentPost && (
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
                                    <div className="item_status time_comment">{timeAgo(commentData?.created_at)}</div>
                                    <div className="item_status like_comment">Thích</div>
                                    <div
                                        className="item_status responsive_comment"
                                        onClick={() =>
                                            handleShowCommentInput(
                                                commentData?.comment_id,
                                                commentData?.commenting_user_name,
                                                commentData?.commenting_user_id,
                                            )
                                        }
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
                                                    Xem tất cả <span>{commentData?.sub_comments.length} phản hồi</span>
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {showSubComment[commentData?.comment_id] && (
                                    <div className="sub_comment_container">
                                        {commentData?.sub_comments?.map((subCommentData) => {
                                            console.log(subCommentData);
                                            return (
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
                                                            {/* <div className="item_status responsive_comment" onClick={()=>setShowInforReply(subCommentData?.replying_user_id, subCommentData?.replying_user_name,commentData?.comment_id)}>
                                                            Phản hồi
                                                        </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {showSubCommentInput[commentData?.comment_id] && (
                                    <div className="comment_sub_input">
                                        <AvatarUser />
                                        <Search
                                            value={subComment} // Thêm dòng này để truyền giá trị subComment
                                            handleSendMessage={() => handleSendSubComment(commentData?.comment_id)}
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
            )}

            <div className="my_comment_footer">
                <AvatarUser />
                <Search
                    value={comment}
                    inputRef={inputRef}
                    handleSendMessage={handleComment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={`Bình luận với vai trò ${dataOwner?.user_name}`}
                    icon
                />
            </div>
        </div>
    );
}

export default FooterPostItem;
