import { Link } from 'react-router-dom';
import './HomePage.scss';
import config from '../../configs';
import CreatePost from '../../components/CreatePost/CreatePost';
import AvatarUser from '../../components/AvatarUser/AvatarUser';
import PostItem from '../../components/PostItem/PostItem';
import ListStory from '../../components/ListStory/ListStory';
import { useContext, useEffect, useState } from 'react';
import FriendList from '../../components/Friend/FriendList/FriendList';
import { OwnDataContext } from '../../provider/own_data';
import { API_GET_ALL_USERS, API_GET_POSTS, API_LIST_FRIEND } from '../../API/api_server';
import { getData, postData } from '../../ultils/fetchAPI/fetch_API';
import { FaUser } from 'react-icons/fa';
import HorizontalItem from '../../components/HorizontalItem/HorizontalItem';
import PrimaryIcon from '../../components/PrimaryIcon/PrimaryIcon';
function HomePage() {
    const dataUser = useContext(OwnDataContext);
    const [listPosts, setListPosts] = useState([]);
    const [listFriend, setListFriend] = useState([]);
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await getData(API_LIST_FRIEND);
                // Kiểm tra nếu response và response.users tồn tại
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
    }, []);
    // Gọi API danh sách bài viết
    useEffect(() => {
        const listPosts = async () => {
            try {
                const response = await getData(API_GET_POSTS);
                if (response?.status === true) {
                    setListPosts(response?.data); // Lưu danh sách bài viết vào state
                } else {
                    console.error('Lỗi khi lấy danh sách bài viết:', response.message);
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };
        listPosts();
    }, []);
    return (
        <div className="home__container">
            <div className="left__container">
                <div className="content">
                    <ul className="list_items_left">
                        <li>
                            <HorizontalItem
                                to={`${config.routes.profile}/${dataUser && dataUser?.user_id}`}
                                avt={dataUser && dataUser?.avatar}
                                title={dataUser && dataUser?.user_name}
                            />
                        </li>
                        <li>
                            <HorizontalItem
                                to={config.routes.friends}
                                icon={<PrimaryIcon icon={<FaUser />} />}
                                title="Bạn bè"
                            />
                        </li>
                        {/* <FriendList ListUser={allUser} /> */}
                    </ul>
                </div>
            </div>
            <div className="center__container">
                {/*đăng tin và danh sách tin*/}
                <div className="story_container">
                    <ListStory />
                </div>
                {/* đăng bài viết và danh sách bài viết */}
                <div className="post__container">
                    <div className="create_my_post">
                        <CreatePost dataOwner={dataUser} />
                    </div>
                    {/* Danh sách bài viết */}
                    <div className="list_post">
                        {listPosts?.map((post) => (
                            <PostItem key={post?.post_id} dataPost={post} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="right__container">
                <FriendList ListUser={listFriend} />
            </div>
        </div>
    );
}

export default HomePage;
