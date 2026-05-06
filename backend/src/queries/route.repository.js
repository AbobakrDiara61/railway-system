import pool from "../config/db.js";

export const retrieveAllRoutes = async () => {
    try {
        const [routes, _] = await pool.query(`
            SELECT * FROM route;
        `)
        return routes;
    } catch (error) {
        console.log("Error happened in retrieveAllRoutes query");
        console.error(error);
    }
}

export const retrieveRoutesWithStations = async () => {
    try {
        const [routes, _] = await pool.query(`
            SELECT 
                r.route_id,
                r.route_name,
                s1.station_name AS origin_station,
                s1.city AS origin_city,
                s2.station_name AS destination_station,
                s2.city AS destination_city,
                r.distance_km
            FROM route r
            JOIN station s1 ON r.origin_station_id = s1.station_id
            JOIN station s2 ON r.destination_station_id = s2.station_id;
        `)
        return routes;
    } catch (error) {
        console.log("Error happened in retrieveRoutesWithStations query");
        console.error(error);
    }
}

export const retrieveRouteById = async (id) => {
    try {
        const [rows,_] = await pool.query(`
            SELECT 
                r.route_id,
                r.route_name,
                s1.station_name AS origin_station,
                s1.city AS origin_city,
                s2.station_name AS destination_station,
                s2.city AS destination_city,
                r.distance_km
            FROM route r
            JOIN station s1 ON r.origin_station_id = s1.station_id
            JOIN station s2 ON r.destination_station_id = s2.station_id
            WHERE r.route_id = ?;
        `, [id])
        return rows[0];
    } catch (error) {
        console.log("Error happened in retrieveRouteById query");
        console.error(error);
    }
}

export const createRoute = async (data) => {
    try {
        const [result,_] = await pool.query(`
            INSERT INTO route (route_name, origin_station_id, destination_station_id, distance_km)
            VALUES (?, ?, ?, ?);
        `, [data.route_name, data.origin_station_id, data.destination_station_id, data.distance_km])
        return result.insertId;
    } catch (error) {
        console.log("Error happened in createRoute query");
        console.error(error);
    }
}

export const deleteRoute = async (id) => {
    try {
        const [result,_] = await pool.query(`
            DELETE FROM route WHERE route_id = ?;
        `, [id])
        return result.affectedRows;
    } catch (error) {
        console.log("Error happened in deleteRoute query");
        console.error(error);
    }
}