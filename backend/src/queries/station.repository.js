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

(async () => {
    // console.log(await retrieveAllStations());
    console.log(await retrieveNumberOfStationsPerCity());
})()
