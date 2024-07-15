import { getNoticeController, postNoticeController } from "../../controllers/notices/notice.controller";

export default function NoticesRouter(app) {
    app.get("/list_notices/:user_id", getNoticeController);
    app.post("/post_notices", postNoticeController);

    return app;
}