import express from 'express'
import {
    register,
    login,
    logout,
    deleteAccount,
    verifyOTP,
    generateOTPCode,
    isAuthenticated
} from "../controllers/auth.controller.js"
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/verify-otp", protect, verifyOTP);
router.post("/generate-otp", protect, generateOTPCode);
router.delete("/delete-account", protect, deleteAccount);
router.get("/is-authenticated", protect, isAuthenticated);

export default router