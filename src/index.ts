import express from "express";
import { configDotenv } from "dotenv";
import { setupLogin } from "./login";
import { setupControl } from "./control";

configDotenv();

const app = express();
app.use(express.json());

setupLogin(app);
setupControl(app);

const port = process.env.PORT || 9999;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
