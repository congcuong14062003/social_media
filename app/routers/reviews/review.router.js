import { getReview,postReview } from "../../controllers/reviews/review.controller";
export default function ReviewRouter(app) {
    app.get("/food_id/:food_id", getReview);
    app.post("/post_reviews", postReview);
    return app;
}