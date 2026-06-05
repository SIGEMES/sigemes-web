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
    // autentikasi login
    login(email, password) {
        // Penjelasan: Mengirim data email & password untuk mendapatkan token.
        // Endpoint: POST /admins/login
        // Dipakai di: LoginView.vue
        return apiClient.post('/admins/login', { email, password });
    },

    // admin
    getAdmins() {
        // Penjelasan: Mengambil seluruh daftar admin.
        // Endpoint: GET /admins
        // Dipakai di: DataAdminView.vue
        return apiClient.get('/admins');
    },
    createAdmin(adminData) {
        // Penjelasan: Membuat admin baru. `adminData` adalah objek berisi fullname, email, dll.
        // Endpoint: POST /admins
        // Dipakai di: DataAdminView.vue
        return apiClient.post('/admins', adminData);
    },
    updateAdmin(id, formData) {
        // Penjelasan: Memperbarui data admin. Menggunakan FormData karena ada kemungkinan password.
        // Endpoint: PUT /admins/{id}
        // Dipakai di: DataAdminView.vue
        return apiClient.put(`/admins/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    deleteAdmin(id) {
        // Penjelasan: Menghapus akun admin berdasarkan ID.
        // Endpoint: DELETE /admins/{id}
        // Dipakai di: DataAdminView.vue
        return apiClient.delete(`/admins/${id}`);
    },

    // === DASHBOARD & RENTALS ===
    getDashboardRevenue(type, date) {
        // Penjelasan: Mengambil data pendapatan (harian, bulanan, atau tahunan).
        // Endpoint: GET /dashboard/{daily/monthly/annual}-revenue?date=...
        // Dipakai di: DashboardView.vue
        return apiClient.get(`/dashboard/${type}-revenue`, { params: { date } });
    },
    getRentals(params) {
        // Penjelasan: Mengambil daftar sewa dengan filter (pencarian, tanggal, dll).
        // Endpoint: GET /rents
        // Dipakai di: DashboardView.vue
        return apiClient.get('/rents', { params });
    },
    getRentalDetail(id) {
        // Penjelasan: Mengambil detail satu data sewa berdasarkan ID.
        // Endpoint: GET /rents/{id}
        // Dipakai di: DashboardView.vue
        return apiClient.get(`/rents/${id}`);
    },
    getRenter(id) {
        // Penjelasan: Mengambil detail data penyewa (renter) berdasarkan ID.
        // Endpoint: GET /renters/{id}
        // Dipakai di: DashboardView.vue
        return apiClient.get(`/renters/${id}`);
    },

    // === GEDUNG NASIONAL (CITY HALLS) ===
    getCityHalls() {
        // Penjelasan: Mengambil seluruh daftar Gedung Nasional.
        // Endpoint: GET /city-halls
        // Dipakai di: DataGedungNasionalView.vue, DashboardView.vue (untuk ekspor)
        return apiClient.get('/city-halls');
    },
    getCityHallDetail(id) {
        // Penjelasan: Mengambil detail satu Gedung Nasional.
        // Endpoint: GET /city-halls/{id}
        // Dipakai di: DataGedungNasionalView.vue
        return apiClient.get(`/city-halls/${id}`);
    },
    createCityHall(formData) {
        // Penjelasan: Membuat Gedung Nasional baru dengan data dari form (termasuk foto).
        // Endpoint: POST /city-halls
        // Dipakai di: DataGedungNasionalView.vue
        return apiClient.post('/city-halls', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    updateCityHall(id, formData) {
        // Penjelasan: Memperbarui Gedung Nasional dengan data dari form.
        // Endpoint: PUT /city-halls/{id}
        // Dipakai di: DataGedungNasionalView.vue
        return apiClient.put(`/city-halls/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    deleteCityHall(id) {
        // Penjelasan: Menghapus Gedung Nasional.
        // Endpoint: DELETE /city-halls/{id}
        // Dipakai di: DataGedungNasionalView.vue
        return apiClient.delete(`/city-halls/${id}`);
    },

    // === GEDUNG MESS (GUESTHOUSES & ROOMS) ===
    getGuesthouses() {
        // Penjelasan: Mengambil seluruh daftar Gedung Mess.
        // Endpoint: GET /guesthouses
        // Dipakai di: DataRuangMessView.vue, DashboardView.vue (untuk ekspor)
        return apiClient.get('/guesthouses');
    },
    getGuesthouseDetail(id) {
        // Penjelasan: Mengambil detail satu Gedung Mess.
        // Endpoint: GET /guesthouses/{id}
        // Dipakai di: DataRuangMessView.vue
        return apiClient.get(`/guesthouses/${id}`);
    },
    getGuesthouseRooms(guesthouseId) {
        // Penjelasan: Mengambil daftar semua kamar dalam satu Gedung Mess.
        // Endpoint: GET /guesthouses/{guesthouseId}/rooms
        // Dipakai di: DataRuangMessView.vue
        return apiClient.get(`/guesthouses/${guesthouseId}/rooms`);
    },
    createGuesthouse(formData) {
        // Penjelasan: Membuat Gedung Mess baru.
        // Endpoint: POST /guesthouses
        // Dipakai di: DataRuangMessView.vue
        return apiClient.post('/guesthouses', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    createGuesthouseRoom(guesthouseId, formData) {
        // Penjelasan: Menambah kamar baru ke sebuah Gedung Mess.
        // Endpoint: POST /guesthouses/{guesthouseId}/rooms
        // Dipakai di: DataRuangMessView.vue
        return apiClient.post(`/guesthouses/${guesthouseId}/rooms`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    updateGuesthouse(id, formData) {
        // Penjelasan: Memperbarui data Gedung Mess.
        // Endpoint: PUT /guesthouses/{id}
        // Dipakai di: DataRuangMessView.vue
        return apiClient.put(`/guesthouses/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    updateGuesthouseRoom(guesthouseId, roomId, formData) {
        // Penjelasan: Memperbarui data kamar di sebuah Gedung Mess.
        // Endpoint: PUT /guesthouses/{guesthouseId}/rooms/{roomId}
        // Dipakai di: DataRuangMessView.vue
        return apiClient.put(`/guesthouses/${guesthouseId}/rooms/${roomId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    deleteGuesthouse(id) {
        // Penjelasan: Menghapus Gedung Mess (beserta semua kamarnya).
        // Endpoint: DELETE /guesthouses/{id}
        // Dipakai di: DataRuangMessView.vue
        return apiClient.delete(`/guesthouses/${id}`);
    },
    deleteGuesthouseRoom(guesthouseId, roomId) {
        // Penjelasan: Menghapus sebuah kamar dari Gedung Mess.
        // Endpoint: DELETE /guesthouses/{guesthouseId}/rooms/{roomId}
        // Dipakai di: DataRuangMessView.vue
        return apiClient.delete(`/guesthouses/${guesthouseId}/rooms/${roomId}`);
    },

    // === REVIEWS & REPLIES (UMUM) ===
    getReviewsForCityHall(cityHallId) {
        // Penjelasan: Mengambil ulasan untuk Gedung Nasional.
        // Endpoint: GET /city-halls/{cityHallId}/reviews
        // Dipakai di: DataGedungNasionalView.vue
        return apiClient.get(`/city-halls/${cityHallId}/reviews`);
    },
    getReviewsForGuesthouseRoom(guesthouseId, roomId) {
        // Penjelasan: Mengambil ulasan untuk sebuah kamar di Gedung Mess.
        // Endpoint: GET /guesthouses/{guesthouseId}/rooms/{roomId}/reviews
        // Dipakai di: DataRuangMessView.vue
        return apiClient.get(`/guesthouses/${guesthouseId}/rooms/${roomId}/reviews`);
    },
    createReviewReply(rentId, reviewId, comment) {
        // Penjelasan: Mengirim balasan untuk sebuah ulasan.
        // Endpoint: POST /rents/{rentId}/reviews/{reviewId}/replies
        // Dipakai di: DataGedungNasionalView.vue, DataRuangMessView.vue
        return apiClient.post(`/rents/${rentId}/reviews/${reviewId}/replies`, { comment });
    },
    updateReviewReply(rentId, reviewId, replyId, comment) {
        // Penjelasan: Memperbarui balasan yang sudah ada.
        // Endpoint: PUT /rents/{rentId}/reviews/{reviewId}/replies/{replyId}
        // Dipakai di: DataGedungNasionalView.vue, DataRuangMessView.vue
        return apiClient.put(`/rents/${rentId}/reviews/${reviewId}/replies/${replyId}`, { comment });
    },
    deleteReviewReply(rentId, reviewId, replyId) {
        // Penjelasan: Menghapus balasan.
        // Endpoint: DELETE /rents/{rentId}/reviews/{reviewId}/replies/{replyId}
        // Dipakai di: DataGedungNasionalView.vue, DataRuangMessView.vue
        return apiClient.delete(`/rents/${rentId}/reviews/${reviewId}/replies/${replyId}`);
    },
};