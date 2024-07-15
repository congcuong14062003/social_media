import { Button } from '@mui/material';
import images from '../../assets/imgs';
import ComponentProfile from '../ComponentProfile/ComponentProfile';
import CreatePost from '../CreatePost/CreatePost';
import PostItem from '../PostItem/PostItem';
import './PostProfile.scss';
import IntroduceComponent from '../IntroduceComponent/IntroduceComponent';
import ImageComponent from '../ImageComponent/ImageComponent';
import FriendComponent from '../FriendComponent/FriendComponent';
function PostProfile() {
    return (
        <div className="post_profile_container">
            <div className="left_container">
                <IntroduceComponent />
                <ImageComponent />
                <FriendComponent />
            </div>
            <div className="right_container">
                <CreatePost />
                <PostItem />
            </div>
        </div>
    );
}

export default PostProfile;
