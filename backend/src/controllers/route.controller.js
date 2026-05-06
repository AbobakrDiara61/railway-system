//Done
import {
  retrieveAllRoutes,
  retrieveRoutesWithStations,
  retrieveRouteById,
  createRoute,
  deleteRoute,
} from "../queries/route.repository.js";

// GET /api/routes
export const getAllRoutes = async (req, res) => {
  try {
    const routes = await retrieveAllRoutes();
    res.status(200).json({ success: true, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/routes/details
export const getRoutesWithStations = async (req, res) => {
  try {
    const routes = await retrieveRoutesWithStations();
    res.status(200).json({ success: true, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/routes/:id
export const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await retrieveRouteById(id);

    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }

    res.status(200).json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/routes  (admin)
export const createRouteHandler = async (req, res) => {
  try {
    const { route_name, origin_station_id, destination_station_id, distance_km } = req.body;

    if (!route_name || !origin_station_id || !destination_station_id) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newId = await createRoute({
      route_name,
      origin_station_id,
      destination_station_id,
      distance_km,
    });

    res.status(201).json({ success: true, route_id: newId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/routes/:id  (superAdmin)
export const deleteRouteHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const affected = await deleteRoute(id);

    if (!affected) {
      return res.status(404).json({ success: false, message: "Route not found" });
    }

    res.status(200).json({ success: true, message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};