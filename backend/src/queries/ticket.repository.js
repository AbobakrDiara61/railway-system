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

// GET ticket (client)
export const retrieveTicketById = async (ticketId) => {
    try {
        const [ticket, _] = await pool.query(`
            SELECT * FROM ticket WHERE ticket_id = ?;
        `, [ticketId])
        return ticket;
    } catch (error) {
        console.log("Error happened in retrieveTicketById query");
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

// Cancelling ticket (client)
export const cancelTicket = async ({ ticket_id }) => {
    try {
        const [ticket, _] = await pool.query(`
            UPDATE ticket SET status = 'cancelled' WHERE ticket_id = ?;
        `, [ticket_id])
        return {
            info: ticket.info,
            affectedRows: ticket.affectedRows
        };
    } catch (error) {
        console.log("Error happened in cancelTicket query");
        console.error(error);
    }
}

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

// Creating ticket (admin only) 
export const createTicket = async (ticket) => {
    const { 
        booking_id,
        journey_id,
        seat_id,
        passenger_name,
        passenger_national_id,
        price_paid,
        status
    } = ticket;
    try {
        const [newTicket, _] = await pool.query(`
            INSERT INTO ticket (booking_id, journey_id, seat_id, passenger_name, passenger_national_id, price_paid, status)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `, [booking_id, journey_id, seat_id, passenger_name, passenger_national_id, price_paid, status])
        return newTicket.insertId;
    } catch (error) {
        console.log("Error happened in createTicket query");
        console.error(error);
    }
}

// Updating ticket (admin only) 
export const updateTicket = async (ticket) => {
    const { 
        status,
        ticket_id,
    } = ticket;
    try {
        const [updatedTicket, _] = await pool.query(`
            UPDATE ticket
            SET status = ?
            WHERE ticket_id = ?;
        `, [status, ticket_id])
        return {
            info: updatedTicket.info,
            affectedRows: updatedTicket.affectedRows
        };
    } catch (error) {
        console.log("Error happened in updateTicket query");
        console.error(error);
    }
}

// Deleting ticket (admin only) 
export const deleteTicket = async (ticketId) => {
    try {
        const [deletedTicket, _] = await pool.query(`
            DELETE FROM ticket
            WHERE ticket_id = ?;
        `, [ticketId])
        return deletedTicket.affectedRows;
    } catch (error) {
        console.log("Error happened in deleteTicket query");
        console.error(error);
    }
}

( async () => {
    // const ticket = await retrieveSpecificTicket({ticket_id: '208'});
    // const res = await retrieveTicketsBookingDetails();
    // console.log(res);
})()