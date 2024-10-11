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
import { useState } from 'react';
import InstagramStyle from '../../skeleton/insta_style';
import DevtoCard from '../../skeleton/dev_to_card';
import ClassicPostLoader from '../../skeleton/classic_post_loader';
import BlogItem from '../../skeleton/blog_item';
import { timeAgo } from '../../ultils/formatDate/format_date';
function PostItem({ dataPost }) {
    const [loaded, setLoaded] = useState(false);
    setTimeout(() => {
        setLoaded(true);
    }, 1000);
    console.log(dataPost);
    return (
        <div className="post_item_container">
            {loaded ? (
                <>
                    <div className="header_post_container">
                        <div className="user_post">
                            <div className="user_post_detai">
                                {/* <div className="avatar_user_post"><img src={images.avt} alt="" /></div> */}
                                <AvatarUser avatar={dataPost?.avatar} />
                                <div className="infor_user_post">
                                    <div className="user_name_post">{dataPost?.user_name}</div>
                                    <div className="time_post">
                                        {timeAgo(dataPost?.created_at)}
                                        <img
                                            src={
                                                dataPost.post_privacy === 1
                                                    ? images.global // Public
                                                    : dataPost.post_privacy === 2
                                                    ? images.friend // Friends only
                                                    : dataPost.post_privacy === 0
                                                    ? images.private // Private
                                                    : images.global
                                            }
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="action_user_post">
                                <FontAwesomeIcon icon={faEllipsis} />
                            </div>
                        </div>
                        <div className="title_post">{dataPost.post_text}</div>
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
                                <div className="count_comment">264 bình luận</div>
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
                            <div className="user_comment_container">
                                <div className="avatar_user_comment">
                                    <AvatarUser />
                                </div>
                                <div className="main_comment">
                                    <div className="container_comment">
                                        <div className="username_comment">Công Cường</div>
                                        <div className="content_comment">
                                            <p>
                                                Kiến thức cơ bản thì codelearn sau đó là vnoi wiki Web luyện thì có
                                                codeforces, leetcode, hackkerrank... Nếu bạn cần người kèm 1vs1 thì ib
                                                mình nha
                                            </p>
                                        </div>
                                    </div>
                                    <div className="status_post_comment">
                                        <div className="item_status time_comment">17 giờ</div>
                                        <div className="item_status like_comment">Thích</div>
                                        <div className="item_status responsive_comment">Phản hồi</div>
                                    </div>

                                    {/* Bình luận cấp 2 */}
                                    <div className="sub_comment_container">
                                        <div className="user_comment_container">
                                            <div className="avatar_user_comment">
                                                <AvatarUser />
                                            </div>
                                            <div className="main_comment">
                                                <div className="container_comment">
                                                    <div className="username_comment">Người dùng khác</div>
                                                    <div className="content_comment">
                                                        <p>Đồng ý với bạn. Codeforces là một nền tảng rất tốt!</p>
                                                    </div>
                                                </div>
                                                <div className="status_post_comment">
                                                    <div className="item_status time_comment">15 giờ</div>
                                                    <div className="item_status like_comment">Thích</div>
                                                    <div className="item_status responsive_comment">Phản hồi</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="my_comment_footer">
                            <AvatarUser />
                            <Search placeholder="Bình luận với vai trò Công Cường" icon />
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
