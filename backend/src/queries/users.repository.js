import pool from "../config/db.js";

export const retrieveAllUsers = async () => {
    try {
        const [users, _] = await pool.query(`
            SELECT *
            FROM users;
        `)
        return users;
    } catch (error) {
        console.log("Error happened in retrieveUsers query");
        console.error(error);
    }
}

export const retrieveUsersBookings = async () => {
    try {
        const [users, _] = await pool.query(`
            SELECT *
            FROM users as U
            JOIN booking as B
            ON U.user_id = B.user_id
            GROUP BY U.user_id, booking_id;
        `)
        return users;
    } catch (error) {
        console.log("Error happened in retrieveUsersBookings query");
        console.error(error);
    }
} 

export const retrieveCertainUsers = async (status, method) => {
    try {
        let query = `
            SELECT full_name, email, phone, passport_number, payment_status, payment_method
            FROM users as U
            JOIN booking as B
            ON U.user_id = B.user_id
            GROUP BY U.user_id, booking_id
        `;
        const queryParams = [];

        if (status) {
            query += " HAVING B.payment_status = ?";
            queryParams.push(status);
        }
        if (method) {
            query += " HAVING B.payment_method = ?";
            queryParams.push(method);
        }
        const [ user, _ ] = await pool.query(query, queryParams);
        return user;
    } catch (error) {
        console.log("Error happened in retrieveCertainUsers query");
        console.error(error);
    }
}

export const retrieveBookingCounts = async () => {
    try {
        const [counts, _] = await pool.query(`
            SELECT COUNT(*) AS Number_Of_Books
            FROM users as U
            JOIN booking as B
            ON U.user_id = B.user_id;
        `)
        return counts;
    } catch (error) {
        console.log("Error happened in retrieveBookingCounts query");
        console.error(error);
    }
}

export const retrieveBookingCountsPerMethod = async () => {
    try {
        const [counts, _] = await pool.query(`
            SELECT payment_method, COUNT(*) AS Number_Of_Books
            FROM users as U
            JOIN booking as B
            ON U.user_id = B.user_id
            GROUP BY B.payment_method;
        `)
        return counts;
    } catch (error) {
        console.log("Error happened in retrieveBookingCountsPerMethod query");
        console.error(error);
    }
}

export const retrieveBookingCountsPerUser = async () => {
    try {
        const [counts, _] = await pool.query(`
            SELECT full_name, COUNT(*) AS Number_Of_Books
            FROM users as U
            JOIN booking as B
            ON U.user_id = B.user_id
            GROUP BY U.user_id;
        `)
        return counts;
    } catch (error) {
        console.log("Error happened in retrieveBookingCountsPerUser query");
        console.error(error);
    }
}

export const retrieveUsersBookingsHistory = async (id) => {
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
            WHERE U.user_id = ?
            GROUP BY U.user_id, booking_id, TK.journey_id;
        `, [ id ])
        return users;
    } catch (error) {
        console.log("Error happened in retrieveUsersBookingsHistory query");
        console.error(error);
    }
}

// Testing Self Invoked Function
(async () => {
    try {
        console.log((await retrieveUsersBookingsHistory('2')));
    } catch (error) {
        console.log(error);
    }
})()