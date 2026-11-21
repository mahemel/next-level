import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

const USER_ROLE = {
    admin: "admin",
    agent: "agent",
    user: "user",
} as const;

// /api/v1/users
router.post("/", userController.createUser);
router.get(
    "/",
    auth(USER_ROLE.admin, USER_ROLE.agent),
    userController.getAllUser,
);
router.get(
    "/:id",
    auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
    userController.getSignleUser,
);
router.patch(
    "/:id",
    auth(USER_ROLE.admin, USER_ROLE.user),
    userController.updateUser,
);
router.delete("/:id", auth(USER_ROLE.admin), userController.deleteUser);

export const userRoute = router;
