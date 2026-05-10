import express from 'express'
import {
    getAllUsers,
    getUserById,
    getUsersBookings,
    getReport
} from '../controllers/users.controller.js';
import { protect } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.get('/bookings', protect, adminOnly, getUsersBookings);
router.get('/report', protect, adminOnly, getReport);

export default router