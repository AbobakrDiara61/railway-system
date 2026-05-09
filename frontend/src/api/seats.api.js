import api from './axios';

export const getSeatsAvailability = () => api.get('/seats/availability');
export const getAllSeats = () => api.get('/seats');
export const getSeatCountsPerCarriage = () => api.get('/seats/counts-per-carriage');
export const getSeatTrainDetails = () => api.get('/seats/train-details');
