import { getAllFood, getFoodByID, getFoodBykeyword, getFoodRecommend } from "../../controllers/foods/food.controller";
export default function FoodRouter(app) {
    app.get("/", getAllFood);
    app.get("/find/:idFood", getFoodByID);
    app.post("/search", getFoodBykeyword);
    app.get("/recommend", getFoodRecommend);
    return app;
}