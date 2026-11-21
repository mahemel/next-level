import {
    Router,
    type NextFunction,
    type Request,
    type Response,
} from "express";
import { userController } from "./user.controller";

const router = Router();

const auth = (req: Request, res: Response, next: NextFunction) => {
    console.log("Protected Router");
    next();
};

// /api/v1/users
router.post("/", userController.createUser);
router.get("/", auth, userController.getAllUser);
router.get("/:id", userController.getSignleUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export const userRoute = router;
