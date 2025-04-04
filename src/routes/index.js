import FriendProfile from '../components/FriendProfile/FriendProfile';
import GroupProfile from '../components/GroupProfile/GroupProfile';
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
import CreateGroupPage from '../pages/GroupPage/CreateGroup/CreateGroupPage';
import EditInfoGroupPage from '../pages/GroupPage/EditInfoGroup/EditInfoGroup';
import GroupAdminPage from '../pages/GroupPage/GroupAdmin/GroupAdminPage';
import GroupAdminMemberPage from '../pages/GroupPage/GroupAdminMember/GroupAdminMemberPage';
import GroupHomePage from '../pages/GroupPage/GroupHome/GroupHome';
import GroupMemberPage from '../pages/GroupPage/GroupMember/GroupMember';
import ListPostGroup from '../pages/GroupPage/ListPostGroup/ListPostGroup';
import HomePage from '../pages/HomePage/HomePage';
import Login from '../pages/Login/Login';
import MessagesPage from '../pages/Messages/Messages';
import PostDetail from '../pages/PostDetail/PostDetail';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import SettingPage from '../pages/SettingPage/SettingPage';
import Signup from '../pages/Signup/Signup';
import StoryPage from '../pages/StoryPage/StoryPage';
import TestPage from '../pages/TestPage/TestPage';
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
    // group
    {
        path: config.routes.group,
        component: ListPostGroup,
        requireAuth: true,
    },
    {
        path: `${config.routes.group}/:group_id`,
        component: GroupHomePage,
        requireAuth: true,
    },
    {
        path: config.routes.creategroup,
        component: CreateGroupPage,
        requireAuth: true,
        
    },
    {
        path:  `${config.routes.group}/:group_id/members`,
        requireAuth: true,
        component: GroupMemberPage
      },
    {
        path: `${config.routes.group}/:group_id/admin/members`,
        requireAuth: true,
        component: GroupAdminMemberPage,
    },
    {
        path: `${config.routes.group}/:group_id/admin`,
        requireAuth: true,
        component: GroupAdminPage,
    },

      {
        path: `${config.routes.group}/:group_id/admin/edit`,
        requireAuth: true,
        component: EditInfoGroupPage
      },

    // story
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
        path: `${config.routes.post}/:id_post`,
        component: PostDetail,
        requireAuth: true,
    },
    {
        path: config.routes.test,
        component: TestPage,
        requireAuth: true,
    },
    {
        path: `${config.routes.messages}/:idReceiver`,
        component: MessagesPage,
        requireAuth: true,
    },
    {
        path: config.routes.messages,
        component: MessagesPage,
        requireAuth: true,
    },
    {
        path: `${config.routes.messages}/video-call`,
        component: () => <VideoCall isVideoCall={true} />,
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
            { path: 'group', component: <GroupProfile /> },
        ],
    },
];

export { publicRouter };
