<template>
  <div class="toast-container">
    <transition-group name="toast-list" tag="div">
      <ToastNotification
        v-for="toast in toasts"
        :key="toast.id"
        :type="toast.type"
        :message="toast.message"
        :duration="toast.duration"
        @close="removeToast(toast.id)"
      />
    </transition-group>
  </div>
</template>

<script>
import ToastNotification from './ToastNotification.vue';

export default {
  components: {
    ToastNotification,
  },
  data() {
    return {
      toasts: [],
      nextToastId: 0,
    };
  },
  methods: {
    addToast(type, message, duration = 5000) {
      const id = this.nextToastId++;
      this.toasts.push({ id, type, message, duration });
    },
    removeToast(id) {
      this.toasts = this.toasts.filter((toast) => toast.id !== id);
    },
  },
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center; /* Toast muncul di tengah */
}

/* Transisi untuk daftar toast */
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.5s ease;
}
.toast-list-enter-from,
.toast-list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.toast-list-move {
  transition: transform 0.5s ease;
}
</style>