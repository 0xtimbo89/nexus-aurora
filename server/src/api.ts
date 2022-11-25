import * as dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { users } from "./users";
import { utils } from "./utils";
import { assets } from "./assets";

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 8888;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/users", users);
app.use("/utils", utils);
app.use("/assets", assets);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
