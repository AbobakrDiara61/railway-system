import {
    createBooking,
    updateBooking,
    deleteBooking,
    retrieveBooking,
    retrieveAllBookings,
    retrieveUserBookings,
    retrieveBookingHistory,
    retrieveBookingHistoryForUser
} from '../queries/booking.repository.js';

const createBookingHandler = async (req, res) => {
    try {
        const { total_amount, payment_status, payment_method, payment_transaction_id, status} = req.body;
        if(
            !total_amount ||
            !payment_status ||
            !payment_method ||
            !payment_transaction_id ||
            !status
        )
            return res.status(400).json({ success: false, message: "All fields are required" });
        const id = await createBooking({ user_id: req.user.user_id, ...req.body});
        const newBooking = await retrieveBooking(id);
        return res.status(201).json({ success: true, message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        console.error({ message: "Error happened in createBookingHandler", error });
        return res.status(500).json({ success: false, message: "Failed to create booking" });
    }
}

const updateBookingHandler = async (req, res) => {
    try {
        const { bookingId, total_amount, payment_status, payment_method } = req.body;
        if(!bookingId || !total_amount || !payment_status || !payment_method)
            return res.status(400).json({ success: false, message: "All fields are required" });
        const result = await updateBooking(req.body);
        if(result.affectedRows === 0) 
            return res.status(404).json({ success: false, message: "Booking not found" });
        const updatedBooking = await retrieveBooking(bookingId);
        return res.status(200).json({ success: true, message: "Booking updated successfully", booking: updatedBooking });
    } catch (error) {
        console.error({ message: "Error happened in updateBookingHandler", error });
        return res.status(500).json({ success: false, message: "Failed to update booking" });
    }
}

const deleteBookingHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id)
            return res.status(400).json({ success: false, message: "Booking ID is required" });
        const result = await deleteBooking(id);
        if(result.affectedRows === 0)
            return res.status(404).json({ success: false, message: "Booking not found" });
        return res.status(200).json({ success: true, message: "Booking deleted successfully" });
    } catch (error) {
        console.error({ message: "Error happened in deleteBookingHandler", error });
        return res.status(500).json({ success: false, message: "Failed to delete booking" });
    }
}

const getAllBookings = async (req, res) => {
    try {
        const bookings = await retrieveAllBookings();
        if(bookings.length === 0) 
            return res.status(404).json({ success: false, message: "No bookings found" });
        return res.status(200).json({ success: true, message: "All bookings retrieved successfully", bookings });
    } catch (error) {
        console.error({ message: "Error happened in getAllBookings", error });
        return res.status(500).json({ success: false, message: "Failed to retrieve all bookings" });
    }
}

const getUserBookings = async (req, res) => {
    try {
        const bookings = await retrieveUserBookings(req.user.user_id);
        if(bookings.length === 0) 
            return res.status(404).json({ success: false, message: "No bookings found for this user" });
        return res.status(200).json({ success: true, message: "User bookings retrieved successfully", bookings });
    } catch (error) {
        console.error({ message: "Error happened in getUserBookings", error });
        return res.status(500).json({ success: false, message: "Failed to retrieve user bookings" });
    }
}

const getBookingHistory = async (req, res) => {
    try {
        const bookingHistory = await retrieveBookingHistory();
        if(bookingHistory.length === 0) 
            return res.status(404).json({ success: false, message: "No booking history found" });
        return res.status(200).json({ success: true, message: "Booking history retrieved successfully", bookingHistory });
    } catch (error) {
        console.error({ message: "Error happened in getBookingHistory", error });
        return res.status(500).json({ success: false, message: "Failed to retrieve all booking history" });
    }
}

const getBookingHistoryForUser = async (req, res) => {
    try {
        const bookingHistory = await retrieveBookingHistoryForUser(req.user.user_id);
        if(bookingHistory.length === 0) 
            return res.status(404).json({ success: false, message: "No booking history found for this user" });
        return res.status(200).json({ success: true, message: "Booking history retrieved successfully", bookingHistory });
    } catch (error) {
        console.error({ message: "Error happened in getBookingHistoryForUser", error });
        return res.status(500).json({ success: false, message: "Failed to retrieve booking history for user" });
    }
}


export {
    createBookingHandler,
    updateBookingHandler,
    deleteBookingHandler,
    getAllBookings,
    getUserBookings,
    getBookingHistory,
    getBookingHistoryForUser
};