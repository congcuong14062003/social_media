import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connect from "./app/db/connect.js";
import RouterMain from "./app/routers/router.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
connect();
const PORT = process.env.PORT || 5000;
RouterMain(app);
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
