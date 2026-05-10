import express from 'express'
import { 
    createBookingHandler,
    updateBookingHandler,
    deleteBookingHandler,
    getAllBookings,
    getUserBookings,
    getBookingHistory,
    getBookingHistoryForUser
} from '../controllers/booking.controller.js';
import { protect } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, adminOnly ,createBookingHandler);
router.put('/', protect, updateBookingHandler);
router.delete('/:id', protect, adminOnly, deleteBookingHandler);
router.get('/', protect, adminOnly, getAllBookings);
router.get('/user', protect, getUserBookings);
router.get('/history', protect, adminOnly, getBookingHistory);
router.get('/history/user', protect, getBookingHistoryForUser);

export default router