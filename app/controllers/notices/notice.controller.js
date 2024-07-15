import Notices from "../../models/notices/notice.model";

export async function postNoticeController(req, res) {
    const infoReq = {
        user_id: req.body.user_id,
        title_notifi: req.body.title_notifi,
        notices_message: req.body.notices_message
    };


    try {
        const data = await Notices.postNotice(infoReq);
        if (data) {
            res.status(200).json({ "status": true, "message": "Đăng thông báo thành công" });
        } else {
            res.status(404).json({ "status": false, "message": "Không tìm thấy đơn hàng nào" });
        }
    } catch (error) {
        res.status(404).json({ "status": false, "message": "Lỗi server" });
    }

}

export async function getNoticeController(req, res) {
    const idUser = req.params.user_id;
    try {
        const data = await Notices.getNotice(idUser);
        if (data.length > 0) {
            res.status(200).json({ "status": true, "data": data });
        } else {
            res.status(404).json({ "status": false, "message": "Không tìm thấy đơn hàng nào" });
        }
    } catch (error) {
        res.status(404).json({ "status": false, "message": "Lỗi server" });
    }

}