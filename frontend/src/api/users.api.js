import api from './axios';

export const getUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const getUsersWithBookings = () => api.get('/users/bookings');
export const getUsersReport = () => api.get('/users/report');
