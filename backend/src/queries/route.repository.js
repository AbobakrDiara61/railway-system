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

export const retrieveRoutesInformation = async () => {
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
            JOIN station s1 
                ON r.origin_station_id = s1.station_id
            JOIN station s2 
                ON r.destination_station_id = s2.station_id;
        `)
        return routes;
    } catch (error) {
        console.log("Error happened in retrieveRoutesInformation query");
        console.error(error);
    }
}


( async () => {
    const routes = await retrieveRoutesInformation();
    console.log(routes);
})()