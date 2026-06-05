<template>
    <!-- Statistik Pendapatan -->
    <div class="flex flex-wrap gap-4 mt-6">
    <div class="bg-blue-100 p-6 rounded-xl shadow-lg flex-1">
        <p class="text-gray-800">
        <span
            v-if="loadingRevenue"
            class="skeleton-loader inline-block w-64 h-5 rounded"
        ></span>
        <span v-else
            >Pendapatan <span class="font-bold">{{ currentDayText }}</span></span
        >
        </p>
        <h2 class="revenue text-3xl text-black">
        <span
            v-if="loadingRevenue"
            class="skeleton-loader inline-block w-48 h-9 rounded"
        ></span>
        <span v-else class="font-black">{{ formatCurrency(dailyRevenue) }}</span>
        </h2>
    </div>
    <div class="bg-blue-100 p-6 rounded-xl shadow-lg flex-1">
        <p class="text-gray-800">
        <span
            v-if="loadingRevenue"
            class="skeleton-loader inline-block w-56 h-5 rounded"
        ></span>
        <span v-else
            >Pendapatan bulan <span class="font-bold">{{ currentMonthText }}</span></span
        >
        </p>
        <h2 class="revenue text-3xl text-black font-bold">
        <span
            v-if="loadingRevenue"
            class="skeleton-loader inline-block w-48 h-9 rounded"
        ></span>
        <span v-else class="font-black">{{ formatCurrency(monthlyRevenue) }}</span>
        </h2>
    </div>
    <div class="bg-blue-100 p-6 rounded-xl shadow-lg flex-1">
        <p class="text-gray-800">
        <span
            v-if="loadingRevenue"
            class="skeleton-loader inline-block w-52 h-5 rounded"
        ></span>
        <span v-else
            >Total pendapatan tahun <span class="font-bold">{{ currentYear }}</span></span
        >
        </p>
        <h2 class="revenue text-3xl text-black font-bold">
        <span
            v-if="loadingRevenue"
            class="skeleton-loader inline-block w-48 h-9 rounded"
        ></span>
        <span v-else class="font-black">{{ formatCurrency(annualRevenue) }}</span>
        </h2>
    </div>
    </div>
</template>