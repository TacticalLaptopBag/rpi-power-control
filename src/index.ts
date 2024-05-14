import express from "express";
import { configDotenv } from "dotenv";
import { setupLogin } from "./login";
import { setupControl } from "./control";
import { setupFrontend } from "./fontend";

configDotenv();

const app = express();
app.use(express.json());

setupLogin(app);
setupControl(app);
setupFrontend(app);

const port = process.env.PORT || 9999;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
