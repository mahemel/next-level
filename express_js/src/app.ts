import express, {
    type Application,
    type Request,
    type Response,
} from "express";

import { userRoute } from "./modules/users/user.route";

const app: Application = express();

app.use(express.json());

app.use("/api/v1/users", userRoute);

app.get("/", (req: Request, res: Response) => {
    // res.send("Welcome to Express Server");
    return res.status(200).json({
        success: true,
        message: "Welcome to Express Server",
        author: "MH",
    });
});

export default app;
