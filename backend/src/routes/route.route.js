//Done
import { Router } from "express";
import {
    getAllRoutes,
    getRoutesWithStations,
    getRouteById,
    createRouteHandler,
    deleteRouteHandler,
} from "../controllers/route.controller.js";
import { adminOnly, superAdminOnly } from "../middlewares/roleMiddleware.js";
 import { protect  } from "../middlewares/authMiddleware.js";

const router = Router();

// ── Public ────────────────────────────────────────────────────

// GET /api/routes
// Returns all routes
router.get("/",protect, getAllRoutes);

// GET /api/routes/details
// Returns all routes with their origin & destination station info (joined)
 
router.get("/details",protect, getRoutesWithStations);

// GET /api/routes/:id
// Returns a single route by its ID
router.get("/:id", protect, getRouteById);


// ── Admin only ────────────────────────────────────────────────

// POST /api/routes
// Creates a new route — requires: route_name, origin_station_id, destination_station_id, distance_km
router.post("/",   protect,adminOnly,   createRouteHandler);

// ── Super Admin only ──────────────────────────────────────────

// DELETE /api/routes/:id
// Deletes a route by ID
router.delete("/:id",   protect, superAdminOnly,   deleteRouteHandler);

export default router;