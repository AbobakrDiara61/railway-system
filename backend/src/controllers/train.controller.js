//Done
import {
  retrieveAllTrains,
  retrieveTrainByStatus,
  retrieveTrainByType,
  retrieveTrainTypeAndStatusCounts,
  retrieveTrainJourneys,
  retrieveSpecificTrainJourney,
  retrieveTrainCapacity,
} from "../queries/train.repository.js";

// GET /api/trains
export const getAllTrains = async (req, res) => {
  try {
    const trains = await retrieveAllTrains();
    res.status(200).json({ success: true, data: trains });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/trains/status/:status
export const getTrainByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const trains = await retrieveTrainByStatus(status);

    if (!trains || trains.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No trains found with this status",
      });
    }

    res.status(200).json({ success: true, data: trains });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/trains/type/:type
export const getTrainByType = async (req, res) => {
  try {
    const { type } = req.params;
    const trains = await retrieveTrainByType(type);

    if (!trains || trains.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No trains found with this type",
      });
    }

    res.status(200).json({ success: true, data: trains });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/trains/counts
export const getTrainCounts = async (req, res) => {
  try {
    const counts = await retrieveTrainTypeAndStatusCounts();
    res.status(200).json({ success: true, data: counts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/trains/journeys
export const getTrainJourneys = async (req, res) => {
  try {
    const journeys = await retrieveTrainJourneys();
    res.status(200).json({ success: true, data: journeys });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/trains/search?from=Cairo&to=Alexandria&status=scheduled
export const searchTrains = async (req, res) => {
  try {
    const { from, to, status = "scheduled" } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "Please provide both origin and destination cities",
      });
    }

    const trains = await retrieveSpecificTrainJourney({
      originCity: from,
      destinationCity: to,
      status,
    });

    if (!trains || trains.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No trains found between these cities",
      });
    }

    res.status(200).json({ success: true, data: trains });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/trains/capacity
export const getTrainCapacity = async (req, res) => {
  try {
    const capacity = await retrieveTrainCapacity();
    res.status(200).json({ success: true, data: capacity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};