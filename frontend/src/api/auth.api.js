import api from './axios';

export const login          = (credentials) => api.post('/auth/login', credentials);
export const register       = (data)        => api.post('/auth/register', data);
export const logout         = ()            => api.post('/auth/logout');
export const getProfile     = ()            => api.get('/auth/profile');
export const updateProfile  = (data)        => api.put('/auth/profile', data);
export const changePassword = (data)        => api.put('/auth/change-password', data);
export const generateOtp    = ()            => api.post('/auth/generate-otp');
export const verifyOtp      = (data)        => api.post('/auth/verify-otp', data);
export const deleteAccount  = ()            => api.delete('/auth/delete-account');
