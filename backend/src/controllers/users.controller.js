import { 
    retrieveAllUsers,
    retrieveUser,
    retrieveUsersBookings,
    retrieveCertainUsers,
    retrieveBookingCounts,
    retrieveBookingCountsPerMethod,
    retrieveBookingCountsPerUser,
    deleteUser
} from '../queries/users.repository.js';

const getAllUsers = async (req, res) => {
    try {
        const users = await retrieveAllUsers();
        if(users.length === 0)
            return res.status(404).json({ success: false, message: "No users are found" });
        return res.status(200).json({ success: true, message: "All users are fetched successfully", users });
    } catch (error) {
        console.error("Error in getAllUsers controller", error);
        return res.status(500).json({ success: false, message: "Users retrieval has failed" });
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id)
            return res.status(400).json({ success: false, message: "User ID is required" });
        const user = await retrieveUser(id);
        if(!user)
            return res.status(404).json({ success: false, message: "User is not found" });
        return res.status(200).json({ success: true, message: "User found successfully", user });
    } catch (error) {
        console.error("Error in getUserById controller", error);
        return res.status(500).json({ success: false, message: "User retrieval has failed" });
    }
}

const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id)
            return res.status(400).json({ success: false, message: "User ID is required" });
        const result = await deleteUser(id);
        if(result.affectedRows === 0)
            return res.status(404).json({ success: false, message: "User is not found" });
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUserById controller", error);
        return res.status(500).json({ success: false, message: "User deletion has failed" });
    }
}

const getUsersBookings = async (req, res) => {
    try {
        const users = await retrieveUsersBookings();
        if(users.length === 0)
            return res.status(404).json({ success: false, message: "No bookings are found" });
        return res.status(200).json({ success: true, message: "Users bookings fetched successfully", data: { ...users[0] } });
    } catch (error) {
        console.error("Error in getUsersBookings controller", error);
        return res.status(500).json({ success: false, message: "Users bookings retrieval has failed" });
    }
}

const getReport = async (req, res) => {
    try {
        const BookingCounts = await retrieveBookingCounts();
        const bookingCountsPerMethod = await retrieveBookingCountsPerMethod()
        const bookingCountsPerUser = await retrieveBookingCountsPerUser()
        const refundedUsers = await retrieveCertainUsers('refunded');
        const pendingUsers = await retrieveCertainUsers('pending');
        const paidUsers = await retrieveCertainUsers('paid');
        const paidUsersWithCreditCard = await retrieveCertainUsers('paid', 'credit_card');
        const paidUsersWithCash = await retrieveCertainUsers('paid', 'cash');

        return res.status(200).json({
            success: true,
            message: "Report generated successfully",
            data: {
                BookingCounts,
                bookingCountsPerMethod,
                bookingCountsPerUser,
                refundedUsers,
                pendingUsers,
                paidUsers,
                paidUsersWithCreditCard,
                paidUsersWithCash
            }
        })
    } catch (error) {
        console.error("Error in getReport controller", error);
        return res.status(500).json({ success: false, message: "Generating report has failed" });
    }
}

export {
    getAllUsers,
    getUserById,
    getUsersBookings,
    getReport,
    deleteUserById,
};

