import pool from "../../../configs/database/database.js";
class Users {
    static async signUpAction(param) {
        console.log(param);
        try {
            const query = "insert into users(name, phone_number, address, password, avatar_thumbnail) values(?,?,?,?,?)";
            const [result] = await pool.execute(query, [
                param.name,
                param.phone_number,
                param.address,
                param.password,
                param.avatar_thumbnail,
            ]);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }
    static async checkPhoneNumber(phone_number) {
        try {
            const query = "SELECT * FROM Users WHERE phone_number = ?";
            const [result] = await pool.execute(query, [phone_number]);

            if (result.length > 0) {
                return true;
            } else {

                return false;
            }
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

}

module.exports = Users;