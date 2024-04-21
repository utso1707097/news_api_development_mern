import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middleware/authenticate.js";
import ProfileController from "../controllers/profileController.js";


const router = Router();

router.post("/auth/register",AuthController.register);
router.post("/auth/login",AuthController.login);

// Profile routes
router.get("/profile",authMiddleware,ProfileController.index); //Private route

export default router;