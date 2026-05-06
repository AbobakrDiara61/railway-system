//Done
import {
  retrieveAllJourneys,
  retrieveTrainJourneys,
  retrieveJourneysReports,
  retrieveJourneyById,
  retrieveJourneysCountPerTrain,
  retrieveJourneySeats,
  createJourney,
  updateJourney,
} from "../queries/journey.repository.js";

// GET /api/journeys
export const getAllJourneys = async (req, res) => {
  try {
    const journeys = await retrieveAllJourneys();
    res.status(200).json({ success: true, data: journeys });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/journeys/trains
export const getTrainJourneys = async (req, res) => {
  try {
    const journeys = await retrieveTrainJourneys();
    res.status(200).json({ success: true, data: journeys });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/journeys/reports
export const getJourneysReports = async (req, res) => {
  try {
    const reports = await retrieveJourneysReports();
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/journeys/count
export const getJourneysCountPerTrain = async (req, res) => {
  try {
    const counts = await retrieveJourneysCountPerTrain();
    res.status(200).json({ success: true, data: counts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/journeys/:id
export const getJourneyById = async (req, res) => {
  try {
    const { id } = req.params;
    const journey = await retrieveJourneyById(id);

    if (!journey) {
      return res.status(404).json({ success: false, message: "Journey not found" });
    }

    res.status(200).json({ success: true, data: journey });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/journeys/:id/seats
export const getJourneySeats = async (req, res) => {
  try {
    const { id } = req.params;
    const seats = await retrieveJourneySeats(id);

    if (!seats || seats.length === 0) {
      return res.status(404).json({ success: false, message: "No seats found for this journey" });
    }

    res.status(200).json({ success: true, data: seats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/journeys  (admin)
export const createJourneyHandler = async (req, res) => {
  try {
    const { train_id, route_id, departure_date_time, arrival_date_time, status } = req.body;

    if (!train_id || !route_id || !departure_date_time || !arrival_date_time) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newId = await createJourney({
      train_id,
      route_id,
      departure_date_time,
      arrival_date_time,
      status: status || "scheduled",
    });

    res.status(201).json({ success: true, journey_id: newId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/journeys/:id  (admin)
export const updateJourneyHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { departure_date_time, arrival_date_time, status } = req.body;

    const affected = await updateJourney(id, {
      departure_date_time,
      arrival_date_time,
      status,
    });

    if (!affected) {
      return res.status(404).json({ success: false, message: "Journey not found" });
    }

    res.status(200).json({ success: true, message: "Journey updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};