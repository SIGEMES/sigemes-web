<template>
  <div>
    <Navigation />
    <div class="container mt-6 mx-auto px-6 py-8">
      <!-- Header & Tombol -->
      <div class="flex justify-between items-center">
        <h1 class="data-admin-text text-3xl font-black text-black">Daftar Admin</h1>
        <button
          @click="openCreateModal(Admin)"
          class="data-admin-text font-bold bg-blue-500 text-white px-5 py-2 text-sm rounded-lg hover-gradient"
        >
          Tambah Akun Admin
        </button>
      </div>

      <!-- Notifikasi Error -->
      <div v-if="errorMessage" class="text-red-600 bg-red-100 p-3 rounded-lg mt-4">
        {{ errorMessage }}
      </div>

      <!-- Tabel Data Admin -->
      <div class="mt-4 bg-blue-100 p-6 rounded-xl shadow-xl overflow-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="data-admin-text text-white bg-blue-500 text-black">
              <th class="py-2 px-4 border text-center font-bold">No</th>
              <th class="py-2 px-4 border text-center font-bold">Nama</th>
              <th class="py-2 px-4 border text-center font-bold">Email</th>
              <th class="py-2 px-4 border text-center font-bold">Nomor Telepon</th>
              <th class="py-2 px-4 border text-center font-bold">Aksi</th>
            </tr>
          </thead>
          <transition-group name="admin-row" tag="tbody">
            <tr
              v-for="(admin, index) in admins.slice(1)"
              :key="admin.id"
              class="bg-white text-black"
              :class="{ 'deleting-row': deletingAdminId === admin.id }"
            >
              <td class="py-2 px-4 border text-center">{{ index + 1 }}</td>
              <td class="py-2 px-4 border">{{ admin.fullname }}</td>
              <td class="py-2 px-4 border">{{ admin.email }}</td>
              <td class="py-2 px-4 border">{{ admin.phone_number }}</td>
              <td class="py-2 px-4 border">
                <div class="flex justify-evenly w-full data-admin-text">
                  <button @click="openEditModal(admin)" class="text-blue-500">Edit</button>
                  <button @click="openDeleteModal(admin)" class="text-red-500">Hapus</button>
                </div>
              </td>
            </tr>
          </transition-group>
        </table>

        <!-- Loading -->
        <div v-if="isLoading" class="text-center font-semibold text-black mt-4 loading-container">
          <span class="text-black loading-text">Memuat data...</span>
        </div>
      </div>
    </div>

    <!-- Modal Edit Admin -->
    <transition name="modal-fade">
      <div
        v-if="showEditModal"
        class="detail-modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40"
      >
        <div
          class="detail-modal-cardbox w-3/4 max-w-lg rounded-2xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
        >
          <h2 class="data-admin-text text-2xl font-black text-center text-black mb-6">
            Edit Akun Admin
          </h2>
          <form @submit.prevent="updateAdmin">
            <div class="mb-4">
              <label class="data-admin-text font-bold text-black block">Nama</label>
              <input
                v-model="editAdmin.fullname"
                type="text"
                class="text-black w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div class="mb-4">
              <label class="data-admin-text font-bold text-black block">Email</label>
              <input
                v-model="editAdmin.email"
                type="email"
                class="text-black w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div class="mb-4">
              <label class="data-admin-text font-bold text-black block">Password Baru</label>
              <div class="relative">
                <input
                  v-model="editAdmin.password"
                  :type="showEditPassword ? 'text' : 'password'"
                  class="text-black w-full p-2 pr-10 border rounded-lg"
                  placeholder="Kosongi jika tidak diganti"
                />
                <button
                  type="button"
                  @click="toggleEditPassword"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <svg
                    v-if="!showEditPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div class="mb-6">
              <label class="data-admin-text font-bold text-black block">Nomor Telepon</label>
              <input
                v-model="editAdmin.phone_number"
                type="text"
                class="text-black w-full p-2 border rounded-lg"
                :class="{ 'border-red-500': editPhoneError }"
                @input="validatePhoneNumber($event, 'edit')"
                required
              />
              <p v-if="editPhoneError" class="text-red-500 text-sm mt-1">{{ editPhoneError }}</p>
            </div>
            <div class="flex justify-center space-x-4">
              <button
                type="submit"
                class="data-admin-text font-bold bg-blue-500 text-white px-5 py-2 rounded-lg hover-gradient"
              >
                Simpan
              </button>
              <button
                type="button"
                @click="closeEditModal"
                class="data-admin-text font-bold bg-blue-500 text-white px-5 py-2 rounded-lg hover-gradient"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal Buat Akun Admin -->
    <transition name="modal-fade">
      <div
        v-if="showCreateModal"
        class="detail-modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40"
      >
        <div
          class="detail-modal-cardbox w-3/4 max-w-lg rounded-2xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
        >
          <h2 class="data-admin-text text-2xl font-black text-center text-black mb-6">
            Buat Akun Admin
          </h2>
          <form @submit.prevent="createAdmin">
            <div class="mb-4">
              <label class="data-admin-text font-bold text-black block">Nama</label>
              <input
                v-model="newAdmin.fullname"
                type="text"
                class="text-black w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div class="mb-4">
              <label class="data-admin-text font-bold text-black block">Email</label>
              <input
                v-model="newAdmin.email"
                type="email"
                class="text-black w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div class="mb-4">
              <label class="data-admin-text font-bold text-black block">Nomor Telepon</label>
              <input
                v-model="newAdmin.phone_number"
                type="text"
                class="text-black w-full p-2 border rounded-lg"
                :class="{ 'border-red-500': phoneError }"
                @input="validatePhoneNumber($event, 'create')"
                required
              />
              <p v-if="phoneError" class="text-red-500 text-sm mt-1">{{ phoneError }}</p>
            </div>
            <div class="mb-4">
              <label class="data-admin-text font-bold text-black block">Password</label>
              <div class="relative">
                <input
                  v-model="newAdmin.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="text-black w-full p-2 pr-10 border rounded-lg"
                  :class="{ 'border-red-500': passwordError }"
                  @input="validatePassword"
                  required
                />
                <button
                  type="button"
                  @click="togglePassword"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <svg
                    v-if="!showPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                </button>
              </div>
              <p v-if="passwordError" class="text-red-500 text-sm mt-1">
                {{ passwordError }}
              </p>
            </div>
            <div class="mb-6">
              <label class="data-admin-text font-bold text-black block">Ulangi Password</label>
              <div class="relative">
                <input
                  v-model="newAdmin.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="text-black w-full p-2 pr-10 border rounded-lg"
                  :class="{ 'border-red-500': confirmPasswordError }"
                  @input="validateConfirmPassword"
                  required
                />
                <button
                  type="button"
                  @click="toggleConfirmPassword"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <svg
                    v-if="!showConfirmPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                </button>
              </div>
              <p v-if="confirmPasswordError" class="text-red-500 text-sm mt-1">
                {{ confirmPasswordError }}
              </p>
            </div>
            <div class="flex justify-center space-x-4">
              <button
                type="submit"
                class="data-admin-text font-bold bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-700"
              >
                Buat Akun
              </button>
              <button
                @click="closeCreateModal"
                type="button"
                class="data-admin-text font-bold bg-blue-500 text-white px-5 py-2 rounded-lg hover-gradient"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal Hapus Admin -->
    <transition name="modal-fade">
      <div
        v-if="showDeleteModal"
        class="detail-modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40"
      >
        <div
          class="detail-modal-cardbox w-1/4 max-w-lg rounded-2xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
        >
          <h2 class="data-admin-text text-2xl font-black text-center text-black mb-6">
            Hapus Akun Admin?
          </h2>
          <div class="mb-6 space-y-2">
            <div class="flex text-black">
              <span class="font-bold w-40">Nama</span>
              <span class="mr-2">:</span>
              <span>{{ deleteAdminData.fullname }}</span>
            </div>
            <div class="flex text-black">
              <span class="font-bold w-40">Email</span>
              <span class="mr-2">:</span>
              <span>{{ deleteAdminData.email }}</span>
            </div>
            <div class="flex text-black">
              <span class="font-bold w-40">Nomor Telepon</span>
              <span class="mr-2">:</span>
              <span>{{ deleteAdminData.phone_number }}</span>
            </div>
          </div>
          <div class="flex justify-center space-x-4">
            <button
              @click="deleteAdmin"
              class="data-admin-text font-bold bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
              :disabled="isDeletingAdmin"
            >
              <svg
                v-if="isDeletingAdmin"
                class="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ isDeletingAdmin ? 'Menghapus...' : 'Hapus' }}</span>
            </button>
            <button
              @click="closeDeleteModal"
              class="data-admin-text font-bold bg-blue-500 text-white px-5 py-2 rounded-lg hover-gradient"
              :disabled="isDeletingAdmin"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Animasi Modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.data-admin-text {
  font-family: 'Poppins', sans-serif;
}

.detail-modal-cardbox {
  background-color: #e8f9ff;
  max-height: 90vh;
  overflow-y: auto;
}

/* Efek hover untuk tombol dengan gradient */
.hover-gradient {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.hover-gradient:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #3b82f6, #1d4ed8);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.hover-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.hover-gradient:hover:before {
  opacity: 1;
}

.loading-container {
  width: 100%;
  text-align: center;
  margin-top: 1rem;
}

.loading-container {
  width: 100%;
  text-align: center;
  margin-top: 1rem;
}

/* Animasi loading pulse */
@keyframes pulse {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.loading-text {
  animation: pulse 0.8s infinite;
  display: inline-block;
}

/* Animasi untuk row admin saat dihapus */
.admin-row-enter-active {
  transition: all 0.5s ease;
}

.admin-row-leave-active {
  transition: all 0.5s ease;
}

.admin-row-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.admin-row-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.deleting-row {
  background-color: #fee2e2 !important;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}
</style>

<script>
import axios from 'axios'
import apiService from '@/services/apiService'
import Navigation from '@/components/Navigation.vue'

export default {
  name: 'DataAdminView',
  components: { Navigation },
  inject: ['showToast'],
  data() {
    return {
      admins: [], // Daftar admin dari API
      isLoading: false, // Loading saat fetch data
      errorMessage: '', // Notifikasi error
      showEditModal: false, // Status modal edit
      showDeleteModal: false, // Status modal hapus
      showCreateModal: false, // Status modal buat
      deleteAdminData: null, // Data admin yang akan dihapus
      editAdmin: { fullname: '', email: '', password: '', phone_number: '' }, // Data admin yang diedit
      newAdmin: { fullname: '', email: '', phone_number: '', password: '', confirmPassword: '' }, // Data admin baru
      deletingAdminId: null, // Track which admin is being deleted for animation
      isDeletingAdmin: false, // State loading untuk hapus admin

      // Validation state
      passwordError: '',
      confirmPasswordError: '',
      phoneError: '',
      editPhoneError: '',

      // Password visibility toggle state
      showPassword: false,
      showConfirmPassword: false,
      showEditPassword: false,
    }
  },
  methods: {
    // Toggle password visibility methods
    togglePassword() {
      this.showPassword = !this.showPassword
    },

    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },

    toggleEditPassword() {
      this.showEditPassword = !this.showEditPassword
    },

    // Validation for phone number - only allow numbers
    validatePhoneNumber(event, formType) {
      let value = event.target.value
      // Remove all non-numeric characters
      value = value.replace(/\D/g, '')

      // Update the model based on form type
      if (formType === 'create') {
        this.newAdmin.phone_number = value
        // validate length (require at least 10 digits)
        if (this.newAdmin.phone_number.length > 0 && this.newAdmin.phone_number.length < 10) {
          this.phoneError = 'Nomor telepon minimal 10 digit'
        } else {
          this.phoneError = ''
        }
      } else if (formType === 'edit') {
        this.editAdmin.phone_number = value
        if (this.editAdmin.phone_number.length > 0 && this.editAdmin.phone_number.length < 10) {
          this.editPhoneError = 'Nomor telepon harus terdiri dari minimal 10 digit'
        } else {
          this.editPhoneError = ''
        }
      }

      // Update input value to show only numbers
      event.target.value = value
    },

    // Validation methods
    validatePassword() {
      // Show error until password reaches 10 characters
      if (this.newAdmin.password.length < 10) {
        this.passwordError = 'Password minimal 10 karakter'
      } else {
        this.passwordError = ''
      }
      // Validate confirm password juga saat password berubah
      this.validateConfirmPassword()
    },

    validateConfirmPassword() {
      if (this.newAdmin.confirmPassword.length === 0) {
        // Jangan tampilkan error jika belum mulai mengetik
        this.confirmPasswordError = ''
        return
      }

      if (this.newAdmin.password !== this.newAdmin.confirmPassword) {
        this.confirmPasswordError = 'Password tidak cocok'
      } else {
        this.confirmPasswordError = ''
      }
    },

    async fetchAdmins() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        const token = localStorage.getItem('authToken')
        if (!token) throw new Error('Token tidak ditemukan. Silakan login kembali.')

        // fetch data admin menggunakan fungsi dari apiService.js
        const response = await apiService.getAdmins()

        if (response.data.status) this.admins = response.data.data
        else this.errorMessage = 'Gagal mengambil data admin.'
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || 'Gagal mengambil data. Coba lagi nanti.'
      } finally {
        this.isLoading = false
      }
    },

    openEditModal(admin) {
      this.editAdmin = { ...admin, password: '' }
      this.showEditModal = true
    },

    closeEditModal() {
      this.showEditModal = false
      this.editAdmin = { fullname: '', email: '', password: '', phone_number: '' }
      // Reset password visibility
      this.showEditPassword = false
      // Reset edit phone validation
      this.editPhoneError = ''
    },

    openDeleteModal(admin) {
      this.deleteAdminData = admin
      this.showDeleteModal = true
    },

    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleteAdminData = null
    },

    openCreateModal() {
      this.showCreateModal = true
    },

    closeCreateModal() {
      this.showCreateModal = false
      this.newAdmin = {
        fullname: '',
        email: '',
        phone_number: '',
        password: '',
        confirmPassword: '',
      }
      // Reset validation errors
      this.passwordError = ''
      this.confirmPasswordError = ''
      this.phoneError = ''
      // Reset password visibility
      this.showPassword = false
      this.showConfirmPassword = false
    },

    async createAdmin() {
      // Validate before submit - require at least 10 characters
      if (this.newAdmin.password.length < 10) {
        this.passwordError = 'Password harus mengandung minimal 10 karakter'
        return
      }

      if (this.newAdmin.password !== this.newAdmin.confirmPassword) {
        this.confirmPasswordError = 'Password tidak cocok'
        return
      }

      // Validate phone number length
      if (!this.newAdmin.phone_number || this.newAdmin.phone_number.length < 10) {
        this.phoneError = 'Nomor telepon harus terdiri dari minimal 10 digit'
        return
      }

      try {
        this.isLoading = true

        // Siapkan data admin yang akan dikirim
        const adminData = {
          fullname: this.newAdmin.fullname,
          email: this.newAdmin.email,
          phone_number: this.newAdmin.phone_number,
          password: this.newAdmin.password,
        }

        // Panggil fungsi createAdmin dari apiService
        const response = await apiService.createAdmin(adminData)

        if (response.data.status) {
          this.showToast('success', 'Akun admin berhasil dibuat!')
          this.closeCreateModal()
          this.fetchAdmins()
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat membuat admin'
        this.showToast('error', errorMessage)
      } finally {
        this.isLoading = false
      }
    },

    async updateAdmin() {
      try {
        // Get auth token
        const token = localStorage.getItem('authToken')

        if (!token) {
          this.showToast('warning', 'Anda harus login terlebih dahulu!')
          return
        }

        // Validate phone number length for edit
        if (!this.editAdmin.phone_number || this.editAdmin.phone_number.length < 10) {
          this.editPhoneError = 'Nomor telepon harus terdiri dari minimal 10 digit'
          return
        }

        // Create FormData untuk mengirim data
        const formData = new FormData()
        formData.append('email', this.editAdmin.email)
        formData.append('fullname', this.editAdmin.fullname)
        formData.append('phone_number', this.editAdmin.phone_number)

        // Hanya tambahkan password jika diisi
        if (this.editAdmin.password) {
          formData.append('password', this.editAdmin.password)
        }

        // edit admin menggunakan fungsi dari apiService.js
        const response = await apiService.updateAdmin(this.editAdmin.id, this.editAdmin, token)

        if (response.data.status) {
          // Update data admin di array
          const index = this.admins.findIndex((admin) => admin.id === this.editAdmin.id)
          if (index !== -1) {
            this.admins[index] = response.data.data
          }

          this.showToast('success', 'Admin berhasil diperbarui!')
          this.closeEditModal()
        } else {
          this.showToast('error', response.data.message || 'Gagal memperbarui admin')
        }
      } catch (error) {
        console.error('Error updating admin:', error)
        const errorMessage =
          error.response?.data?.message || 'Gagal memperbarui admin. Coba lagi nanti.'
        this.showToast('error', errorMessage)
      }
    },

    async deleteAdmin() {
      try {
        // Ambil token dari localStorage
        const token = localStorage.getItem('authToken')

        if (!token) {
          this.showToast('warning', 'Anda harus login terlebih dahulu!')
          return
        }

        // Set deleting state for animation
        this.deletingAdminId = this.deleteAdminData.id
        this.isDeletingAdmin = true

        // delete admin menggunakan fungsi dari apiService.js
        const response = await apiService.deleteAdmin(this.deleteAdminData.id, token)

        if (response.data.status) {
          // Wait for animation to complete before removing from array
          setTimeout(() => {
            // Sukses - perbarui state dan tutup modal
            this.admins = this.admins.filter((admin) => admin.id !== this.deleteAdminData.id)
            this.showToast('success', 'Admin berhasil dihapus!')
            this.closeDeleteModal()
            this.deletingAdminId = null
            this.isDeletingAdmin = false
          }, 500) // Match the animation duration
        } else {
          this.deletingAdminId = null
          this.isDeletingAdmin = false
          this.showToast('error', response.data.message || 'Gagal menghapus admin')
        }
      } catch (error) {
        console.error('Error deleting admin:', error)
        this.deletingAdminId = null
        this.isDeletingAdmin = false
        const errorMessage =
          error.response?.data?.message || 'Gagal menghapus admin. Coba lagi nanti.'
        this.showToast('error', errorMessage)
      }
    },
  },

  mounted() {
    this.fetchAdmins()
  },
}
</script>
