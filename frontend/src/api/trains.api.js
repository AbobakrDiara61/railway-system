import api from './axios';

export const getTrains           = ()       => api.get('/trains');
export const searchTrains        = (params) => api.get('/trains/search', { params });
export const getTrainsByType     = (type)   => api.get(`/trains/type/${type}`);
export const getTrainsByStatus   = (status) => api.get(`/trains/status/${status}`);
export const getTrainCounts      = ()       => api.get('/trains/counts');
export const getTrainCapacity    = ()       => api.get('/trains/capacity');
export const getTrainsWithJourneys = ()     => api.get('/trains/journeys');
export const getScheduledTrainJourneys = () => api.get('/trains/scheduled-journeys');
export const createTrain         = (data)   => api.post('/trains', data);
export const updateTrain         = (id, data) => api.put(`/trains/${id}`, data);
export const deleteTrain         = (id)     => api.delete(`/trains/${id}`);
