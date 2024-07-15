import pool from "../../../configs/database/database.config";

class Food {
    static async listAllFood() {
        try {
            const query = "SELECT F.*, AVG(R.rate) AS average_rating, COUNT(R.id) AS total_reviews FROM food F LEFT JOIN reviews R ON F.id = R.food_id GROUP BY F.id";
            var [result] = await pool.query(query);
            if (result.length > 0) {
                return result;
            } else {
                return false;
            }
        } catch (error) {
            console.log("Failed: " + error.message);
            return false;
        }
    }

    static async listFoodRecommend() {
        try {
            const query = "SELECT F.id AS id, F.name AS name, F.price, F.ingredients, F.description, F.img_thumbnail, SUM(O.quantity) AS total_orders, AVG(R.rate) AS average_rating, COUNT(R.id) AS total_reviews FROM food F JOIN orders O ON F.id = O.food_id LEFT JOIN reviews R ON F.id = R.food_id GROUP BY F.id, F.name ORDER BY total_orders DESC";
            var [result] = await pool.query(query);
            if (result.length > 0) {
                console.log(result);
                return result;
            } else {
                return false;
            }
        } catch (error) {
            console.log("Failed: " + error.message);
            return false;
        }
    }

    static async findFoodByKeyword(keyword) {
        try {
            const query = "SELECT F.*, AVG(R.rate) AS average_rating, COUNT(R.id) AS total_reviews FROM food F LEFT JOIN reviews R ON F.id = R.food_id WHERE CONCAT(F.name, F.description, F.ingredients) LIKE ? GROUP BY F.id";
            var [result] = await pool.query(query, [`%${keyword}%`]);
            if (result.length > 0) {
                return result;
            } else {
                return false;
            }
        } catch (error) {
            console.log("Failed: " + error.message);
            return false;
        }
    }

    static async findFoodByID(id) {
        try {
            const query = "SELECT F.*, AVG(R.rate) AS average_rating, COUNT(R.id) AS total_reviews FROM food F LEFT JOIN reviews R ON F.id = R.food_id WHERE F.id = ? GROUP BY F.id";
            var [result] = await pool.query(query, [id]);
            if (result.length > 0) {
                return result[0];
            } else {
                return false;
            }
        } catch (error) {
            console.log("Failed: " + error.message);
            return false;
        }
    }
}

module.exports = Food;
