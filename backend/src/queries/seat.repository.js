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


( async () => {
    const seats = await retrieveSeatsAvailability();
    console.log(seats);
})()