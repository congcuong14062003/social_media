import CreatePost from '../CreatePost/CreatePost';
import PostItem from '../PostItem/PostItem';
import './PostProfile.scss';
import IntroduceComponent from '../IntroduceComponent/IntroduceComponent';
import ImageComponent from '../ImageComponent/ImageComponent';
import FriendComponent from '../FriendComponent/FriendComponent';
import {
    API_GET_ALL_MEDIA,
    API_GET_INFO_USER_PROFILE_BY_ID,
    API_GET_POSTS_BY_ID,
    API_LIST_FRIEND_BY_ID,
} from '../../API/api_server';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { OwnDataContext } from '../../provider/own_data';
import InstagramStyle from '../../skeleton/insta_style';
function PostProfile() {
    const dataOwner = useContext(OwnDataContext);
    const { id_user } = useParams();
    const [listPosts, setListPosts] = useState([]);
    const [dataUser, setDataUser] = useState(null);
    const [listImage, setListImage] = useState([]);
    const [listFriend, setListFriend] = useState([]);

    // Gọi API danh sách bài viết
    useEffect(() => {
        const fetchPosts = async () => {
            setListPosts(null); // Reset trước khi gọi API

            try {
                const response = await getData(API_GET_POSTS_BY_ID(id_user));
                if (response.status === true) {
                    setListPosts(response.data);
                } else {
                    setListPosts([]); // Nếu không có bài viết, đặt mảng rỗng
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
                setListPosts([]); // Xử lý lỗi bằng cách đặt mảng rỗng
            }
        };

        fetchPosts();
    }, [id_user]);

    // Gọi API thông tin người dùng
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getData(API_GET_INFO_USER_PROFILE_BY_ID(id_user));
                console.log(response);
                if (response.status === true) {
                    setDataUser(response.data);
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        fetchData();
    }, [id_user]);
    // Gọi API danh sách ảnh
    useEffect(() => {
        const listImage = async () => {
            try {
                const response = await getData(API_GET_ALL_MEDIA(id_user));
                if (response.status === true) {
                    setListImage(response.data); // Lưu danh sách bài viết vào state
                } else {
                    console.error('Lỗi khi lấy danh sách bài viết:', response.message);
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };

        listImage();
    }, [id_user]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await getData(API_LIST_FRIEND_BY_ID(id_user));
                if (response && response.users) {
                    setListFriend(response.users);
                } else {
                    setListFriend([]); // Nếu không có dữ liệu, đặt thành mảng rỗng
                }
            } catch (error) {
                console.error('Error fetching friends:', error);
                setListFriend([]); // Xử lý lỗi bằng cách đặt mảng rỗng
            }
        };
        fetchFriends();
    }, [id_user]);
    return (
        <div className="post_profile_container">
            <div className="left_container">
                <IntroduceComponent dataUser={dataUser} />
                <ImageComponent listImage={listImage} />
                <FriendComponent listFriend={listFriend} />
            </div>
            <div className="right_container">
                {dataOwner?.user_id === id_user && <CreatePost />}
                <div key={id_user} className="list_post">
                    {listPosts === null ? (
                        <div className="loading-skeleton">
                            <InstagramStyle />
                        </div>
                    ) : listPosts.length > 0 ? (
                        listPosts.map((post) => <PostItem key={post.post_id} dataPost={post} />)
                    ) : (
                        <div className='no_post'>Chưa có bài viết nào.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostProfile;
