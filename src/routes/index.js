import GroupPage from "../pages/GroupPage/GroupPage";
import HomePage from "../pages/HomePage/HomePage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import VideoPage from "../pages/VideoPage/VideoPage";

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
        path: '/profile',
        component: ProfilePage,
    }
];
const privateRouter = [];
export { publicRouter, privateRouter };
