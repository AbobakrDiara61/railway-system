//Done
import pool from "../config/db.js";

export const retrieveAllJourneys = async () => {
    try {
        const [journeys, _] = await pool.query(`
            SELECT * FROM journey_instance;
        `)
        return journeys;
    } catch (error) {
        console.log("Error happened in retrieveAllJourneys query");
        console.error(error);
    }
}

export const retrieveTrainJourneys = async () => {
    try {
        const [result, _] = await pool.query(`
            SELECT *
            FROM journey_instance
            JOIN train
            ON journey_instance.train_id = train.train_id;
        `)
        return result;
    } catch (error) {
        console.log("Error happened in retrieveTrainJourneys query");
        console.error(error);
    }
}

export const retrieveJourneysReports = async () => {
    try {
        const [journeySummary, _] = await pool.query(`
            SELECT 
                J.train_id, 
                train_number, 
                COUNT(*) as 'Number of Journeies',
                route_name,
                S1.station_name as origin,
                S2.station_name as destination
            FROM journey_instance as J
            JOIN train as T
            ON J.train_id = T.train_id
            JOIN route as R1
            ON R1.route_id = J.route_id
            JOIN station as S1
            ON R1.origin_station_id = S1.station_id
            JOIN station as S2
            ON R1.destination_station_id = S2.station_id
            GROUP BY J.train_id, route_name, S1.station_name, S2.station_name -- or group by R1.route_id
            ORDER BY R1.route_name;
        `)
        return journeySummary;
    } catch (error) {
        console.log("Error happened in retrieveJourneysReports query");
        console.error(error);
    }
}

// GET journey by id
export const retrieveJourneyById = async (id) => {
    try {
        const [rows,_] = await pool.query(
            `SELECT * FROM journey_instance WHERE journey_id = ?`,
            [id]
        );
        return rows[0];
    } catch (error) {
        console.log("Error happened in retrieveJourneyById query");
        console.error(error);
    }
}

// GET journeys count per train
export const retrieveJourneysCountPerTrain = async () => {
    try {
        const [rows,_] = await pool.query(
            `SELECT j.train_id, t.train_number, COUNT(*) as number_of_journeys
             FROM journey_instance as j
             JOIN train as t ON j.train_id = t.train_id
             GROUP BY j.train_id`
        );
        return rows;
    } catch (error) {
        console.log("Error happened in retrieveJourneysCountPerTrain query");
        console.error(error);
    }
}

// GET seat availability per journey
export const retrieveJourneySeats = async (journeyId) => {
    try {
        const [rows,_] = await pool.query(
            `SELECT 
                j.journey_id, t.train_number, c.carriage_number, c.class,
                COUNT(s.seat_id) AS total_seats,
                COUNT(CASE WHEN tk.ticket_id IS NULL THEN 1 END) as available_seats,
                COUNT(CASE WHEN tk.ticket_id IS NOT NULL THEN 1 END) as used_seats
             FROM carriage as c
             JOIN seat AS s ON c.carriage_id = s.carriage_id
             JOIN train AS t ON t.train_id = c.train_id
             JOIN journey_instance as j ON j.train_id = t.train_id
             LEFT JOIN ticket AS tk ON s.seat_id = tk.seat_id
               AND tk.journey_id = j.journey_id
             WHERE j.journey_id = ?
             GROUP BY j.journey_id, c.carriage_id
             ORDER BY c.carriage_id`,
            [journeyId]
        );
        return rows;
    } catch (error) {
        console.log("Error happened in retrieveJourneySeats query");
        console.error(error);
    }
}

// POST create journey (admin)
export const createJourney = async (data) => {
    try {
        const [result,_] = await pool.query(
            `INSERT INTO journey_instance 
             (train_id, route_id, departure_date_time, arrival_date_time, status)
             VALUES (?, ?, ?, ?, ?)`,
            [data.train_id, data.route_id, data.departure_date_time,
             data.arrival_date_time, data.status]
        );
        return result.insertId;
    } catch (error) {
        console.log("Error happened in createJourney query");
        console.error(error);
    }
}

// PUT update journey (admin)
export const updateJourney = async (id, data) => {
    try {
        const [result,_] = await pool.query(
            `UPDATE journey_instance 
             SET departure_date_time = ?, arrival_date_time = ?, status = ?
             WHERE journey_id = ?`,
            [data.departure_date_time, data.arrival_date_time, data.status, id]
        );
        return result.affectedRows;
    } catch (error) {
        console.log("Error happened in updateJourney query");
        console.error(error);
    }
}

// Deleting journey (admin) 
export const deleteJourney = async (journeyId) => {
    try {
        const [deletedJourney, _] = await pool.query(`
            DELETE FROM journey_instance
            WHERE journey_id = ?;
        `, [journeyId])
        return deletedJourney.affectedRows;
    } catch (error) {
        console.log("Error happened in deleteJourney query");
        console.error(error);
    }
}

( async () => {
    // const res = await retrieveAllJourneys();
    // const res = await retrieveTrainJourneys();
    // const res = await retrieveJourneysReports();
    // console.log(res);
})()