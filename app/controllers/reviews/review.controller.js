import Reviews from "../../models/reviews/review.model";
export async function getReview(req, res) {
    const idFood = req.params.food_id;
    try {
        const data = await Reviews.listReviews(idFood);
        console.log(data);
        if (data.length > 0) {
            res.status(200).json({ "status": true, "data": data });
        } else {
            res.status(404).json({ "status": false, "message": "Không tìm thấy bình luận nào" });
        }
    } catch (error) {
        res.status(404).json({ "status": false, "message": "Lỗi server" });
    }

}

export async function postReview(req, res) {
    const review = {
        food_id: req.body.food_id,
        user_id: req.body.user_id,
        comment: req.body.comment,
        rate: req.body.rate
    };

    console.log(review);
    try {
        const data = await Reviews.uploadReviews(review);
        console.log(data);
        if (data){
            res.status(200).json({ "status": true, "message": "Thêm bình luận thành công" });
        } else {
            res.status(404).json({ "status": false, "message": "Lỗi bất định !" });
        }
    } catch (error) {
        res.status(404).json({ "status": false, "message": "Lỗi server" });
    }

}