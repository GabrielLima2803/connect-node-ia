import express, {Application} from "express";
import { env } from "./config/dotenv/env";
import { routes } from "./routes";
import bodyParser from "body-parser";
import { setupSwagger } from './config/swagger/swagger-setup';
const app: Application = express();
const port: number = env.PORT;

app.use(express.json());
app.use("/api", routes)
setupSwagger(routes);

app.listen(port, () => {
    console.log(`🚀🚀🚀 Server is running on http://localhost:${port}`);
});