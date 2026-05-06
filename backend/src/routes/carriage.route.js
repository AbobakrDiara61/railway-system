//Done
import { Router } from "express";
import {
    getAllCarriages,
    getCarriagesByTrain,
    getCarriageById,
    getCarriageClassCounts,
    getTrainCapacity,
    createCarriageHandler,
    deleteCarriageHandler,
} from "../controllers/carriage.controller.js";
import { adminOnly, superAdminOnly } from "../middlewares/roleMiddleware.js";
  import { protect} from "../middlewares/authMiddleware.js";

const router = Router();

// ── Public / Passenger ────────────────────────────────────────

// GET /api/carriages
// Returns all carriages
router.get("/", protect,getAllCarriages);

// GET /api/carriages/classes
// Returns count of carriages grouped by class
router.get("/classes",protect, getCarriageClassCounts);

// GET /api/carriages/train/:trainId
// Returns all carriages belonging to a specific train
router.get("/train/:trainId", protect,getCarriagesByTrain);

// GET /api/carriages/train/:trainId/capacity
// Returns total seat capacity per carriage for a specific train
router.get("/train/:trainId/capacity",protect, getTrainCapacity);

// GET /api/carriages/:id
// Returns a single carriage by its ID
router.get("/:id", protect,getCarriageById);
 
// ── Super Admin only ──────────────────────────────────────────

// POST /api/carriages
// Creates a new carriage — requires: train_id, carriage_number, class, capacity
router.post("/",  protect,superAdminOnly, createCarriageHandler);


// DELETE /api/carriages/:id
// Deletes a carriage by ID (cascades to seats)
router.delete("/:id", protect,superAdminOnly,deleteCarriageHandler);

export default router;