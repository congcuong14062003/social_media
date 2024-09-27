import FriendProfile from '../components/FriendProfile/FriendProfile';
import ImageProfile from '../components/ImageProfile/ImageProfile';
import PostProfile from '../components/PostProfile/PostProfile';
import CreateStory from '../pages/CreateStory/CreateStory';
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
import Signup from '../pages/Signup/Signup';
import VideoPage from '../pages/VideoPage/VideoPage';

const publicRouter = [
    {
        path: '/login',
        component: Login,
        layout: Login,
        requireAuth: false,
    },
    {
        path: '/signup',
        component: Signup,
        layout: Signup,
        requireAuth: false,
    },
    {
        path: '/',
        component: HomePage,
        requireAuth: true,
    },
    {
        path: '/video',
        component: VideoPage,
        requireAuth: true,
    },
    {
        path: '/friends',
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
        path: '/group',
        component: GroupPage,
        requireAuth: true,
    },
    {
        path: '/story/create',
        component: CreateStory,
        requireAuth: true,
    },
    {
        path: '/messages/:id_receiver',
        component: MessagesPage,
        requireAuth: true,
    },
    {
        path: '/profile/:id_user',
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
