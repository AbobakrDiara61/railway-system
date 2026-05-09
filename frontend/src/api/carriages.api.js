import api from './axios';

export const getCarriages = () => api.get('/carriages');
export const getCarriageClasses = () => api.get('/carriages/classes');
export const getCarriagesByTrain = (trainId) => api.get(`/carriages/train/${trainId}`);
export const getTrainCapacity = (trainId) => api.get(`/carriages/train/${trainId}/capacity`);
export const getCarriageById = (id) => api.get(`/carriages/${id}`);
export const createCarriage = (data) => api.post('/carriages', data);
export const deleteCarriage = (id) => api.delete(`/carriages/${id}`);
