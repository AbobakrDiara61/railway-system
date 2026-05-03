import pool from "../config/db.js";

export const retrieveAllCarriages = async () => {
    try {
        const [carriages, _] = await pool.query(`
            SELECT * FROM CARRIAGE;
        `)
        return carriages;
    } catch (error) {
        console.log("Error happened in retrieveAllCarriages query");
        console.error(error);
    }
}

export const retrieveCarriagesByTrain = async () => {
    try {
        const [carriages, _] = await pool.query(`
            SELECT *
            FROM train
            JOIN carriage
            ON train.train_id = carriage.train_id;
        `)
        return carriages;
    } catch (error) {
        console.log("Error happened in retrieveCarriagesByTrain query");
        console.error(error);
    }
}

/* export const retrieveCarriageClassCounts = async () => {
    try {
        const [carriagesClassCounts, _] = await pool.query(`
            SELECT class, COUNT(*) as Number
            FROM CARRIAGE
            GROUP BY class;
        `)

        return carriagesClassCounts;
    } catch (error) {
        console.log("Error happened in retrieveCarriageClassCounts query");
        console.error(error);
    }
} */