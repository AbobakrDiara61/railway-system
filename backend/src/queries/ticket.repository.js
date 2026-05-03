import pool from "../config/db.js";

export const retrieveAllTickets = async () => {
    try {
        const [tickets, _] = await pool.query(`
            SELECT * FROM ticket;
        `)
        return tickets;
    } catch (error) {
        console.log("Error happened in retrieveAllTickets query");
        console.error(error);
    }
}

export const retrieveSpecificTicket = async (params) => {
    const { ticket_id } = params;
    console.log(ticket_id);
    try {
        const [ticket, _] = await pool.query(`
            SELECT * FROM ticket WHERE ticket_id = ?;
        `, [ticket_id])
        return ticket;
    } catch (error) {
        console.log("Error happened in retrieveSpecificTicket query");
        console.error(error);
    }
}


export const retrieveTicketsBookingDetails = async () => {
    try {
        const [result, _] = await pool.query(`
            SELECT *
            FROM ticket T
            JOIN booking B
            ON T.booking_id = B.booking_id
            GROUP BY ticket_id, T.booking_id, journey_id;
        `,)
        return result;
    } catch (error) {
        console.log("Error happened in retrieveTicketsBookingDetails query");
        console.error(error);
    }
}

/* export const cancelTicket = async (params) => {
    const { ticket_id, booking_id} = params;
    console.log(ticket_id);
    try {
        const [ticket, _] = await pool.query(`
            UPDATE ticket SET status = 'cancelled' WHERE ticket_id = ?;
        `, [ticket_id])
        return ticket;
    } catch (error) {
        console.log("Error happened in cancelTicket query");
        console.error(error);
    }
} */

/* export const retrieveTicketBookingDetails = async (params) => {
    const { ticket_id } = params;
    console.log(ticket_id);
    try {
        const [ticket, _] = await pool.query(`
            
        `, [ticket_id])
        return ticket;
    } catch (error) {
        console.log("Error happened in retrieveSpecificTicket query");
        console.error(error);
    }
}
 */

( async () => {
    // const ticket = await retrieveSpecificTicket({ticket_id: '208'});
    const res = await retrieveTicketsBookingDetails();
    console.log(res);
})()