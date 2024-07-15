import { getNoticeController, getOrder, postOrder } from "../../controllers/orders/order.controller";
export default function OrderRouter(app) {
    app.get("/list/:user_id", getOrder);
    app.post("/post_orders", postOrder);
    app.get("/get_notices/:id_user", getNoticeController);
    return app;
}