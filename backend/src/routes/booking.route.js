import express from 'express'
import { 
    createBookingHandler,
    updateBookingHandler,
    deleteBookingHandler,
    getAllBookings,
    getUserBookings,
    getBookingHistory,
    getBookingHistoryForUser,
    cancelBookingHandler,
    getUserBookingById,
} from '../controllers/booking.controller.js';
import { protect } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, createBookingHandler);
router.put('/', protect, updateBookingHandler);
router.delete('/:id', protect, adminOnly, deleteBookingHandler);
router.get('/', protect, adminOnly, getAllBookings);
router.get('/user', protect, getUserBookings);
router.get('/user/:booking_id', protect, getUserBookingById);
router.get('/history', protect, adminOnly, getBookingHistory);
router.get('/history/user', protect, getBookingHistoryForUser);
router.put('/:id/cancel', protect, cancelBookingHandler);

export default router