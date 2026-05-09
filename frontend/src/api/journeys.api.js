import api from './axios';

export const getJourneys = () => api.get('/journeys');
export const getJourneyById = (id) => api.get(`/journeys/${id}`);
export const getJourneySeats = (id) => api.get(`/journeys/${id}/seats`);
export const getJourneysWithTrains = () => api.get('/journeys/trains');
export const getJourneyCount = () => api.get('/journeys/count');
export const getJourneyReports = () => api.get('/journeys/reports');
export const createJourney = (data) => api.post('/journeys', data);
export const updateJourney = (id, data) => api.put(`/journeys/${id}`, data);
