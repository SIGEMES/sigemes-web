import { defineStore } from 'pinia';
import apiService from '@/services/apiService';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  // STATE: Data mentah yang disimpan
  state: () => ({
    token: localStorage.getItem('authToken') || null,
    userFullname: localStorage.getItem('userFullname') || null,
    userEmail: localStorage.getItem('userEmail') || null,
    userRole: localStorage.getItem('userRole') || null,
  }),

  // GETTERS: Seperti computed properties, untuk mendapatkan state turunan
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.userRole === 'admin',
    isSuperAdmin: (state) => state.userRole === 'superadmin',
  },

  // ACTIONS: Method untuk mengubah state
  actions: {
    async login(email, password) {
      // Panggil API melalui service yang sudah kita buat
      try {
        const response = await apiService.login(email, password);

        if (response.data && response.data.status) {
          const { token, fullname, email: userEmail } = response.data.data;
          const role = userEmail === "superadmin@prisma.io" ? "superadmin" : "admin";

          // Simpan data ke state Pinia
          this.token = token;
          this.userFullname = fullname;
          this.userEmail = userEmail;
          this.userRole = role;

          // Simpan juga ke localStorage sebagai cadangan jika halaman di-refresh
          localStorage.setItem('authToken', token);
          localStorage.setItem('userFullname', fullname);
          localStorage.setItem('userEmail', userEmail);
          localStorage.setItem('userRole', role);
          
          // Arahkan ke dashboard setelah berhasil
          router.push('/dashboard');
        }
      } catch (error) {
        // Jika server mengembalikan 400 maka tampilkan pesan yang lebih ramah
        if (error.response && error.response.status === 400) {
          throw new Error('Alamat email atau kata sandi salah');
        }

        // Untuk error lain, lepas kembali sehingga caller bisa menanganinya
        throw error;
      }
    },

    logout() {
      // Hapus data dari state Pinia
      this.token = null;
      this.userFullname = null;
      this.userEmail = null;
      this.userRole = null;

      // Hapus data dari localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userFullname');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');

      // Arahkan ke halaman login (path root '/')
      router.push('/');
    },
  },
});