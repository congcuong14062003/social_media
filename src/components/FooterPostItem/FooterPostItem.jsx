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
    API_DELETE_COMMENT_POST_BY_COMMENT_ID,
    API_DELETE_REACT_POST,
    API_DELETE_SUB_COMMENT_POST_BY_SUB_COMMENT_ID,
    API_HEART_COMMENT_BY_COMMENT_ID,
    API_HEART_SUB_COMMENT_BY_COMMENT_ID,
    API_LIST_COMMENT_POST,
} from '../../API/api_server';
import { FaRegComment } from 'react-icons/fa6';
import { PiShareFatLight } from 'react-icons/pi';
import AvatarUser from '../AvatarUser/AvatarUser';
import { timeAgo } from '../../ultils/formatDate/format_date';
import Search from '../Search/Search';
import { useSocket } from '../../provider/socket_context';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { useLoading } from '../Loading/Loading';
import { toast } from 'react-toastify';
import config from '../../configs';
import PrimaryIcon from '../PrimaryIcon/PrimaryIcon';
import { MdDelete } from 'react-icons/md';
function FooterPostItem({ dataPost, className }) {
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
    const [showFilePond, setShowFilePond] = useState(false);
    const [showFilePondSub, setShowFilePondSub] = useState(false);
    const [files, setFiles] = useState();
    const [filesSub, setFilesSub] = useState();
    const [showSubCommentInput, setShowSubCommentInput] = useState({}); // State để kiểm soát hiển thị input bình luận cấp 2
    const socket = useSocket();
    const { showLoading, hideLoading } = useLoading();
    const [showCopyConfirmation, setShowCopyConfirmation] = useState(false);
    const [activeSubComment, setActiveSubComment] = useState(null);
    const [heartCmt, setHeartCmt] = useState();
    // State để lưu tổng số lượng bình luận
    const [totalCommentsCount, setTotalCommentsCount] = useState(0);
    const [selectedReaction, setSelectedReaction] = useState(() => {
        const userReaction = dataPost?.reacts?.find((item) => item?.user_id === dataOwner?.user_id);
        return reactionIcons.find((i) => i.id === userReaction?.react);
    });
    console.log(comments);
    const inputRef = useRef(null); // Tạo ref cho input
    const inputSubRef = useRef(null); // Tạo ref cho sub input
    useEffect(() => {
        if (dataPost) {
            fetchComments();
        }
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
            const commentsList = response.data || [];
            setComments(commentsList);

            // Tính tổng số bình luận ban đầu
            const initialCount = commentsList.reduce((total, comment) => {
                return total + 1 + (comment?.sub_comments?.length || 0);
            }, 0);
            setTotalCommentsCount(initialCount);
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
    console.log('comments: ', comments);

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
        if (!showSubCommentInput[commentId]) {
            setTimeout(() => {
                inputSubRef.current?.focus(); // Focus nếu input được mở
            }, 0);
        }
    };

    const handleComment = async () => {
        showLoading();
        if (!comment && (!files || files.length === 0)) {
            toast.error('Vui lòng nhập comment');
            hideLoading();
            return;
        }

        const formData = new FormData();
        let media_type = null;

        if (files && files.length > 0) {
            const file = files[0];
            const fileType = file.file.type;
            media_type = fileType.startsWith('image/') ? 'image' : fileType.startsWith('video/') ? 'video' : null;
            formData.append('file', file.file, file.file.name);
        }

        const payload = {
            media_type,
            comment_text: comment,
            commenting_user_id: dataOwner?.user_id,
        };

        Object.entries(payload).forEach(([key, value]) => {
            if (value !== null) formData.append(key, value);
        });

        try {
            const response = await postData(API_CREATE_COMMENT_POST(dataPost?.post_id), formData);

            if (response.status === true && response.data) {
                // Thêm comment vào state
                setComments((prevComments) => [response.data, ...prevComments]);

                // Tăng tổng số bình luận
                setTotalCommentsCount((prevCount) => prevCount + 1);

                // Gửi socket
                socket.emit('sendComment', {
                    sender_id: dataOwner?.user_id,
                    receiver_id: dataPost?.user_id,
                    content: `${dataOwner?.user_name} vừa bình luận bài viết của bạn`,
                    link_notice: `${config.routes.post}/${dataPost?.post_id}`,
                    created_at: new Date().toISOString(),
                });

                setComment('');
                setShowFilePond(false);
                setFiles('');
                setShowCommentPost(true);
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            hideLoading();
            inputRef.current.focus();
        }
    };

    const handleSendSubComment = async (commentId, user_comment) => {
        showLoading();

        if (!subComment && (!filesSub || filesSub.length === 0)) {
            toast.error('Vui lòng nhập comment');
            hideLoading();
            return;
        }

        const formData = new FormData();
        let media_type = null;

        if (filesSub && filesSub.length > 0) {
            const file = filesSub[0];
            const fileType = file.file.type;
            media_type = fileType.startsWith('image/') ? 'image' : fileType.startsWith('video/') ? 'video' : null;
            formData.append('file', file.file, file.file.name);
        }

        const payload = {
            comment_text: subComment,
            media_type,
            replying_user_id: dataOwner?.user_id,
            parent_comment_id: commentId,
            sub_comment_id: activeSubComment?.subCommentId || null,
        };

        Object.entries(payload).forEach(([key, value]) => {
            if (value !== null) formData.append(key, value);
        });

        try {
            const response = await postData(API_CREATE_SUB_COMMENT(commentId), formData);

            if (response.status === true && response.data) {
                setComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment.comment_id === commentId
                            ? {
                                  ...comment,
                                  sub_comments: [...(comment.sub_comments || []), response.data],
                              }
                            : comment,
                    ),
                );

                // Tăng tổng số bình luận
                setTotalCommentsCount((prevCount) => prevCount + 1);

                const receiver_id = activeSubComment?.subCommentId ? activeSubComment?.replyingUserId : user_comment;

                socket.emit('sendSubComment', {
                    sender_id: dataOwner?.user_id,
                    receiver_id,
                    content: `${dataOwner?.user_name} vừa trả lời bình luận của bạn`,
                    link_notice: `${config.routes.post}/${dataPost?.post_id}`,
                    created_at: new Date().toISOString(),
                });

                setSubComment('');
                setFilesSub('');
                setShowFilePondSub(false);
                setShowCommentPost(true); // Mở danh sách bình luận con nếu cần
            }
        } catch (error) {
            console.error('Error posting sub-comment:', error);
        } finally {
            hideLoading();
            inputSubRef.current.focus();
        }
    };

    // trả lời bình luận phụ:
    const handleResponseSubcommet = (commentId, subCommentId, replyingUserName, replyingUserId) => {
        const responseText = `Trả lời ${replyingUserName}: `;
        setSubComment(responseText);
        setShowSubCommentInput((prev) => ({
            ...prev,
            [commentId]: true,
        }));
        setActiveSubComment({ commentId, subCommentId, replyingUserId }); // Thêm replyingUserId
        setTimeout(() => {
            inputSubRef.current?.focus();
        }, 0);
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

    const handleFilesChange = (newFiles) => {
        setFiles(newFiles); // Update the files state
        if (newFiles.length > 0 && inputRef.current) {
            inputRef.current.focus(); // Automatically focus the input if there are files
        }
    };
    const handleFilesSubChange = (newFiles) => {
        setFilesSub(newFiles); // Update the files state
        if (newFiles.length > 0 && inputSubRef.current) {
            inputSubRef.current.focus(); // Automatically focus the input if there are files
        }
    };

    // share bài viết
    const handleShare = () => {
        // Get the URL of the post, assuming `dataPost` has a `post_url` field
        const postUrl = `http://localhost:3001${config.routes.post}/${dataPost?.post_id}`;

        // Copy the URL to clipboard
        navigator.clipboard
            .writeText(postUrl)
            .then(() => {
                // Show confirmation (optional)
                setShowCopyConfirmation(true);
                setTimeout(() => setShowCopyConfirmation(false), 2000); // Hide after 2 seconds
            })
            .catch((err) => {
                console.error('Failed to copy the link: ', err);
            });
    };

    // thả tym bình luận
    const handleHeartComment = async (commentId) => {
        try {
            await postData(API_HEART_COMMENT_BY_COMMENT_ID(commentId));

            // Cập nhật trực tiếp số lượt thích trong state
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.comment_id === commentId
                        ? {
                              ...comment,
                              comment_count_comment_heart: (comment.comment_count_comment_heart || 0) + 1,
                          }
                        : comment,
                ),
            );
        } catch (error) {
            console.error('Error liking comment:', error);
            toast.error('Không thể thích bình luận. Vui lòng thử lại!');
        }
    };
    // thả tym subs bình luận
    const handleHeartSubComment = async (commentId, subCommentId) => {
        const prevComments = [...comments]; // Sao lưu trạng thái trước đó

        // Tìm và cập nhật sub-comment trong state
        setComments((prevComments) =>
            prevComments.map((comment) =>
                comment.comment_id === commentId
                    ? {
                          ...comment,
                          sub_comments: comment.sub_comments.map((subComment) =>
                              subComment.sub_comment_id === subCommentId
                                  ? {
                                        ...subComment,
                                        sub_comment_count_heart: subComment.sub_comment_count_heart + 1, // Tăng lượt thích
                                    }
                                  : subComment,
                          ),
                      }
                    : comment,
            ),
        );

        try {
            // Gọi API để tăng lượt thích
            await postData(API_HEART_SUB_COMMENT_BY_COMMENT_ID(subCommentId));
        } catch (error) {
            console.error('Error liking sub-comment:', error);
            toast.error('Không thể thích bình luận. Vui lòng thử lại!');

            // Khôi phục trạng thái nếu có lỗi
            setComments(prevComments);
        }
    };
    // xoá bình luận
    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Bạn có chắc chắn muốn xoá bình luận này?')) {
            showLoading();
            try {
                // Gọi API để xoá comment
                await postData(API_DELETE_COMMENT_POST_BY_COMMENT_ID(commentId), {
                    post_id: dataPost?.post_id,
                });
                // Cập nhật state sau khi xoá
                setComments((prevComments) => prevComments.filter((comment) => comment.comment_id !== commentId));
            } catch (error) {
                console.error('Error deleting comment:', error);
            } finally {
                hideLoading();
            }
        }
    };

    // xoá sub bình luận
    const handleDeleteSubComment = async (subCommentId) => {
        if (window.confirm('Bạn có chắc chắn muốn xoá phản hồi này?')) {
            showLoading();
            try {
                const response = await postData(API_DELETE_SUB_COMMENT_POST_BY_SUB_COMMENT_ID(subCommentId), {
                    post_id: dataPost?.post_id,
                });

                if (response.status === true) {
                    // Cập nhật lại danh sách bình luận
                    setComments((prevComments) =>
                        prevComments.map((comment) => ({
                            ...comment,
                            sub_comments: comment.sub_comments.filter(
                                (subComment) => subComment.sub_comment_id !== subCommentId,
                            ),
                        })),
                    );
                }
            } catch (error) {
                console.error('Error deleting sub-comment:', error);
            } finally {
                hideLoading();
            }
        }
    };

    const classes = `${className} footer_post_container`;
    return (
        <div className={classes}>
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
                    {/* <div className="count_shared">17 lượt chia sẻ</div> */}
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
                        {showCopyConfirmation || (
                            <div className="name_action" onClick={handleShare}>
                                Chia sẻ
                            </div>
                        )}

                        {showCopyConfirmation && <div className="copy-confirmation">Đã sao chép liên kết!</div>}
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
                                <div className="media_content">
                                    {commentData?.media_type === 'image' && <img src={commentData?.media_link} />}
                                    {commentData?.media_type === 'video' && (
                                        <video controls src={commentData?.media_link} alt="content" />
                                    )}
                                </div>
                                <div className="status_post_comment">
                                    <div className="item_status time_comment">{timeAgo(commentData?.created_at)}</div>
                                    <div
                                        className="item_status like_comment"
                                        onClick={() => handleHeartComment(commentData?.comment_id)}
                                    >
                                        Thích
                                    </div>

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
                                    {commentData?.commenting_user_id === dataOwner?.user_id && (
                                        <div
                                            className="item_status like_comment"
                                            onClick={() => handleDeleteComment(commentData?.comment_id)}
                                        >
                                            <MdDelete />
                                        </div>
                                    )}
                                    {commentData?.comment_count_comment_heart > 0 && (
                                        <div className="item_status">{commentData?.comment_count_comment_heart} ❤️</div>
                                    )}
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
                                                        <div className="media_content">
                                                            {subCommentData?.media_type === 'image' && (
                                                                <img src={subCommentData?.media_link} />
                                                            )}
                                                            {subCommentData?.media_type === 'video' && (
                                                                <video
                                                                    controls
                                                                    src={subCommentData?.media_link}
                                                                    alt="content"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="status_post_comment">
                                                            <div className="item_status time_comment">
                                                                {timeAgo(subCommentData?.created_at)}
                                                            </div>
                                                            <div
                                                                className="item_status like_comment"
                                                                onClick={() =>
                                                                    handleHeartSubComment(
                                                                        commentData?.comment_id,
                                                                        subCommentData?.sub_comment_id,
                                                                    )
                                                                }
                                                            >
                                                                Thích
                                                            </div>
                                                            <div
                                                                className="item_status responsive_comment response_sub_coment"
                                                                onClick={() =>
                                                                    handleResponseSubcommet(
                                                                        commentData?.comment_id,
                                                                        subCommentData?.sub_comment_id,
                                                                        subCommentData?.replying_user_name,
                                                                        subCommentData?.replying_user_id, // Tham số mới
                                                                    )
                                                                }
                                                            >
                                                                Phản hồi
                                                            </div>

                                                            {/* Hiển thị nút xóa nếu là chủ của bình luận con */}
                                                            {subCommentData?.replying_user_id ===
                                                                dataOwner?.user_id && (
                                                                <div
                                                                    className="item_status delete_sub_comment"
                                                                    onClick={() =>
                                                                        handleDeleteSubComment(
                                                                            subCommentData?.sub_comment_id,
                                                                        )
                                                                    }
                                                                >
                                                                    <MdDelete />
                                                                </div>
                                                            )}
                                                            {subCommentData?.sub_comment_count_heart > 0 && (
                                                                <div className="item_status">
                                                                    {subCommentData?.sub_comment_count_heart} ❤️
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                {showSubCommentInput[commentData?.comment_id] && (
                                    <>
                                        {showFilePondSub && (
                                            <FilePond
                                                files={filesSub}
                                                acceptedFileTypes={['image/*', 'video/*']} // Chỉ chấp nhận ảnh và video
                                                allowMultiple={false}
                                                onupdatefiles={handleFilesSubChange}
                                                labelIdle='Kéo và Thả tệp phương tiện or <span className="filepond--label-action">Duyệt</span>'
                                            />
                                        )}
                                        <div className="comment_sub_input">
                                            <AvatarUser />
                                            <Search
                                                handleOpenFile={() => setShowFilePondSub((pre) => !pre)}
                                                inputRef={inputSubRef}
                                                onkeydown={(e) =>
                                                    e.key === 'Enter' &&
                                                    handleSendSubComment(
                                                        commentData?.comment_id,
                                                        commentData?.commenting_user_id,
                                                    )
                                                }
                                                value={subComment} // Thêm dòng này để truyền giá trị subComment
                                                handleSendMessage={() =>
                                                    handleSendSubComment(
                                                        commentData?.comment_id,
                                                        commentData?.commenting_user_id,
                                                    )
                                                }
                                                onChange={(e) => setSubComment(e.target.value)}
                                                placeholder={`Bình luận với vai trò ${dataOwner.user_name}`}
                                                icon
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {showFilePond && (
                <FilePond
                    files={files}
                    acceptedFileTypes={['image/*', 'video/*']} // Chỉ chấp nhận ảnh và video
                    allowMultiple={false}
                    onupdatefiles={handleFilesChange}
                    labelIdle='Kéo và Thả tệp phương tiện or <span className="filepond--label-action">Duyệt</span>'
                />
            )}
            <div className="my_comment_footer">
                <AvatarUser />
                <Search
                    handleOpenFile={() => setShowFilePond((pre) => !pre)}
                    value={comment}
                    inputRef={inputRef}
                    onkeydown={(e) => e.key === 'Enter' && handleComment()}
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
