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
import globalErrorHandler from "./middleware/globalErrorHandler";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();
// Adds headers: Access-Control-Allow-Origin: *
const corsOptions = {
    origin: ["http://localhost:5100"],
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

//Global Error Handling middleware
app.use(globalErrorHandler);

export default app;
