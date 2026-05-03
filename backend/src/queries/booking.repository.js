import pool from "../config/db.js";

export const retrieveAllBookings = async () => {
    try {
        const [bookings, _] = await pool.query(`
            SELECT * FROM booking;
        `)
        return bookings;
    } catch (error) {
        console.log("Error happened in retrieveAllBookings query");
        console.error(error);
    }
}

export const retrieveBookingsHistory = async () => {
    try {
        const [users, _] = await pool.query(`
            SELECT full_name, B.booking_id, B.booking_date, 
            B.total_amount, B.payment_status, 
            JI.journey_id, r.route_name, s1.station_name as origin,
            s2.station_name as destination,
            departure_date_time, arrival_date_time
            
            FROM users as U
            JOIN booking as B ON U.user_id = B.user_id
            JOIN ticket as TK on B.booking_id = TK.booking_id
            JOIN journey_instance as JI ON TK.journey_id = JI.journey_id
            JOIN route as R ON R.route_id = JI.route_id
            JOIN station S1 ON R.origin_station_id = S1.station_id
            JOIN station S2 ON R.destination_station_id = S2.station_id
            GROUP BY U.user_id, booking_id, TK.journey_id
            ORDER BY U.full_name DESC;
        `)
        return users;
    } catch (error) {
        console.log("Error happened in retrieveBookingsHistory query");
        console.error(error);
    }
}

