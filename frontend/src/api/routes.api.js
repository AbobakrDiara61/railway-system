import api from './axios';

export const getRoutes = () => api.get('/routes');
export const getRoutesWithDetails = () => api.get('/routes/details');
export const getRouteById = (id) => api.get(`/routes/${id}`);
export const createRoute = (data) => api.post('/routes', data);
export const deleteRoute = (id) => api.delete(`/routes/${id}`);
