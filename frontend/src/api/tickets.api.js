import api from './axios';

export const getAllTickets = () => api.get('/tickets');
export const getTicketById = (id) => api.get(`/tickets/${id}`);
export const getTicketsWithBookings = () => api.get('/tickets/bookings');
export const createTicket = (data) => api.post('/tickets', data);
export const updateTicket = (data) => api.put('/tickets', data);
export const cancelTicket = (id) => api.put(`/tickets/cancel/${id}`);
export const deleteTicket = (id) => api.delete(`/tickets/${id}`);
