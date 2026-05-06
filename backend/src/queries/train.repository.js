//Done
import pool from "../config/db.js";

export const retrieveAllTrains = async () => {
    try {
        const [trains, _] = await pool.query(`
            SELECT *
            FROM train;
        `)
        return trains;
    } catch (error) {
        console.log("Error happened in retrieveAllTrains query");
        console.error(error);
    }
}

export const retrieveTrainByStatus = async (status) => {
    try {
        const [trains, _] = await pool.query(`
            SELECT * FROM train WHERE status = ?;
        `, [status])
        return trains;
    } catch (error) {
        console.log("Error happened in retrieveTrainByStatus query");
        console.error(error);
    }
}

export const retrieveTrainByType = async (type) => {
    try {
        const [trains, _] = await pool.query(`
            SELECT * FROM train WHERE type = ?;
        `, [type])
        return trains;
    } catch (error) {
        console.log("Error happened in retrieveTrainByType query");
        console.error(error);
    }
}

export const retrieveTrainTypeAndStatusCounts = async () => {
    try {
        const [trainsTypeCounts, _] = await pool.query(`
            SELECT type, COUNT(*) as Number
            FROM TRAIN
            GROUP BY type;
        `)

        const [trainsStatusCounts, __] = await pool.query(`
            SELECT status, COUNT(*) as Number
            FROM TRAIN
            GROUP BY status;
        `)
        return { trainsTypeCounts, trainsStatusCounts };
    } catch (error) {
        console.log("Error happened in retrieveTrainTypeAndStatusCounts query");
        console.error(error);
    }
}

export const retrieveTrainJourneys = async () => {
    try {
        const [trains, _] = await pool.query(`
            SELECT DISTINCT t.train_id, t.train_number, t.type, 
                j.journey_id, j.departure_date_time, j.arrival_date_time,
                r.distance_km, s1.station_name as origin, s2.station_name as destination
            FROM train AS T
            JOIN journey_instance AS J ON T.train_id = J.train_id
            JOIN route R ON J.route_id = R.route_id
            JOIN station S1 ON R.origin_station_id = S1.station_id
            JOIN station S2 ON R.destination_station_id = S2.station_id
            ORDER BY j.departure_date_time;
        `)
        return trains;
    } catch (error) {
        console.log("Error happened in retrieveTrainJourneys query");
        console.error(error);
    }
}

export const retrieveSpecificTrainJourney = async (params) => {
    const { originCity, destinationCity, status } = params;
    try {
        const [trains, _] = await pool.query(`
            SELECT DISTINCT t.train_id, t.train_number, t.type, 
                j.journey_id, j.departure_date_time, j.arrival_date_time,
                r.distance_km, s1.station_name as origin, s2.station_name as destination
            FROM train AS T
            JOIN journey_instance AS J ON T.train_id = J.train_id
            JOIN route R ON J.route_id = R.route_id
            JOIN station S1 ON R.origin_station_id = S1.station_id
            JOIN station S2 ON R.destination_station_id = S2.station_id
            WHERE S1.city = ? 
                AND S2.city = ?
                AND j.status = ?
            ORDER BY j.departure_date_time;
        `, [originCity, destinationCity, status])
        return trains;
    } catch (error) {
        console.log("Error happened in retrieveSpecificTrainJourney query");
        console.error(error);
    }
}

export const retrieveTrainCapacity = async () => {
    try {
        const [result, _] = await pool.query(`
            SELECT 
                train.train_id, 
                COUNT(carriage.carriage_id ) as 'Number of Carriages',
                SUM(carriage.capacity) AS 'Total Seats (MAX Capacity) per train'
            FROM train
            JOIN carriage 
            ON train.train_id = carriage.train_id
            GROUP BY train.train_id;
        `)
        return result;
    } catch (error) {
        console.log("Error happened in retrieveTrainCapacity query");
        console.error(error);
    }
}

(async () => {
    // console.log(await retrieveTrainByStatus("active"));
    // console.log(await retrieveTrainByType("Express"));
    // console.log(await retrieveTrainJourneys());
    console.log(await retrieveTrainsCounts());
})()
