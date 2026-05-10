import api from './axios';

export const createBooking      = (data) => api.post('/bookings', data);
export const updateBooking      = (data) => api.put('/bookings', data);
export const deleteBooking      = (id)   => api.delete(`/bookings/${id}`);
export const cancelBooking      = (id)   => api.put(`/bookings/${id}/cancel`);
export const getAllBookings      = ()     => api.get('/bookings');
export const getUserBookings    = ()     => api.get('/bookings/user');         // alias
export const getBookingById     = (id)   => api.get(`/bookings/user/${id}`);
export const getBookingHistory  = ()     => api.get('/bookings/history');
export const getMyBookingHistory = ()    => api.get('/bookings/history/user');
