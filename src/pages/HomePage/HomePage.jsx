import { Link } from 'react-router-dom';
import './HomePage.scss';
import images from '../../assets/imgs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import config from '../../configs';
import CreatePost from '../../components/CreatePost/CreatePost';
import AvatarUser from '../../components/AvatarUser/AvatarUser';
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
                <div className="story__container">
                    <div className="create_my_story">
                        <CreatePost />
                    </div>
                    <div className="list_story"></div>
                </div>
            </div>
            <div className="right__container"></div>
        </div>
    );
}

export default HomePage;
