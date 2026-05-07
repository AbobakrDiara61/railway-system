//Done
import {
  retrieveAllCarriages,
  retrieveCarriagesByTrain,
  retrieveCarriageById,
  retrieveCarriageClassCounts,
  retrieveTrainCapacityByCarriage,
  createCarriage,
  deleteCarriage,
} from "../queries/carriage.repository.js";

// GET /api/carriages
export const getAllCarriages = async (req, res) => {
  try {
    const carriages = await retrieveAllCarriages();
    res.status(200).json({ success: true, data: carriages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/carriages/train/:trainId
export const getCarriagesByTrain = async (req, res) => {
  try {
    const { trainId } = req.params;
    const carriages = await retrieveCarriagesByTrain(trainId);

    if (!carriages || carriages.length === 0) {
      return res.status(404).json({ success: false, message: "No carriages found for this train" });
    }

    res.status(200).json({ success: true, data: carriages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/carriages/:id
export const getCarriageById = async (req, res) => {
  try {
    const { id } = req.params;
    const carriage = await retrieveCarriageById(id);

    if (!carriage) {
      return res.status(404).json({ success: false, message: "Carriage not found" });
    }

    res.status(200).json({ success: true, data: carriage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/carriages/classes  (admin)
export const getCarriageClassCounts = async (req, res) => {
  try {
    const counts = await retrieveCarriageClassCounts();
    res.status(200).json({ success: true, data: counts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/carriages/train/:trainId/capacity  (admin)
export const getTrainCapacity = async (req, res) => {
  try {
    const { trainId } = req.params;
    const capacity = await retrieveTrainCapacityByCarriage(trainId);

    if (!capacity) {
      return res.status(404).json({ success: false, message: "Train not found" });
    }

    res.status(200).json({ success: true, data: capacity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/carriages  (admin)
export const createCarriageHandler = async (req, res) => {
  try {
    const { train_id, carriage_number, class: carriageClass, capacity } = req.body;

    if (!train_id || !carriage_number || !carriageClass) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newId = await createCarriage({
      train_id,
      carriage_number,
      class: carriageClass,
      capacity: capacity || 50,
    });

    res.status(201).json({ success: true, carriage_id: newId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/carriages/:id  (superAdmin)
export const deleteCarriageHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const affected = await deleteCarriage(id);

    if (!affected) {
      return res.status(404).json({ success: false, message: "Carriage not found" });
    }

    res.status(200).json({ success: true, message: "Carriage deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};