import './PostItem.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import InstagramStyle from '../../skeleton/insta_style';
import { OwnDataContext } from '../../provider/own_data';
import { Link } from 'react-router-dom';
import config from '../../configs';
import ModalCreatePost from '../Modal/ModalCreatePost/ModalCreatePost';
import FooterPostItem from '../FooterPostItem/FooterPostItem';
import HeaderPostItem from '../HeaderPostItem/HeaderPostItem';
function PostItem({ dataPost }) {
    const dataOwner = useContext(OwnDataContext);
    const [loaded, setLoaded] = useState(false);
    const [showEditPost, setShowEditPost] = useState(false);
    useEffect(() => {
        setTimeout(() => setLoaded(true), 1000);
    }, []);
    const handleClose = () => {
        setShowEditPost(false);
    };
    const mediaLength = dataPost?.media?.length || 0;
    return (
        <div className="post_item_container">
            {loaded && dataPost ? (
                <>
                    <HeaderPostItem setShowEditPost={setShowEditPost} dataPost={dataPost} />
                    <div className={`image_or_video_container media-${Math.min(mediaLength, 5)}`}>
                        {dataPost?.media?.slice(0, 4).map((data, index) => (
                            <div className="content_post_container" key={index}>
                                <Link to={`${config.routes.post}/${dataPost?.post_id}?mediaIndex=${index}`}>
                                    {data.media_type === 'image' && (
                                        <img src={data?.media_link} alt={`media-${index}`} />
                                    )}
                                    {data.media_type === 'video' && (
                                        <video key={index} controls className="video-preview">
                                            <source src={data?.media_link} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </Link>
                            </div>
                        ))}
                        {/* Kiểm tra nếu có hơn 4 media */}
                        {dataPost.media.length > 4 && (
                            <Link to={`${config.routes.post}/${dataPost?.post_id}?mediaIndex=3`}>
                                <div className="more-media">
                                    <p>+{dataPost.media.length - 4}</p>
                                </div>
                            </Link>
                        )}
                    </div>
                    <FooterPostItem dataPost={dataPost} />
                </>
            ) : (
                <div className="loading-skeleton">
                    <InstagramStyle />
                </div>
            )}
            <ModalCreatePost
                dataOwner={dataOwner}
                openModel={showEditPost}
                closeModel={handleClose}
                isEdit={true}
                dataEdit={dataPost}
            />
        </div>
    );
}

export default PostItem;
