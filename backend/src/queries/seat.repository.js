//Done
import pool from "../config/db.js";

export const retrieveAllSeats = async () => {
    try {
        const [seats, _] = await pool.query(`
            SELECT * FROM seat;
        `)
        return seats;
    } catch (error) {
        console.log("Error happened in retrieveAllSeats query");
        console.error(error);
    }
}

// GET seat (client)
export const retrieveSeatById = async (seatId) => {
    try {
        const [seat, _] = await pool.query(`
            SELECT * FROM seat WHERE seat_id = ?;
        `, [seatId])
        return seat;
    } catch (error) {
        console.log("Error happened in retrieveSeatById query");
        console.error(error);
    }
}

export const retrieveSeatsCountsPerCarriage = async () => {
    try {
        const [counts, _] = await pool.query(`
            SELECT carriage_id, COUNT(*) as No_Seats
            FROM seat
            GROUP BY carriage_id;
        `)
        return counts;
    } catch (error) {
        console.log("Error happened in retrieveSeatsCountsPerCarriage query");
        console.error(error);
    }
}

export const retrieveSeatCarriageTrainDetails = async () => {
    try {
        const [result, _] = await pool.query(`
            SELECT *
            FROM train
            JOIN carriage 
            ON train.train_id = carriage.train_id
            JOIN seat
            ON carriage.carriage_id = seat.carriage_id;
        `)
        return result;
    } catch (error) {
        console.log("Error happened in retrieveSeatCarriageTrainDetails query");
        console.error(error);
    }
}

export const retrieveSeatsAvailability = async () => {
    try {
        const [result, _] = await pool.query(`
            SELECT J.journey_id, T.train_number, C.carriage_number, COUNT(S.seat_id) AS 'Total Seats', 
                C.class, COUNT(CASE WHEN ticket_id IS NULL THEN 1 END) as available_seats,
                COUNT(CASE WHEN ticket_id IS NOT NULL THEN 1 END) as used_seats
            FROM carriage as C
            JOIN seat AS S ON C.carriage_id = S.carriage_id 
            JOIN train AS T ON T.train_id = C.train_id
            JOIN journey_instance as J ON J.train_id = T.train_id
            LEFT JOIN ticket AS TK ON S.seat_id = TK.seat_id AND TK.journey_id = J.journey_id 
            -- WHERE J.journey_id = 1
            GROUP BY J.journey_id, C.carriage_id
            ORDER BY J.journey_id, C.carriage_id; 
        `)
        return result;
    } catch (error) {
        console.log("Error happened in retrieveSeatsAvailability query");
        console.error(error);
    }
}

// Creating seat (admin only) 
export const createSeat = async (seat) => {
    const { 
        carriage_id, 
        city, 
        state, 
        seat_number, 
        seat_type
    } = seat;
    try {
        const [newSeat, _] = await pool.query(`
            INSERT INTO seat (carriage_id, city, state, seat_number, seat_type)
            VALUES (?, ?, ?, ?, ?, ?);
        `, [carriage_id, city, state, seat_number, seat_type])
        return newSeat.insertId;
    } catch (error) {
        console.log("Error happened in createSeat query");
        console.error(error);
    }
}

// Updating seat (admin only) 
export const updateSeat = async (seat) => {
    const { seat_id, carriage_id, city, state, seat_number, seat_type } = seat;
    try {
        const [updatedSeat, _] = await pool.query(`
            UPDATE seat
            SET 
                carriage_id = ?, 
                city = ?, 
                state = ?, 
                seat_number = ?, 
                seat_type = ?
            WHERE seat_id = ?;
        `, [carriage_id, city, state, seat_number, seat_type, seat_id])
        return {
            info: updatedSeat.info,
            affectedRows: updatedSeat.affectedRows
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
        console.log("Error happened in updateSeat query");
        console.error(error);
    }
}

// Deleting seat (admin only) 
export const deleteSeat = async (seatId) => {
    try {
        const [deletedSeat, _] = await pool.query(`
            DELETE FROM seat
            WHERE seat_id = ?;
        `, [seatId])
        return deletedSeat.affectedRows;
    } catch (error) {
        console.log("Error happened in deleteSeat query");
        console.error(error);
    }
}

( async () => {
    /* const seat = await updateSeat({
        seat_id: '3083',
        carriage_id: '13',
        city: 'Karachi',
        state: 'Karachi',
        seat_number: '13',
        seat_type: 'window'
    });
    console.log(seat); */
})()