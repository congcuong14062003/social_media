import pool from "../../../configs/database/database.config";
class Notices {
    static postNotice = async (params) => {
        try {
            const noticeSql = "INSERT INTO notices (user_id, title_notifi ,notices_message) VALUES (?, ?, ?);";
            await pool.query(noticeSql, [params.user_id, params.title_notifi, params.notices_message]);
            return true;
        } catch (error) {
            return false;
        }
    }

    static getNotice = async (id) => {
        try {
            const noticeSql = "SELECT * FROM notices WHERE user_id = ? ORDER BY notices_datetime DESC";
            const [result] = await pool.query(noticeSql, [id]);
            return result;
        } catch (error) {
            return false;
        }
    }
}
export default Notices