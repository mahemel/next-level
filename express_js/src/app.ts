import express, {
    type Application,
    type NextFunction,
    type Request,
    type Response,
} from "express";

import { userRoute } from "./modules/users/user.route";
import { profileRoute } from "./modules/profiles/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import logger from "./middleware/logger";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.use("/api/v1/users", userRoute);
app.use("/api/v1/profiles", profileRoute);
app.use("/api/v1/auth", authRoute);

app.get("/", (req: Request, res: Response) => {
    // res.send("Welcome to Express Server");
    return res.status(200).json({
        success: true,
        message: "Welcome to Express Server",
        author: "MH",
    });
});

export default app;
