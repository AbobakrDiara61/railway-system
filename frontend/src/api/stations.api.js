import api from './axios';

export const getStations = () => api.get('/stations');
export const getStationById = (id) => api.get(`/stations/${id}`);
export const getStationsReport = () => api.get('/stations/report');
export const createStation = (data) => api.post('/stations', data);
export const updateStation = (data) => api.put('/stations', data);
export const deleteStation = (id) => api.delete(`/stations/${id}`);
