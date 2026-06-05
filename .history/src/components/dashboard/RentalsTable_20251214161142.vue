<template>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-blue-500 text-black">
          <th
            class="rent-column py-3 px-4 border border-gray-300 text-center font-bold w-16 text-white"
          >
            No
          </th>
          <th
            class="rent-column py-3 px-4 border border-gray-300 text-center font-bold w-32 text-white"
          >
            Penyewa
          </th>
          <th
            class="rent-column py-3 px-4 border border-gray-300 text-center font-bold w-40 text-white"
          >
            Jenis Sewa
          </th>
          <th
            class="rent-column py-3 px-4 border border-gray-300 text-center font-bold w-48 text-white"
          >
            Mulai Sewa
          </th>
          <th
            class="rent-column py-3 px-4 border border-gray-300 text-center font-bold w-48 text-white"
          >
            Selesai Sewa
          </th>
          <th
            class="rent-column py-3 px-4 border border-gray-300 text-center font-bold w-24 text-white"
          >
            Aksi
          </th>
        </tr>
      </thead>
      <tbody v-if="isLoading || errorMessage">
        <tr v-if="isLoading" class="bg-white">
          <td colspan="6" class="py-4 text-center border border-gray-300">
            <div class="loading-container">
              <span class="loading-text text-black">Memuat data...</span>
            </div>
          </td>
        </tr>
        <tr v-else-if="errorMessage" class="bg-white">
          <td colspan="6" class="py-4 text-center text-red-500 border border-gray-300">
            {{ errorMessage }}
          </td>
        </tr>
      </tbody>
      <transition-group v-else-if="showInitialAnimation" name="rental-row" tag="tbody">
        <tr
          v-for="(rental, index) in rentals"
          :key="rental.id"
          class="bg-white text-black border-b border-gray-200"
        >
          <td class="py-3 px-4 border border-gray-300 text-center rent-column">
            {{ getRowNumber(index) }}
          </td>
          <td class="py-3 px-4 border border-gray-300 rent-column">
            {{ rental.renterName || 'Memuat...' }}
          </td>
          <td class="py-3 px-4 border border-gray-300 rent-column">
            {{ getRentType(rental) }}
          </td>
          <td class="py-3 px-4 border border-gray-300 rent-column">
            {{ formatDate(rental.start_date) }}
          </td>
          <td class="py-3 px-4 border border-gray-300 rent-column">
            {{ formatDate(rental.end_date) }}
          </td>
          <td class="py-3 px-4 border border-gray-300 text-center rent-column">
            <button
              @click="handleDetailClick(rental.id)"
              class="text-blue-500 hover:text-blue-700 font-bold"
              :disabled="loadingDetailId === rental.id"
            >
              {{ loadingDetailId === rental.id ? 'Loading...' : 'Detail' }}
            </button>
          </td>
        </tr>
      </transition-group>
      <tbody v-else>
        <tr
          v-for="(rental, index) in rentals"
          :key="rental.id"
          class="bg-white text-black border-b border-gray-200"
        >
          <td class="py-3 px-4 border border-gray-300 text-center rent-column">
            {{ getRowNumber(index) }}
          </td>
          <td class="py-3 px-4 border border-gray-300 rent-column">
            {{ rental.renterName || 'Memuat...' }}
          </td>
          <td class="py-3 px-4 border border-gray-300 rent-column">
            {{ getRentType(rental) }}
          </td>
          <td class="py-3 px-4 border border-gray-300 rent-column">
            {{ formatDate(rental.start_date) }}
          </td>
          <td class="py-3 px-4 border border-gray-300 rent-column">
            {{ formatDate(rental.end_date) }}
          </td>
          <td class="py-3 px-4 border border-gray-300 text-center rent-column">
            <button
              @click="handleDetailClick(rental.id)"
              class="text-blue-500 hover:text-blue-700 font-bold"
              :disabled="loadingDetailId === rental.id"
            >
              {{ loadingDetailId === rental.id ? 'Loading...' : 'Detail' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'RentalsTable',
  props: {
    // Terima data yang sudah dipaginasi dari parent
    rentals: {
      type: Array,
      required: true,
    },
    isLoading: Boolean,
    errorMessage: String,
    currentPage: Number, // Dibutuhkan oleh getRowNumber
    itemsPerPage: Number, // Dibutuhkan oleh getRowNumber
    loadingDetailId: [String, Number, null], // Untuk status loading tombol Detail
    isFirstLoad: { // Flag dari parent untuk mengontrol animasi
      type: Boolean,
      default: false,
    },
  },
  // Komponen ini akan memberi tahu parent saat tombol Detail diklik
  emits: ['show-detail'],
  data() {
    return {
      showInitialAnimation: false, // Flag untuk mengontrol animasi awal
      hasAnimated: false, // Track apakah sudah pernah animasi
    }
  },
  mounted() {
    // Aktifkan animasi hanya saat pertama kali component di-mount
    if (this.rentals.length > 0) {
      this.showInitialAnimation = true
      // Setelah animasi selesai, matikan untuk interaksi selanjutnya
      setTimeout(() => {
        this.showInitialAnimation = false
        this.hasAnimated = true
      }, 600) // 600ms (durasi animasi 500ms + buffer 100ms)
    }
  },
  methods: {
    handleDetailClick(rentalId) {
      this.$emit('show-detail', rentalId)
    },
    // Pindahkan method yang HANYA berhubungan dengan TAMPILAN tabel
    formatDate(dateString) {
      if (!dateString) return ''
      const datePart = dateString.split('T')[0]
      const [year, month, day] = datePart.split('-')
      const monthIndex = parseInt(month) - 1
      return `${parseInt(day)} ${this.getMonthName(monthIndex)} ${year}`
    },
    getRentType(rental) {
      if (rental.guesthouse_room_pricing) return 'Gedung Mess'
      if (rental.city_hall_pricing) return 'Gedung Nasional'
      return 'Tidak Diketahui'
    },
    getRowNumber(index) {
      // Gunakan props currentPage dan itemsPerPage
      return (this.currentPage - 1) * this.itemsPerPage + index + 1
    },
    getMonthName(monthIndex) {
      const months = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ]
      return months[monthIndex]
    },
  },
}
</script>

<style scoped>
.rent-column {
  font-family: 'Poppins', sans-serif;
}

.loading-container {
  width: 100%;
  text-align: center;
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

/* Animasi untuk row rental saat muncul */
.rental-row-enter-active {
  transition: all 0.5s ease;
}

.rental-row-leave-active {
  transition: all 0.5s ease;
}

.rental-row-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.rental-row-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
