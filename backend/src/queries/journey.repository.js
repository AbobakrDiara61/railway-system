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

( async () => {
    // const res = await retrieveAllJourneys();
    // const res = await retrieveTrainJourneys();
    const res = await retrieveJourneysReports();
    console.log(res);
})()