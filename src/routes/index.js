import HomePage from "../pages/HomePage/HomePage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";

const publicRouter = [
    {
        path: '/',
        component: HomePage,
    },
    {
        path: '/profile',
        component: ProfilePage,
    }
];
const privateRouter = [];
export { publicRouter, privateRouter };
