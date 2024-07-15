import mysql from "mysql2";
async function connect() {
  // Kết nối đến MySQL
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL database:", err.stack);
      return;
    }
    console.log("Connected to MySQL database as id", connection.threadId);
  });
}

export default connect;
