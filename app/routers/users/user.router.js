import { userLogin, userSignup,getUserByID, postUpdateUserInfo, updateAvatar } from '../../controllers/users/user.controller';
import multer from "multer";
const storage = multer.memoryStorage(); // Sử dụng MemoryStorage
const upload = multer({ storage: storage });

export default function UserRouter(app) {
    app.post("/login", userLogin);
    app.post("/signup", userSignup);
    app.get("/info/:id", getUserByID);
    app.post("/update/info", postUpdateUserInfo);
    app.post("/upload/avartar/:id_user", upload.single('avatar_thumbnail'), updateAvatar);
    return app;
}