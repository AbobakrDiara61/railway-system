
// Done

import express from "express";
import {
  getAllJourneys,
  getTrainJourneys,
  getJourneysReports,
  getJourneysCountPerTrain,
  getJourneyById,
  getJourneySeats,
  createJourneyHandler,
  updateJourneyHandler,
} from "../controllers/journey.controller.js";
 import { protect } from "../middlewares/authMiddleware.js";

import { adminOnly, superAdminOnly } from "../middlewares/roleMiddleware.js";


const router = express.Router();

// ── Public ────────────────────────────────────────────────────

// GET /api/journeys
// Returns all journeys
router.get("/",         getAllJourneys);    


// GET /api/journeys/trains
// Returns all journeys with their train info// GET /api/journeys
router.get("/trains",    getTrainJourneys);      

// GET /api/journeys/count
// Returns journey count grouped per train// GET /api/journeys/trains
router.get("/count",     protect, getJourneysCountPerTrain); 


// ── Admin only ────────────────────────────────────────────────
 
// GET /api/journeys/reports
// Returns journey analytics/reports
 
router.get("/reports",  protect, adminOnly, getJourneysReports);// GET /api/journeys/reports
// POST /api/journeys
// Creates a new journey
router.post("/",        protect,   adminOnly, createJourneyHandler); // POST /api/journeys
 
// GET /api/journeys/:id/seats
// Returns seat availability for a specific journey                                                // GET /api/journeys/:id
router.get("/:id/seats", protect, getJourneySeats);                                                // GET /api/journeys/:id/seats


// GET /api/journeys/:id
// Returns a single journey by ID
router.get("/:id",     protect,   getJourneyById); 
 


// ── Super Admin only ──────────────────────────────────────────
 

 // PUT /api/journeys/:id
// Updates journey details (departure time, status, etc.)

router.put("/:id",     protect,   superAdminOnly, updateJourneyHandler); // PUT /api/journeys/:id

export default router;