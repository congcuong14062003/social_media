import { Router } from 'express';
import Authentication from '../../middlewares/authentication/authentication_token';
import { Authorization } from '../../middlewares/authorization/authorization_token';

// Cấu hình router
const FriendRouter = (router = Router()) => {
    // Tạo yêu cầu kết bạn
    router.post('/request/:id', Authentication, Authorization, createFriendRequest);

    // Chấp nhận lời mời kết bạn
    router.put('/accept/:id', Authentication, Authorization, acceptFriend);

    // Lấy tình trạng bạn bè
    router.post('/status', statusFriend);

    // Lấy danh sách bạn bè
    router.get('/list/:id', getFriends);

    // Lấy tất cả các yêu cầu kết bạn bởi ID của người nhận
    router.post('/requests/list', Authentication, Authorization, getAllRequestorsByReceiverId);

    // Xóa bạn bè
    router.post('/delete', Authentication, Authorization, deleteFriend);

    return router;
};

export default FriendRouter;
