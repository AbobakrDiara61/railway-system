//Done
import pool from "../config/db.js";

export const retrieveAllCarriages = async () => {
    try {
        const [carriages, _] = await pool.query(`
            SELECT * FROM carriage;
        `)
        return carriages;
    } catch (error) {
        console.log("Error happened in retrieveAllCarriages query");
        console.error(error);
    }
}

export const retrieveCarriagesByTrain = async (trainId) => {
    try {
        const [carriages, _] = await pool.query(`
            SELECT *
            FROM train
            JOIN carriage ON train.train_id = carriage.train_id
            WHERE train.train_id = ?;
        `, [trainId])
        return carriages;
    } catch (error) {
        console.log("Error happened in retrieveCarriagesByTrain query");
        console.error(error);
    }
}

export const retrieveCarriageById = async (id) => {
    try {
        const [rows,_] = await pool.query(`
            SELECT * FROM carriage WHERE carriage_id = ?;
        `, [id])
        return rows[0];
    } catch (error) {
        console.log("Error happened in retrieveCarriageById query");
        console.error(error);
    }
}

export const retrieveCarriageClassCounts = async () => {
    try {
        const [counts, _] = await pool.query(`
            SELECT class, train_id, COUNT(*) as number_of_class_per_train
            FROM carriage
            GROUP BY class, train_id;
        `)
        return counts;

    } catch (error) {
        console.log("Error happened in retrieveCarriageClassCounts query");
        console.error(error);
    }
}

export const retrieveTrainCapacityByCarriage = async (trainId) => {
    try {
        const [rows,_] = await pool.query(`
            SELECT 
                train.train_id, 
                COUNT(carriage.carriage_id) as number_of_carriages,
                SUM(carriage.capacity) AS total_seats
            FROM train
            JOIN carriage ON train.train_id = carriage.train_id
            WHERE train.train_id = ?
            GROUP BY train.train_id;
        `, [trainId])
        return rows[0];
    } catch (error) {
        console.log("Error happened in retrieveTrainCapacityByCarriage query");
        console.error(error);
    }
}

export const createCarriage = async (data) => {
    try {
        const [result,_] = await pool.query(`
            INSERT INTO carriage (train_id, carriage_number, class, capacity)
            VALUES (?, ?, ?, ?);
        `, [data.train_id, data.carriage_number, data.class, data.capacity])
        return result.insertId;
    } catch (error) {
        console.log("Error happened in createCarriage query");
        console.error(error);
    }
}

export const deleteCarriage = async (id) => {
    try {
        const [result,_] = await pool.query(`
            DELETE FROM carriage WHERE carriage_id = ?;
        `, [id])
        return result.affectedRows;
    } catch (error) {
        console.log("Error happened in deleteCarriage query");
        console.error(error);
    }
}