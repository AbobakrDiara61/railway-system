import express from 'express'
import {
    createStationHandler,
    updateStationHandler,
    deleteStationnHandler,
    getStationById,
    getAllStations,
    getReport
} from '../controllers/station.controller.js'
import { protect } from '../middlewares/authMiddleware.js'
import { adminOnly, superAdminOnly } from '../middlewares/roleMiddleware.js'

const router = express.Router();

router.post('/', protect, adminOnly, createStationHandler);
router.put('/', protect, adminOnly, updateStationHandler);
router.delete('/:id', protect, adminOnly, deleteStationnHandler);
router.get('/:id', protect, getStationById);
router.get('/', protect, getAllStations);
router.get('/report', protect, adminOnly, getReport);

export default router