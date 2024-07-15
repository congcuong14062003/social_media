import { Link } from 'react-router-dom';
import './HomePage.scss';
import config from '../../configs';
import CreatePost from '../../components/CreatePost/CreatePost';
import AvatarUser from '../../components/AvatarUser/AvatarUser';
import PostItem from '../../components/PostItem/PostItem';
import ListStory from '../../components/ListStory/ListStory';
function HomePage() {
    return (
        <div className="home__container">
            <div className="left__container">
                <div className="content">
                    <ul className="list_items_left">
                        <li>
                            <Link to={config.routes.profile}>
                                <AvatarUser />
                                <div className="text_content">Công Cường</div>
                            </Link>
                        </li>
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
            <div className="right__container"></div>
        </div>
    );
}

export default HomePage;
