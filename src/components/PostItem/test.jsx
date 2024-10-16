import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import images from '../../assets/imgs';
import AvatarUser from '../AvatarUser/AvatarUser';
import './PostItem.scss';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { AiFillLike } from 'react-icons/ai';
import Search from '../Search/Search';
import { useContext, useEffect, useState } from 'react';
import InstagramStyle from '../../skeleton/insta_style';
import { timeAgo } from '../../ultils/formatDate/format_date';
import ToolTip from '../ToolTip/ToolTip';
import { OwnDataContext } from '../../provider/own_data';
import { getData, postData } from '../../ultils/fetchAPI/fetch_API';
import { API_CREATE_COMMENT_POST, API_CREATE_SUB_COMMENT, API_LIST_COMMENT_POST } from '../../API/api_server'; // Đảm bảo bạn đã có API_CREATE_SUB_COMMENT

function PostItem({ dataPost }) {
    const [loaded, setLoaded] = useState(false);
    const [comment, setComment] = useState('');
    const [subComment, setSubComment] = useState(''); // State cho bình luận cấp 2
    const [comments, setComments] = useState([]);
    const [showSubCommentInput, setShowSubCommentInput] = useState({}); // State để kiểm soát hiển thị input bình luận cấp 2
    const dataOwner = useContext(OwnDataContext);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 1000);
        fetchComments();
    }, []);

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
            if (response.status) {
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
            if (response.status) {
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

    return (
        <div className="post_item_container">
            {showSubComment[commentData?.comment_id] && (
                <div className="sub_comment_container">
                    {commentData?.sub_comments?.map((subCommentData) => (
                        <div key={subCommentData?.sub_comment_id} className="user_comment_container">
                            <div className="avatar_user_comment">
                                <AvatarUser avatar={subCommentData?.replying_user_avatar} />
                            </div>
                            <div className="main_comment">
                                <div className="container_comment">
                                    <div className="username_comment">{subCommentData?.replying_user_name}</div>
                                    <div className="content_comment">
                                        <p>{subCommentData?.comment_text}</p>
                                    </div>
                                </div>
                                <div className="status_post_comment">
                                    <div className="item_status time_comment">
                                        {timeAgo(subCommentData?.created_at)}
                                    </div>
                                    <div className="item_status like_comment">Thích</div>
                                    <div
                                        className="item_status responsive_comment"
                                        onClick={() =>
                                            handleShowCommentInput(
                                                commentData?.comment_id, // ID của bình luận gốc cấp 1
                                                subCommentData?.replying_user_name, // Tên người dùng cấp 2
                                                subCommentData?.comment_text, // Nội dung cấp 2
                                            )
                                        }
                                    >
                                        {showSubCommentInput[commentData?.comment_id] ? 'Ẩn' : 'Phản hồi'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {showSubCommentInput[commentData?.comment_id] && (
                        <div className="comment_sub_input">
                            <AvatarUser />
                            <Search
                                value={subComment} // State lưu giá trị của bình luận phản hồi
                                handleSendMessage={
                                    () => handleSendSubComment(commentData?.comment_id) // Thêm bình luận vào mảng cấp 2
                                }
                                onChange={(e) => setSubComment(e.target.value)}
                                placeholder={`Phản hồi đến ${replyInfo?.userName}: ${replyInfo?.commentText}`}
                                icon
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default PostItem;
