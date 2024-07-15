import pool from "../../../configs/database/database.config";
class Orders {
    static listOrder = async (id) => {
        try {
            const sql = "SELECT O.user_id, O.id as order_id,F.price , F.id as food_id, F.name, F.ingredients, F.img_thumbnail, O.order_datetime, O.quantity ,O.total_price FROM orders as O INNER JOIN food as F ON O.food_id = F.id WHERE O.user_id = ? ORDER BY O.order_datetime DESC";
            const [result] = await pool.query(sql, [id]);
            if (result.length > 0) {
                return result;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    static uploadOrder = async (params) => {
        try {
            const sql = "INSERT INTO orders (food_id, user_id, quantity, total_price) VALUES (?,?,?,?);";
            await pool.query(sql, [params.food_id, params.user_id, params.quantity, params.total_price]);

            const updateSql = "UPDATE food SET total_orders = total_orders + ? WHERE id = ?;";
            await pool.query(updateSql, [params.quantity, params.food_id]);

            
            return true;

        } catch (error) {
            return false;
        }
    }

    static getNotice = async (id) => {
        try {
            const noticeSql = "SELECT N.id AS notice_id, N.notices_datetime, N.notices_message, F.img_thumbnail AS food_image, F.name AS food_name, O.quantity, O.id AS order_id FROM notices N JOIN food F ON N.food_id = F.id JOIN orders O ON N.user_id = O.user_id AND N.food_id = O.food_id WHERE N.user_id = ? order by notices_datetime desc";
            const [result] = await pool.query(noticeSql, [id]);
            console.log(id);
            return result;

        } catch (error) {
            return false;
        }
    }

}
export default Orders;