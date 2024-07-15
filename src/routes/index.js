import FriendProfile from '../components/FriendProfile/FriendProfile';
import ImageProfile from '../components/ImageProfile/ImageProfile';
import PostProfile from '../components/PostProfile/PostProfile';
import CreateStory from '../pages/CreateStory/CreateStory';
import GroupPage from '../pages/GroupPage/GroupPage';
import HomePage from '../pages/HomePage/HomePage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import VideoPage from '../pages/VideoPage/VideoPage';

const publicRouter = [
    {
        path: '/',
        component: HomePage,
    },
    {
        path: '/video',
        component: VideoPage,
    },
    {
        path: '/group',
        component: GroupPage,
    },
    {
        path: '/story/create',
        component: CreateStory,
        layout: CreateStory,
    },
    {
        path: '/profile',
        component: ProfilePage,
        childrenRouter: [
            { path: '', component: <PostProfile /> },
            { path: 'ban-be', component: <FriendProfile /> },
            { path: 'anh', component: <ImageProfile /> },
        ],
    },
];
const privateRouter = [

];
export { publicRouter, privateRouter };
