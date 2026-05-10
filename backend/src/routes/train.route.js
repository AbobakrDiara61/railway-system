//Done
import express from "express";
import {
  getAllTrains,
  getTrainByStatus,
  getTrainByType,
  getTrainCounts,
  getTrainJourneys,
  searchTrains,
  getTrainCapacity,
  getScheduledTrainJourneys,
} from "../controllers/train.controller.js";
 import { protect } from "../middlewares/authMiddleware.js";

import { adminOnly } from "../middlewares/roleMiddleware.js";

const router = express.Router();
// GET /api/trains/search?from=&to=
// Search trains by origin and destination query params
router.get("/search", protect,searchTrains);
 
// GET /api/trains/journeys
// Returns all trains with their associated journeys
router.get("/journeys", protect,getTrainJourneys);
// GET /api/trains/scheduled-journeys
// Returns all trains with their associated scheduled journeys
router.get("/scheduled-journeys", protect, getScheduledTrainJourneys);
 
// ── Passenger (logged in) ─────────────────────────────────────
 
// GET /api/trains
// Returns all trains
router.get("/", protect, getAllTrains);
 
// GET /api/trains/type/:type
// Returns trains filtered by type (e.g. express, regional)
router.get("/type/:type", protect, getTrainByType);

// ── Admin only ────────────────────────────────────────────────

// GET /api/trains/counts
// Returns count of trains grouped by status or type
router.get("/counts",       protect,    adminOnly, getTrainCounts);    // GET /api/trains/counts

 
// GET /api/trains/capacity
// Returns seat capacity summary per train
router.get("/capacity",       protect,  adminOnly, getTrainCapacity);  // GET /api/trains/capacity

// GET /api/trains/status/:status
// Returns trains filtered by status (e.g. active, maintenance)
router.get("/status/:status",   protect,adminOnly, getTrainByStatus);  // GET /api/trains/status/:status
 

export default router;