import {
    createTicket,
    updateTicket,
    deleteTicket,
    cancelTicket,
    retrieveTicketById,
    retrieveAllTickets,
    retrieveTicketsBookingDetails
} from "../queries/ticket.repository.js";

const createTicketHandler = async (req, res) => {
    try {
        const { 
            booking_id,
            journey_id,
            seat_id,
            passenger_name,
            passenger_national_id,
            price_paid,
            status
        } = req.body;
        if(!booking_id || !journey_id || !seat_id || !passenger_name || !passenger_national_id || !price_paid || !status) 
            return res.status(400).json({ success: false, message: "All fields are required" });
        
        const id = await createTicket(req.body);
        const newTicket = await retrieveTicketById(id);
        return res.status(201).json({ success: true, message: "Ticket created successfully", ticket: newTicket });
    } catch (error) {
        console.error({ message: "Error happened in createTicketHandler", error });
        return res.status(500).json({ success: false, message: "Failed to create ticket." });
    }
}

const updateTicketHandler = async (req, res) => {
    try {
        const { 
            status,
            ticket_id,
        } = req.body;
        if(!status || !ticket_id)
            return res.status(400).json({ success: false, message: "All fields are required" });
        
        const result = await updateTicket(req.body);
        if(result.affectedRows === 0) 
            return res.status(404).json({ success: false, message: "Ticket not found" });
        const updatedTicket = await retrieveTicketById(ticket_id);
        return res.status(200).json({ success: true, message: "Ticket updated successfully", ticket: updatedTicket });
    } catch (error) {
        console.error({ message: "Error happened in updateTicketHandler", error });
        return res.status(500).json({ success: false, message: "Failed to update ticket." });
    }
}

const deleteTicketHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id)
            return res.status(400).json({ success: false, message: "Ticket ID is required" });
        
        const result = await deleteTicket(id);
        if(result.affectedRows === 0)
            return res.status(404).json({ success: false, message: "Ticket not found" });
        
        return res.status(200).json({ success: true, message: "Ticket deleted successfully" });
    } catch (error) {
        console.error({ message: "Error happened in deleteTicketHandler", error });
        return res.status(500).json({ success: false, message: "Failed to delete ticket." });
    }
}

const cancelTicketHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id)
            return res.status(400).json({ success: false, message: "Ticket ID is required" });
        
        const result = await cancelTicket(id);
        if(result.affectedRows === 0)
            return res.status(404).json({ success: false, message: "Ticket not found" });
        const cancelledTicket = await retrieveTicketById(id);
        return res.status(200).json({ success: true, message: "Ticket cancelled successfully", ticket: cancelledTicket });
    } catch (error) {
        console.error({ message: "Error happened in cancelTicketHandler", error });
        return res.status(500).json({ success: false, message: "Failed to cancel ticket." });
    }
}

const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id)
            return res.status(400).json({ success: false, message: "Ticket ID is required" });

        const ticket = await retrieveTicketById(id);
        if(ticket.length === 0)
            return res.status(404).json({ success: false, message: "Ticket not found" });

        return res.status(200).json({ success: true, message: "Ticket found successfully", ticket });
    } catch (error) {
        console.error({ message: "Error happened in getTicketById", error });
        return res.status(500).json({ success: false, message: "Failed to get ticket." });
    }
}

const getAllTickets = async (req, res) => {
    try {
        const tickets = await retrieveAllTickets();
        if(tickets.length === 0)
            return res.status(404).json({ success: false, message: "No tickets found" });
        return res.status(200).json({ success: true, message: "All tickets found successfully", tickets });
    } catch (error) {
        console.error({ message: "Error happened in getAllTickets", error });
        return res.status(500).json({ success: false, message: "Failed to get tickets." });
    }
}

const getTicketsBookingDetails = async (req, res) => {
    try {
        const ticketsBookingDetails = await retrieveTicketsBookingDetails();
        if(ticketsBookingDetails.length === 0)
            return res.status(404).json({ success: false, message: "No tickets booking details found" });
        return res.status(200).json({ success: true, message: "All tickets booking details found successfully", ticketsBookingDetails });
    } catch (error) {
        console.error({ message: "Error happened in getTicketsBookingDetails", error });
        return res.status(500).json({ success: false, message: "Failed to get ticket's booking details." });
    }
}

export {
    createTicketHandler,
    updateTicketHandler,
    deleteTicketHandler,
    cancelTicketHandler,
    getTicketById,
    getAllTickets,
    getTicketsBookingDetails
};