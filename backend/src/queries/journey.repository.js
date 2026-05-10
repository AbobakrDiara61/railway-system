//Done
import pool from "../config/db.js";

export const retrieveAllJourneys = async () => {
    try {
        const [journeys, _] = await pool.query(`
            SELECT 
                ji.*,
                r.route_name,
                s1.station_name AS origin_station_name,
                s1.city AS origin_city,
                s2.station_name AS destination_station_name,
                s2.city AS destination_city
            FROM journey_instance ji
            JOIN route r ON ji.route_id = r.route_id
            JOIN station s1 ON r.origin_station_id = s1.station_id
            JOIN station s2 ON r.destination_station_id = s2.station_id
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

export const retrieveJourneyById = async (id) => {
    try {
        const [rows,_] = await pool.query(
            `SELECT ji.*, r.route_name,
                s1.station_name AS origin_station_name,
                s2.station_name AS destination_station_name
             FROM journey_instance ji
             JOIN route r ON ji.route_id = r.route_id
             JOIN station s1 ON r.origin_station_id = s1.station_id
             JOIN station s2 ON r.destination_station_id = s2.station_id
             WHERE ji.journey_id = ?`,
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
                s.seat_id,
                s.seat_number,
                s.seat_type,
                c.carriage_id,
                c.carriage_number,
                c.class,
                CASE WHEN tk.ticket_id IS NOT NULL THEN 'booked' ELSE 'available' END AS status
             FROM journey_instance j
             JOIN train t ON j.train_id = t.train_id
             JOIN carriage c ON c.train_id = t.train_id
             JOIN seat s ON s.carriage_id = c.carriage_id
             LEFT JOIN ticket tk ON tk.seat_id = s.seat_id AND tk.journey_id = j.journey_id
             WHERE j.journey_id = ?
             ORDER BY c.carriage_number, s.seat_number`,
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