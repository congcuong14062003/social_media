import CreatePost from '../CreatePost/CreatePost';
import PostItem from '../PostItem/PostItem';
import './PostProfile.scss';
import IntroduceComponent from '../IntroduceComponent/IntroduceComponent';
import ImageComponent from '../ImageComponent/ImageComponent';
import FriendComponent from '../FriendComponent/FriendComponent';
import { API_GET_POSTS_BY_ID } from '../../API/api_server';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { OwnDataContext } from '../../provider/own_data';
function PostProfile() {
    const dataOwner = useContext(OwnDataContext);
    const { id_user } = useParams();
    const [listPosts, setListPosts] = useState([]);
    // Gọi API danh sách bài viết
    useEffect(() => {
        const listPosts = async () => {
            try {
                const response = await getData(API_GET_POSTS_BY_ID(id_user));
                if (response.status === true) {
                    setListPosts(response.data); // Lưu danh sách bài viết vào state
                } else {
                    console.error('Lỗi khi lấy danh sách bài viết:', response.message);
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };

        listPosts();
    }, [id_user]);
    return (
        <div className="post_profile_container">
            <div className="left_container">
                <IntroduceComponent />
                <ImageComponent />
                <FriendComponent />
            </div>
            <div className="right_container">
                {dataOwner?.user_id === id_user && <CreatePost />}
                {listPosts.map((post, index) => (
                    <PostItem key={index} dataPost={post} />
                ))}
            </div>
        </div>
    );
}

export default PostProfile;
