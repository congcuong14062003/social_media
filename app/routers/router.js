import UserRouter from './users/user.router';
import FoodRouter from './foods/food.router';
import ReviewRouter from './reviews/review.router';
import OrderRouter from './orders/order.router';
import express from 'express';
import NoticesRouter from './notices/notice.router';
const router = express.Router();

export default function RouterMain(app){
    app.use("/users", UserRouter(router));
    app.use("/foods", FoodRouter(router));
    app.use("/reviews", ReviewRouter(router));
    app.use("/orders", OrderRouter(router));
    app.use("/notices", NoticesRouter(router));
    return app;
}