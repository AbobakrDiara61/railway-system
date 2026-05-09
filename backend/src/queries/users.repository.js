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

// GET user (client)
export const retrieveUser = async (userId) => {
    try {
        const [user, _] = await pool.query(`
            SELECT * from users WHERE user_id = ?;
        `, [userId])
        return user[0];
    } catch (error) {
        console.log("Error happened in retrieveUser query");
        console.error(error);
    }
}

export const retrieveUserByEmail = async (email) => {
    try {
        const [user, _] = await pool.query(`
            SELECT *
            FROM users
            WHERE email = ?;
        `, [email])
        return user[0];
    } catch (error) {
        console.log("Error happened in retrieveUserByEmail query");
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

/* export const retrieveUsersBookingsHistory = async (id) => {
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
*/

// Creating user (admin only) 
export const createUser = async (user) => {
    const { 
        first_name, 
        last_name, 
        email, 
        password_hash, 
        phone, 
        birth_date, 
        national_id, 
        passport_number, 
        role, 
        city, 
        street, 
        building
    } = user;
    try {
        const [newUser, _] = await pool.query(`
            INSERT INTO users (first_name, last_name, email, password_hash, phone, birth_date, national_id, passport_number, role, city, street, building)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `, [first_name, last_name, email, password_hash, phone, birth_date, national_id, passport_number, role, city, street, building])
        return newUser.insertId;
    } catch (error) {
        console.log("Error happened in createUser query");
        console.error(error);
    }
}

// Updating user (admin only) 
export const updateUsersPassword = async (user) => {
    const { 
        password_hash, 
        user_id
    } = user;
    try {
        const [updatedUser, _] = await pool.query(`
            UPDATE users
            SET password_hash = ?
            WHERE user_id = ?;
        `, [password_hash, user_id])
        return {
            info: updatedUser.info,
            affectedRows: updatedUser.affectedRows
        };
    } catch (error) {
        console.log("Error happened in updateUser query");
        console.error(error);
    }
}

// Add refresh token and OTP Code
export const updateRefreshToken = async (user) => {
    const { 
        refreshToken, 
        user_id
    } = user;
    try {
        const [updatedUser, _] = await pool.query(`
            UPDATE users
            SET refresh_token = ?
            WHERE user_id = ?;
        `, [refreshToken, user_id])
        return {
            info: updatedUser.info,
            affectedRows: updatedUser.affectedRows
        };
    } catch (error) {
        console.log("Error happened in updateUser query");
        console.error(error);
    }
}

// Deleting user (admin only) 
export const deleteUser = async (userId) => {
    try {
        const [deletedUser, _] = await pool.query(`
            DELETE FROM users
            WHERE user_id = ?;
        `, [userId])
        return deletedUser.affectedRows;
    } catch (error) {
        console.log("Error happened in deleteUser query");
        console.error(error);
    }
}

// Testing Self Invoked Function
/* (async () => {
    try {
        // console.log((await retrieveUsersBookingsHistory('2')));
        console.log((await retrieveUserByEmail('omaribrahim@email.com')));
    } catch (error) {
        console.log(error);
    }
})() */