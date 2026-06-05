<template>
  <div class="app-container">
    <!-- RouterView akan merender halaman utama (views) di sini -->
    <router-view />
    
    <!-- Toast Container: Komponen ini harus berada di luar router-view 
         agar selalu terlihat di semua halaman (global position: fixed) -->
    <ToastContainer ref="toastContainer" />
  </div>
</template>

<script setup>
import { ref, provide } from "vue";
import { RouterView } from "vue-router";
import ToastContainer from "@/components/ToastContainer.vue"; // Sesuaikan path jika perlu

// 1. Dapatkan referensi (ref) ke ToastContainer
const toastContainer = ref(null);

// 2. Tentukan fungsi showToast global
const showToast = (type, message, duration = 5000) => {
  // Pastikan ToastContainer sudah dimuat sebelum memanggil fungsinya
  if (toastContainer.value) {
    toastContainer.value.addToast(type, message, duration);
  } else {
    console.error("ToastContainer belum dimuat.");
  }
};

// 3. Sediakan fungsi showToast ke seluruh aplikasi menggunakan provide/inject
// Ini adalah cara terbaik di Composition API untuk memanggil fungsi global dari komponen anak.
provide('showToast', showToast);
</script>

<style>
/* Global styles */
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #f7f9fc;
  font-family: 'Inter', sans-serif; /* Ganti 'serif' menjadi 'sans-serif' untuk Inter */
  font-weight: 600; /* Semi-bold */
}

.app-container {
  width: 100%;
  height: 100%;
}
</style>