import {
    createStation,
    updateStation,
    deleteStation,
    retrieveStationById,
    retrieveAllStations,
    retrieveNumberOfStationsPerCity
} from '../queries/station.repository.js';

const createStationHandler = async (req, res) => {
    try {
        const { 
            station_name, 
            city, 
            state 
        } = req.body;
        if(!station_name || !city || !state) 
            return res.status(400).json({ success: false, message: "All fields are required" });
        
        const stationId = await createStation({ station_name, city, state });
        const newStation = await retrieveStationById(stationId);
        return res.status(201).json({ success: true, message: "Station created successfully", station: newStation });
    } catch (error) {
        console.error({ message: "Error in createStationHandler", error });
        return res.status(500).json({ success: false, message: "Failed to create station" });
    }
}

const updateStationHandler = async (req, res) => {
    try {
        const { 
            station_name, 
            city, 
            state, 
            station_id
        } = req.body;
        if(!station_name || !city || !state || !station_id) 
            return res.status(400).json({ success: false, message: "All fields are required" });
        
        const result = await updateStation(req.body);
        if(result.affectedRows === 0) 
            return res.status(404).json({ success: false, message: "Station is not found" });
        const updatedStation = await retrieveStationById(station_id);
        return res.status(200).json({ success: true, message: "Station updated successfully", station: updatedStation });
    } catch (error) {
        console.error({ message: "Error in updateStationHandler", error });
        return res.status(500).json({ success: false, message: "Failed to update station" });
    }
}

const deleteStationnHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id) 
            return res.status(400).json({ success: false, message: "Station ID is required" });
        
        const result = await deleteStation(id);

        if(result.affectedRows === 0) 
            return res.status(404).json({ success: false, message: "Station is not found" });

        return res.status(200).json({ success: true, message: "Station deleted successfully" });
    } catch (error) {
        console.error({ message: "Error in deleteStationnHandler", error });
        return res.status(500).json({ success: false, message: "Failed to delete station" });
    }
}

const getStationById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id) 
            return res.status(400).json({ success: false, message: "Station ID is required" });
        
        const station = await retrieveStationById(id);
        if(station.length === 0) 
            return res.status(404).json({ success: false, message: "Station is not found" });
        
        return res.status(200).json({ success: true, message: "Station found successfully", station });
    } catch (error) {
        console.error({ message: "Error in getStationById", error });
        return res.status(500).json({ success: false, message: "Failed to get station" });
    }
}

const getAllStations = async (req, res) => {
    try {
        const stations = await retrieveAllStations();
        if(stations.length === 0)
            return res.status(404).json({ success: false, message: "No stations are found" });
        return res.status(200).json({ success: true, message: "All stations are fetched successfully", stations });
    } catch (error) {
        console.error({ message: "Error in getAllStations", error });
        return res.status(500).json({ success: false, message: "Failed to get all the stations" });
    }
}

const getReport = async (req, res) => {
    try {
        const numberOfStationsPerCity = await retrieveNumberOfStationsPerCity();
        if(numberOfStationsPerCity.length === 0)
            return res.status(404).json({ success: false, message: "No data to generate the report" });
        const report = {
            numberOfStationsPerCity: numberOfStationsPerCity,
        };
        return res.status(200).json({ success: true, message: "Report generated successfully", report });
    } catch (error) {
        console.error({ message: "Error in getReport", error });
        return res.status(500).json({ success: false, message: "Failed to generate the report" });
    }
}

export {
    createStationHandler,
    updateStationHandler,
    deleteStationnHandler,
    getStationById,
    getAllStations,
    getReport
}
