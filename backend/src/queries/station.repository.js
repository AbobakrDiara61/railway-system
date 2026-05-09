import pool from "../config/db.js";

export const retrieveAllStations = async () => {
    try {
        const [stations, _] = await pool.query(`
            SELECT * FROM station;
        `)
        return stations;
    } catch (error) {
        console.log("Error happened in retrieveAllStations query");
        console.error(error);
    }
}

// GET station (client)
export const retrieveStationById = async (stationId) => {
    try {
        const [station, _] = await pool.query(`
            SELECT * FROM station WHERE station_id = ?;
        `, [stationId])
        return station;
    } catch (error) {
        console.log("Error happened in retrieveStationById query");
        console.error(error);
    }
}

export const retrieveNumberOfStationsPerCity = async () => {
    try {
        const [counts, _] = await pool.query(`
            SELECT city, COUNT(*)
            FROM station
            GROUP BY city;
        `);

        return counts;
    } catch (error) {
        console.log("Error happened in retrieveNumberOfStationsPerCity query");
        console.error(error);
    }
}

// Creating station (admin only) 
export const createStation = async (station) => {
    const { 
        station_name, 
        city, 
        state 
    } = station;
    try {
        const [newStation, _] = await pool.query(`
            INSERT INTO station (station_name, city, state)
            VALUES (?, ?, ?);
        `, [station_name, city, state])
        return newStation.insertId;
    } catch (error) {
        console.log("Error happened in createStation query");
        console.error(error);
    }
}

// Updating station (admin only) 
export const updateStation = async (station) => {
    const { 
        station_name, 
        city, 
        state, 
        station_id
    } = station;
    try {
        const [updatedStation, _] = await pool.query(`
            UPDATE station
            SET station_name = ?, city = ?, state = ?
            WHERE station_id = ?;
        `, [station_name, city, state, station_id])
        return {
            info: updatedStation.info,
            affectedRows: updatedStation.affectedRows
        };
    } catch (error) {
        console.log("Error happened in updateStation query");
        console.error(error);
    }
}

// Deleting station (admin only) 
export const deleteStation = async (stationId) => {
    try {
        const [deletedStation, _] = await pool.query(`
            DELETE FROM station
            WHERE station_id = ?;
        `, [stationId])
        return deletedStation.affectedRows;
    } catch (error) {
        console.log("Error happened in deleteStation query");
        console.error(error);
    }
}

(async () => {
    // console.log(await retrieveAllStations());
    // console.log(await retrieveNumberOfStationsPerCity());
})()
