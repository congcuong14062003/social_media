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
import { API_GET_ALL_USERS } from '../../API/api_server';
import { getData, postData } from '../../ultils/fetchAPI/fetch_API';
function HomePage() {
    const [allUser, setAllUser] = useState([])
    const getAllFriend = async () => {
        const response = await getData(API_GET_ALL_USERS);
        setAllUser(response.users);
    }
    useEffect(() => {
        getAllFriend()
    }, [])
    const dataUser = useContext(OwnDataContext);
    return (
        <div className="home__container">
            <div className="left__container">
                <div className="content">
                    <ul className="list_items_left">
                        <li>
                            <Link to={`${config.routes.profile}/${dataUser && dataUser?.user_id}`}>
                                <AvatarUser />
                                <div className="text_content">{dataUser && dataUser?.user_name}</div>
                            </Link>
                        </li>
                        <FriendList ListUser={allUser} />
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
                        <CreatePost />
                    </div>
                    <div className="list_post">
                        <PostItem />
                        <PostItem />
                        <PostItem />
                    </div>
                </div>
            </div>
            <div className="right__container">
                <FriendList />
            </div>
        </div>
    );
}

export default HomePage;
