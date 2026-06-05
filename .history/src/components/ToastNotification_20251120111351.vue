<template>
  <div :class="['toast-notification', type]" v-if="visible">
    <div class="icon-container">
      <template v-if="type === 'success'">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.89a.75.75 0 0 0-1.061-1.06l-4.25 4.25-1.75-1.75a.75.75 0 1 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.75-4.75Z" clip-rule="evenodd" />
        </svg>
      </template>
      <template v-else-if="type === 'info'">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.082-3.444a.75.75 0 1 0-1.06-1.06l-3.5 3.5a.75.75 0 0 0 0 1.06l3.5 3.5a.75.75 0 0 0 1.06-1.06L10.56 12l2.772-2.772Z" clip-rule="evenodd" />
        </svg>
      </template>
      <template v-else-if="type === 'warning'">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path fill-rule="evenodd" d="M9.401 3.003c1.155-1.156 3.031-1.156 4.187 0l4.642 4.643a2.25 2.25 0 0 1 .657 1.554v5.006c0 1.102.898 2 2 2h2.25a.75.75 0 0 0 0-1.5H20.25a.75.75 0 0 1-.75-.75V8.199a.75.75 0 0 0-.22-.53L15.3 3.498a.75.75 0 0 0-1.06 0L9.401 7.438a.75.75 0 0 0-.22.53v5.006c0 1.102.898 2 2 2h2.25a.75.75 0 0 0 0-1.5H13.5a.75.75 0 0 1-.75-.75V8.199a.75.75 0 0 0-.22-.53L8.3 3.498a.75.75 0 0 0-1.06 0L2.955 7.438a.75.75 0 0 0-.22.53v5.006c0 1.102.898 2 2 2h2.25a.75.75 0 0 0 0-1.5H5.25a.75.75 0 0 1-.75-.75V8.199a.75.75 0 0 0-.22-.53L.708 3.498a.75.75 0 0 0-1.06 0Z" clip-rule="evenodd" />
        </svg>
      </template>
      <template v-else-if="type === 'error'">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" />
        </svg>
      </template>
    </div>
    <div class="message-content">
      <div class="title">{{ type }}</div>
      <div class="message">{{ message }}</div>
    </div>
    <button class="close-btn" @click="hideToast">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
        <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ['success', 'info', 'warning', 'error'].includes(value),
    },
    message: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 5000, // Durasi default 5 detik
    },
  },
  data() {
    return {
      visible: false,
      timeoutId: null,
    };
  },
  methods: {
    showToast() {
      this.visible = true;
      if (this.duration > 0) {
        this.timeoutId = setTimeout(() => {
          this.hideToast();
        }, this.duration);
      }
    },
    hideToast() {
      this.visible = false;
      clearTimeout(this.timeoutId);
      this.$emit('close'); // Emit event ketika toast ditutup
    },
  },
  mounted() {
    this.showToast();
  },
  watch: {
    // Memastikan toast muncul kembali jika properti berubah
    type() {
      this.showToast();
    },
    message() {
      this.showToast();
    },
  },
};
</script>

<style scoped>
.toast-notification {
  display: flex;
  align-items: center;
  gap: 12px; /* Jarak antara ikon, pesan, dan tombol tutup */
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
  position: relative; /* Untuk posisi tombol tutup */
  max-width: 400px; /* Lebar maksimum toast */
  transition: all 0.3s ease-in-out;
  transform: translateY(0);
  opacity: 1;
}

/* Animasi slide-in dan fade-in */
.toast-notification.v-enter-active,
.toast-notification.v-leave-active {
  transition: all 0.5s ease;
}
.toast-notification.v-enter-from,
.toast-notification.v-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-notification .icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px; /* Ukuran ikon SVG */
  height: 24px;
}

.toast-notification .icon-container svg {
  width: 100%;
  height: 100%;
}

.toast-notification .message-content {
  flex-grow: 1;
}

.toast-notification .title {
  font-weight: bold;
  font-size: 16px;
  text-transform: capitalize; /* Mengkapitalisasi jenis toast */
  margin-bottom: 4px;
}

.toast-notification .message {
  font-size: 14px;
  color: #333;
}

.toast-notification .close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #888;
  font-size: 18px;
  line-height: 1;
  transition: color 0.2s ease;
}

.toast-notification .close-btn:hover {
  color: #555;
}

/* Styles berdasarkan jenis toast */
.toast-notification.success {
  background-color: #e6ffed; /* Hijau muda */
  border: 1px solid #00c14f; /* Border hijau */
}
.toast-notification.success .icon-container svg {
  color: #00c14f; /* Ikon hijau */
}
.toast-notification.success .title {
  color: #00c14f;
}

.toast-notification.info {
  background-color: #e0f2fe; /* Biru muda */
  border: 1px solid #2196f3; /* Border biru */
}
.toast-notification.info .icon-container svg {
  color: #2196f3; /* Ikon biru */
}
.toast-notification.info .title {
  color: #2196f3;
}

.toast-notification.warning {
  background-color: #fffde7; /* Kuning muda */
  border: 1px solid #ffc107; /* Border kuning */
}
.toast-notification.warning .icon-container svg {
  color: #ffc107; /* Ikon kuning */
}
.toast-notification.warning .title {
  color: #ffc107;
}

.toast-notification.error {
  background-color: #ffebee; /* Merah muda */
  border: 1px solid #f44336; /* Border merah */
}
.toast-notification.error .icon-container svg {
  color: #f44336; /* Ikon merah */
}
.toast-notification.error .title {
  color: #f44336;
}
</style>