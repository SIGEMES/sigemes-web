<template>
  <div class="flex flex-wrap gap-4 mt-6">
    <div class="bg-blue-100 p-6 rounded-xl shadow-lg flex-1">
      <p class="text-gray-800">
        <span v-if="loading" class="skeleton-loader inline-block w-64 h-5 rounded"></span>
        <span v-else>
          Pendapatan <span class="font-bold">{{ currentDayText }}</span>
        </span>
      </p>
      <h2 class="revenue text-3xl text-black">
        <span v-if="loading" class="skeleton-loader inline-block w-48 h-9 rounded"></span>
        <span v-else class="font-black">{{ formatCurrency(daily) }}</span>
      </h2>
    </div>
    <div class="bg-blue-100 p-6 rounded-xl shadow-lg flex-1">
      <p class="text-gray-800">
        <span v-if="loading" class="skeleton-loader inline-block w-56 h-5 rounded"></span>
        <span v-else>
          Pendapatan bulan <span class="font-bold">{{ currentMonthText }}</span>
        </span>
      </p>
      <h2 class="revenue text-3xl text-black font-bold">
        <span v-if="loading" class="skeleton-loader inline-block w-48 h-9 rounded"></span>
        <span v-else class="font-black">{{ formatCurrency(monthly) }}</span>
      </h2>
    </div>
    <div class="bg-blue-100 p-6 rounded-xl shadow-lg flex-1">
      <p class="text-gray-800">
        <span v-if="loading" class="skeleton-loader inline-block w-52 h-5 rounded"></span>
        <span v-else>
          Total pendapatan tahun <span class="font-bold">{{ currentYear }}</span>
        </span>
      </p>
      <h2 class="revenue text-3xl text-black font-bold">
        <span v-if="loading" class="skeleton-loader inline-block w-48 h-9 rounded"></span>
        <span v-else class="font-black">{{ formatCurrency(annual) }}</span>
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RevenueStats',
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    daily: {
      type: Number,
      required: true,
    },
    monthly: {
      type: Number,
      required: true,
    },
    annual: {
      type: Number,
      required: true,
    },
    currentDayText: String,
    currentMonthText: String,
    currentYear: String,
  },
  methods: {
    // Pindahkan method formatCurrency ke sini
    formatCurrency(amount) {
      if (!amount && amount !== 0) return 'Rp0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount)
    },
  },
}
</script>

<style scoped>
.revenue {
  font-family: 'Poppins', sans-serif;
}

/* Skeleton loader animation */
.skeleton-loader {
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
