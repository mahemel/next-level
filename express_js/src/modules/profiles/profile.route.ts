import { Router } from "express";
import { profileController } from "./profile.controller";

const router = Router();

// /api/v1/profiles
router.post("/", profileController.createProfile);

export const profileRoute = router;
