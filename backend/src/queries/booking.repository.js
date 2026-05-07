import pool from "../config/db.js";

// GET all bookings (admin)
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

// GET booking (client)
export const retrieveBooking = async (booking_id) => {
    try {
        const [booking, _] = await pool.query(`
            SELECT * FROM booking WHERE booking_id = ?;
        `, [booking_id])
        return booking;
    } catch (error) {
        console.log("Error happened in retrieveBooking query");
        console.error(error);
    }
}
// GET user's bookings (client)
export const retrieveUserBookings = async (userId) => {
    try {
        const [bookings, _] = await pool.query(`
            SELECT * FROM booking WHERE user_id = ?;
        `, [userId])
        return bookings;
    } catch (error) {
        console.log("Error happened in retrieveUserBookings query");
        console.error(error);
    }
}

export const retrieveBookingHistory = async () => {
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
        console.log("Error happened in retrieveBookingHistory query");
        console.error(error);
    }
}


export const retrieveBookingHistoryForUser = async (userId) => {
    try {
        const [userBookingHistory, _] = await pool.query(`
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
            GROUP BY U.user_id, booking_id, TK.journey_id
            ORDER BY U.full_name DESC;
        `, [userId])
        return userBookingHistory;
    } catch (error) {
        console.log("Error happened in retrieveBookingHistoryForUser query");
        console.error(error);
    }
}

// Creating booking (admin only) 
export const createBooking = async (booking) => {
    const { 
        user_id, 
        booking_date, 
        total_amount, 
        payment_status, 
        payment_method, 
        payment_transaction_id, 
        status
    } = booking;
    try {
        const [newBooking, _] = await pool.query(`
            INSERT INTO booking (user_id, booking_date, total_amount, payment_status, payment_method, payment_transaction_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `, [user_id, booking_date, total_amount, payment_status, payment_method, payment_transaction_id, status])
        return newBooking.insertId;
    } catch (error) {
        console.log("Error happened in createBooking query");
        console.error(error);
    }
}

// Updating booking information (admin only) 
export const updateBooking = async (booking) => {
    const { bookingId, total_amount, payment_status, payment_method } = booking;
    try {
        const [updatedBooking, _] = await pool.query(`
            UPDATE booking
            SET total_amount = ?, payment_status = ?, payment_method = ?
            WHERE booking_id = ?;
        `, [total_amount, payment_status, payment_method, bookingId])
        return {
            info: updatedBooking.info,
            affectedRows: updatedBooking.affectedRows
        };
        /* Sample of returned meta info:
                ResultSetHeader {
                fieldCount: 0,
                affectedRows: 1,
                insertId: 0,
                info: 'Rows matched: 1  Changed: 1  Warnings: 0',
                serverStatus: 2,
                warningStatus: 0,
                changedRows: 1
                }
        */
    } catch (error) {
        console.log("Error happened in updateBooking query");
        console.error(error);
    }
}

// Deleting booking (admin only) 
export const deleteBooking = async (bookingId) => {
    try {
        const [deletedBooking, _] = await pool.query(`
            DELETE FROM booking
            WHERE booking_id = ?;
        `, [bookingId])
        return deletedBooking.affectedRows;
    } catch (error) {
        console.log("Error happened in deleteBooking query");
        console.error(error);
    }
}

// Successfull Query
/* (async () => {
    try {
        console.log((await createBooking({
            user_id: 2,
            booking_date: new Date(),
            total_amount: 100,
            payment_status: 'paid',
            payment_method: 'cash',
            payment_transaction_id: '1234567890',
            status: 'confirmed'
        })));
    } catch (error) {
        console.log(error);
    }
})() */