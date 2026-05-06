import {
    retrieveAllSeats,
    retrieveSeatsCountsPerCarriage,
    retrieveSeatCarriageTrainDetails,
    retrieveSeatsAvailability,
} from "../queries/seat.repository.js";

// GET /seats
export const getAllSeats = async (req, res) => {
    try {
        const seats = await retrieveAllSeats();
        res.status(200).json({
            success: true,
            count: seats.length,
            data: seats,
        });
    } catch (error) {
        console.error("Error in getAllSeats controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve seats",
            
        });
    }
};

// GET /seats/counts-per-carriage
export const getSeatsCountsPerCarriage = async (req, res) => {
    try {
        const counts = await retrieveSeatsCountsPerCarriage();
        res.status(200).json({
            success: true,
            count: counts.length,
            data: counts,
        });
    } catch (error) {
        console.error("Error in getSeatsCountsPerCarriage controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve seat counts per carriage",
            
        });
    }
};

// GET /seats/train-details
export const getSeatCarriageTrainDetails = async (req, res) => {
    try {
        const result = await retrieveSeatCarriageTrainDetails();
        res.status(200).json({
            success: true,
            count: result.length,
            data: result,
        });
    } catch (error) {
        console.error("Error in getSeatCarriageTrainDetails controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve seat-carriage-train details",
           
        });
    }
};

// GET /seats/availability
export const getSeatsAvailability = async (req, res) => {
    try {
        const result = await retrieveSeatsAvailability();
        res.status(200).json({
            success: true,
            count: result.length,
            data: result,
        });
    } catch (error) {
        console.error("Error in getSeatsAvailability controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve seats availability",
            
        });
    }
};