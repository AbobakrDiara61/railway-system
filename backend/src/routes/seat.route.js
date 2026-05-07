//Done
import { Router } from "express";
import {
    getAllSeats,
    getSeatsCountsPerCarriage,
    getSeatCarriageTrainDetails,
    getSeatsAvailability,
} from "../controllers/seat.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/roleMiddleware.js";

const router = Router();

// ── Public ────────────────────────────────────────────────────
// Any logged-in user can check seat availability (needed for booking)
router.get("/availability", protect, getSeatsAvailability);

// ── Admin / Staff only ────────────────────────────────────────
router.get("/", protect,adminOnly, getAllSeats);
router.get("/counts-per-carriage",protect, adminOnly, getSeatsCountsPerCarriage);
router.get("/train-details",protect, adminOnly, getSeatCarriageTrainDetails);

export default router;