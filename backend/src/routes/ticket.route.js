import express from 'express'
import {
    createTicketHandler,
    updateTicketHandler,
    deleteTicketHandler,
    cancelTicketHandler,
    getTicketById,
    getAllTickets,
    getTicketsBookingDetails
} from '../controllers/ticket.controller.js';
import { protect } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, createTicketHandler);
router.put('/', protect, adminOnly, updateTicketHandler);
router.put('/cancel/:id', protect, cancelTicketHandler);
router.delete('/:id', protect, adminOnly, deleteTicketHandler);
router.get('/:id', protect, getTicketById);
router.get('/', protect, adminOnly, getAllTickets);
router.get('/bookings', protect, adminOnly, getTicketsBookingDetails);

export default router