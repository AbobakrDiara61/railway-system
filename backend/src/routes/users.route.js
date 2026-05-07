import express from 'express'
import {
    getAllUsers,
    getUserById,
    getUsersBookings,
    getReport
} from '../controllers/users.controller.js';
import { protect } from '../middlewares/authMiddleware.js';
import { superAdminOnly } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, superAdminOnly, getAllUsers);
router.get('/:id', protect, superAdminOnly, getUserById);
router.get('/bookings', protect, superAdminOnly, getUsersBookings);
router.get('/report', protect, superAdminOnly, getReport);

export default router