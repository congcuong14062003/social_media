import FriendProfile from '../components/FriendProfile/FriendProfile';
import ImageProfile from '../components/ImageProfile/ImageProfile';
import PostProfile from '../components/PostProfile/PostProfile';
import config from '../configs';
import CreateStory from '../pages/CreateStory/CreateStory';
import CreateFaceRecognitionPage from '../pages/FaceRecognitionPage/CreateFaceRecognition/CreateFaceRecognition';
import LoginFaceRecognition from '../pages/FaceRecognitionPage/LoginFaceRecognition/LoginFaceRecognition';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import FriendInvitations from '../pages/Friends/FriendInvitations';
import FriendList from '../pages/Friends/FriendList';
import Friends from '../pages/Friends/Friends';
import FriendSuggestion from '../pages/Friends/FriendsSuggestion';
import InvitedFriends from '../pages/Friends/InvitedFriends';
import GroupPage from '../pages/GroupPage/GroupPage';
import HomePage from '../pages/HomePage/HomePage';
import Login from '../pages/Login/Login';
import MessagesPage from '../pages/Messages/Messages';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import SettingPage from '../pages/SettingPage/SettingPage';
import Signup from '../pages/Signup/Signup';
import StoryPage from '../pages/StoryPage/StoryPage';
import VideoCall from '../pages/VideoCall/VideoCall';
import VideoPage from '../pages/VideoPage/VideoPage';

const publicRouter = [
    {
        path: config.routes.login,
        component: Login,
        layout: Login,
        requireAuth: false,
    },
    {
        path: config.routes.loginFace,
        component: LoginFaceRecognition,
        layout: LoginFaceRecognition,
        requireAuth: false,
    },
    {
        path: config.routes.forgotPassword,
        component: ForgotPassword,
        layout: ForgotPassword,
        requireAuth: false,
    },
    {
        path: config.routes.signup,
        component: Signup,
        layout: Signup,
        requireAuth: false,
    },
    {
        path: config.routes.home,
        component: HomePage,
        requireAuth: true,
    },
    {
        path: config.routes.setting,
        component: SettingPage,
        requireAuth: true,
    },
    {
        path: config.routes.createFace,
        component: CreateFaceRecognitionPage,
        requireAuth: true,
    },
    {
        path: config.routes.video,
        component: VideoPage,
        requireAuth: true,
    },
    {
        path: config.routes.friends,
        component: Friends,
        requireAuth: true,
        childrenRouter: [
            { path: 'suggestion', component: <FriendSuggestion /> },
            { path: 'invitations', component: <FriendInvitations /> },
            { path: 'list-friend', component: <FriendList /> },
            { path: 'invited', component: <InvitedFriends /> },
        ],
    },
    {
        path: config.routes.group,
        component: GroupPage,
        requireAuth: true,
    },
    {
        path: config.routes.createStory,
        component: CreateStory,
        requireAuth: true,
    },
    {
        path: `${config.routes.story}/:id_story`,
        component: StoryPage,
        requireAuth: true,
    },
    {
        path: `${config.routes.messages}/:id_receiver`,
        component: MessagesPage,
        requireAuth: true,
    },
    {
        path: `${config.routes.messages}/video-call`,
        component: VideoCall,
        requireAuth: true,
        layout: VideoCall,
    },
    {
        path: `${config.routes.messages}/audio-call`,
        exact: true,
        requireAuth: true,
        component: () => <VideoCall isVideoCall={false} />,
    },
    {
        path: `${config.routes.profile}/:id_user`,
        component: ProfilePage,
        requireAuth: true,
        childrenRouter: [
            { path: '', component: <PostProfile /> },
            { path: 'ban-be', component: <FriendProfile /> },
            { path: 'anh', component: <ImageProfile /> },
        ],
    },
];

export { publicRouter };
