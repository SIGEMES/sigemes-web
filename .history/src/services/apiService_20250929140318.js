import axios from 'axios';

// instance axios base URL dari .env
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => Promise.reject(error)
);

export default {
    // method autentikasi
    login(email, password) {
        return apiClient.post('/admins/login', { email, password });
    },
    
    // method admin
    getAdmins() {
        return apiClient.get('/admins');
    },
    createAdmin(adminData) {
        return apiClient.post('/admins', adminData);
    },
    updateAdmin(id, adminData) {
        return apiClient.put(`/admins/${id}`, adminData);
    },
    deleteAdmin(id) {
        return apiClient.delete(`/admins/${id}`);
    },
    getAdminById(id) {
        return apiClient.get(`/admins/${id}`);
    },

    // method daftar gedung nasional
    getBuildings() {
        return apiClient.get('/buildings');
    },
    createBuilding(buildingData) {
        return apiClient.post('/buildings', buildingData);
    },
    updateBuilding(id, buildingData) {
        return apiClient.put(`/buildings/${id}`, buildingData);
    },
    deleteBuilding(id) {
        return apiClient.delete(`/buildings/${id}`);
    },
    getBuildingById(id) {
        return apiClient.get(`/buildings/${id}`);
    },

    // method daftar 
    getRooms() {
        return apiClient.get('/rooms');
    },
    createRoom(roomData) {
        return apiClient.post('/rooms', roomData);
    },
    updateRoom(id, roomData) {
        return apiClient.put(`/rooms/${id}`, roomData);
    },
    deleteRoom(id) {
        return apiClient.delete(`/rooms/${id}`);
    },
    getRoomById(id) {
        return apiClient.get(`/rooms/${id}`);
    },
    getRoomsByBuilding(buildingId) {
        return apiClient.get(`/rooms?buildingId=${buildingId}`);
    },

    // Dashboard methods
    getDashboardStats() {
        return apiClient.get('/dashboard/stats');
    },
    getDashboardData() {
        return apiClient.get('/dashboard');
    },
};