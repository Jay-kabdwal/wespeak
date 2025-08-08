import express, { Router } from "express"
import { login, logout, signup, onbaord } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup",signup)
router.post("/login", login)
router.post("/logout",logout)
//protectedRoutes
router.post("/onboarding", protectedRoute, onbaord);


export default router