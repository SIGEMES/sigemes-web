<template>
  <div>
    <Navigation />
    <div class="container mt-6 mx-auto px-6 py-8">
      <transition name="welcome-fade">
        <h1 v-if="showWelcome" class="rent-column text-xl md:text-2xl font-black text-black mb-4">
          Selamat datang di SiGEMES,
          {{ fullname }}!
        </h1>
      </transition>

      <!-- Thin divider between welcome message and dashboard content -->
      <div class="w-full border-t border-gray-400 mt-2 mb-8"></div>

      <div class="flex justify-between items-center">
        <h2 id="dashboard-header" class="text-3xl font-black text-black">Dashboard</h2>
        <button
          @click="openExportModal"
          id="export-report-button"
          class="font-bold bg-blue-500 text-white px-5 py-2 text-sm rounded-lg hover:bg-blue-700"
        >
          Ekspor Laporan Keuangan
        </button>
      </div>

      <!-- Statistik Pendapatan diimport dari RevenueStats.vue -->
      <RevenueStats
        :loading="loadingRevenue"
        :daily="dailyRevenue"
        :monthly="monthlyRevenue"
        :annual="annualRevenue"
        :currentDayText="currentDayText"
        :currentMonthText="currentMonthText"
        :currentYear="currentYear"
      />

      <!-- Komponen Filter dan Tabel Penyewaan dalam 1 Card -->
      <div class="mt-6 bg-blue-100 p-6 rounded-xl shadow-xl">
        <!-- Filter Controls -->
        <RentalsFilterControls
          :rentals="rentals"
          :paginatedRentals="paginatedRentals"
          :isLoading="isLoading"
          :errorMessage="errorMessage"
          :currentPage="currentPage"
          :itemsPerPage="itemsPerPage"
          :totalPages="totalPages"
          :loadingDetailId="loadingDetailId"
          :appliedFilterAllDates="appliedFilterAllDates"
          :appliedFilterStartDate="appliedFilterStartDate"
          :appliedFilterEndDate="appliedFilterEndDate"
          :appliedFilterRentalType="appliedFilterRentalType"
          :appliedSelectedPaymentStatuses="appliedSelectedPaymentStatuses"
          @show-detail="handleShowDetail"
          @page-changed="handlePageChange"
          @open-jump-modal="openPageJumpModal"
          @filters-updated="handleFiltersUpdated"
          @open-filter-modal="openFilterModal"
        />

        <!-- Tampilan Filter Aktif (Active Filter Chips) -->
        <div v-if="activeFilters.length > 0" class="mt-4 mb-4">
          <div class="flex justify-center flex-wrap gap-2">
            <div
              v-for="filter in activeFilters"
              :key="filter.key"
              class="inline-flex items-center rent-column bg-blue-500 text-white pl-3 pr-1.5 py-1 rounded-full text-sm font-medium shadow-sm"
            >
              <span>{{ filter.label }}</span>
              <button
                type="button"
                @click.stop.prevent="removeActiveFilter(filter.key)"
                class="ml-2 text-white hover:bg-blue-600 font-bold text-base rounded-full w-5 h-5 flex items-center justify-center cursor-pointer transition-colors select-none line-height-none"
                style="line-height: 0;"
                title="Hapus filter"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Tabel Penyewaan -->
        <div class="mt-6">
          <RentalsTable
            :rentals="paginatedRentals"
            :isLoading="isLoading"
            :errorMessage="errorMessage"
            :currentPage="currentPage"
            :itemsPerPage="itemsPerPage"
            :loadingDetailId="loadingDetailId"
            @show-detail="handleShowDetail"
          />
        </div>

        <!-- Pagination dan Page Indicator -->
        <div class="mt-6 flex flex-col items-center">
          <!-- Pagination di tengah -->
          <CustomPagination
            :currentPage="currentPage"
            :totalPages="totalPages"
            :visiblePages="visiblePages"
            @page-changed="handlePageChange"
            @open-jump-modal="openPageJumpModal"
          />

          <!-- Indikator Halaman -->
          <div class="text-center mt-4 mb-2" v-if="!isLoading && !errorMessage && totalPages > 1">
            <span class="text-black text-sm">
              Menampilkan halaman <span class="font-bold">{{ currentPage }}</span> dari total
              <span class="font-bold">{{ totalPages }}</span> halaman
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Filter -->
    <transition name="modal">
      <div
        v-if="showFilterModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="closeFilterModal"
      >
        <div
          class="bg-blue-100 rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden"
          @click.stop
        >
          <h2 class="rent-column text-2xl font-bold text-black text-center mb-6 p-6 pb-0">
            Filter Berdasarkan
          </h2>

          <div class="relative z-50 px-6 pb-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            <!-- Rentang Tanggal -->
            <div class="mb-4">
              <h3 class="rent-column font-bold text-black mb-3">Rentang Tanggal</h3>

              <!-- Checkbox Semua Tanggal -->
              <div class="mb-3">
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="filterAllDates"
                    @change="handleAllDatesToggle"
                    type="checkbox"
                    class="mr-2"
                  />
                  <span class="text-black rent-column font-medium">Semua Tanggal</span>
                </label>
              </div>

              <!-- Pemilih Rentang Tanggal - Selalu terlihat, tetapi dinonaktifkan ketika "Semua Tanggal" dicentang -->
              <div class="mb-3">
                <VueDatePicker
                  v-model="dateRange"
                  range
                  :enable-time-picker="false"
                  :format="'dd/MM/yyyy'"
                  placeholder="Pilih rentang tanggal"
                  :clearable="true"
                  auto-apply
                  @update:model-value="handleDateRangeChange"
                  :disabled="filterAllDates"
                  :class="{ 'opacity-50 cursor-not-allowed': filterAllDates }"
                  class="w-full"
                />
              </div>

              <!-- Petunjuk -->
              <div
                v-if="filterAllDates"
                class="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <p class="text-sm rent-column text-yellow-800 font-medium">
                  Kosongi ceklis 'Semua Tanggal' untuk memilih rentang tanggal tertentu.
                </p>
              </div>

              <!-- Pesan Error Validasi Rentang Tanggal -->
              <div v-if="dateRangeValidationError" class="mb-3">
                <p class="text-red-500 rent-column text-sm font-bold">
                  {{ dateRangeValidationError }}
                </p>
              </div>
            </div>

            <!-- Jenis Sewa -->
            <div class="mb-4">
              <h3 class="rent-column font-bold text-black mb-3">Jenis Sewa</h3>
              <div class="relative">
                <div
                  class="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2.5 cursor-pointer hover:border-blue-400 transition-colors"
                  @click="toggleRentalTypeDropdown"
                >
                  <span class="text-gray-600 text-sm flex-1">{{ getRentalTypeLabel() }}</span>
                  <svg
                    class="w-4 h-4 text-gray-500 transition-transform"
                    :class="{ 'rotate-180': showRentalTypeDropdown }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                <!-- Menu Dropdown Jenis Sewa -->
                <div
                  v-if="showRentalTypeDropdown"
                  class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10"
                >
                  <div class="py-1">
                    <div
                      v-for="option in rentalTypeOptions"
                      :key="option.value"
                      @click="selectRentalType(option.value)"
                      class="px-3 py-2 text-sm text-black hover:bg-blue-50 cursor-pointer"
                      :class="{ 'bg-blue-100 font-medium': filterRentalType === option.value }"
                    >
                      {{ option.label }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Status Pembayaran - Diperbarui dengan logika "Semua" -->
            <div class="mb-4">
              <h3 class="rent-column font-bold text-black mb-3">Status Pembayaran</h3>
              <div class="space-y-2">
                <!-- Checkbox Semua -->
                <label
                  class="flex items-center rent-column cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    v-model="filterAllPaymentStatuses"
                    @change="handleAllPaymentStatusToggle"
                    class="mr-2"
                  />
                  <span class="text-black text-sm font-medium">Semua</span>
                </label>

                <!-- Checkbox Status Individual -->
                <label
                  v-for="option in paymentStatusOptionsForCheckbox"
                  :key="option.value"
                  class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                  :class="{ 'opacity-50 cursor-not-allowed': filterAllPaymentStatuses }"
                >
                  <input
                    type="checkbox"
                    v-model="selectedPaymentStatuses"
                    :value="option.value"
                    :disabled="filterAllPaymentStatuses"
                    @change="handleIndividualPaymentStatusChange"
                    class="mr-2"
                  />
                  <span
                    class="text-black rent-column text-sm"
                    :class="{ 'text-gray-400': filterAllPaymentStatuses }"
                    >{{ option.label }}</span
                  >
                </label>

                <div
                  v-if="filterAllPaymentStatuses"
                  class="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <p class="text-sm rent-column text-yellow-800 font-medium">
                    Kosongi ceklis 'Semua' untuk memilih status pembayaran tertentu.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tombol Aksi -->
          <div class="flex justify-center gap-4 p-6 pt-0">
            <button
              @click="applyFilters"
              class="rent-column bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Simpan
            </button>
            <button
              @click="closeFilterModal"
              class="rent-column bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Detail Penyewaan -->
    <transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="closeModal"
      >
        <div
          class="bg-gray-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
          @click.stop
        >
          <!-- Header Modal -->
          <div class="relative flex justify-center items-center p-4 border-b border-gray-300">
            <h1 class="rent-column text-xl font-bold text-black">Detail Penyewaan</h1>
            <button
              @click="closeModal"
              class="absolute right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <!-- Konten Modal - Dapat Discroll -->
          <div class="overflow-y-auto p-4" style="max-height: calc(90vh - 80px)">
            <!-- Loading State -->
            <div v-if="!rentalDetail" class="flex justify-center items-center py-8">
              <span class="loading-text text-black text-lg">Memuat data...</span>
            </div>

            <!-- Konten Detail -->
            <div v-if="rentalDetail" class="space-y-3">
              <!-- Informasi Dasar -->
              <div class="space-y-3">
                <!-- No. Invoice -->
                <div class="flex">
                  <span class="text-gray-600 w-48 text-sm">No. Invoice</span>
                  <span class="text-gray-600 w-4 text-sm">:</span>
                  <span class="font-medium text-black flex-1 text-sm">{{
                    rentalDetail.payment?.id || '-'
                  }}</span>
                </div>

                <!-- Jenis Sewa -->
                <div class="flex">
                  <span class="text-gray-600 w-48 text-sm">Jenis Sewa</span>
                  <span class="text-gray-600 w-4 text-sm">:</span>
                  <span class="font-medium text-black flex-1 text-sm">{{
                    getRentalType(rentalDetail)
                  }}</span>
                </div>

                <!-- Nama Ruang & Tipe Ruang (Hanya untuk Gedung Mess) -->
                <template v-if="rentalDetail.guesthouse_room_pricing">
                  <!-- Nama Ruang -->
                  <div class="flex" v-if="getRoomName(rentalDetail)">
                    <span class="text-gray-600 w-48 text-sm">Nama Ruang</span>
                    <span class="text-gray-600 w-4 text-sm">:</span>
                    <span class="font-medium text-black flex-1 text-sm">{{
                      getRoomName(rentalDetail)
                    }}</span>
                  </div>

                  <!-- Tipe Ruang -->
                  <div class="flex" v-if="getRoomType(rentalDetail)">
                    <span class="text-gray-600 w-48 text-sm">Tipe Ruang</span>
                    <span class="text-gray-600 w-4 text-sm">:</span>
                    <span class="font-medium text-black flex-1 text-sm flex items-center">
                      <!-- Tipe VIP - Hanya Ikon -->
                      <img
                        v-if="getRoomType(rentalDetail).toLowerCase() === 'vip'"
                        src="@/assets/vipclass.png"
                        alt="VIP"
                        class="h-5 w-auto object-contain"
                      />
                      <!-- Tipe Standard - Hanya Ikon -->
                      <img
                        v-else-if="getRoomType(rentalDetail).toLowerCase() === 'standard'"
                        src="@/assets/standardclass.png"
                        alt="Standard"
                        class="h-5 w-auto object-contain"
                      />
                      <!-- Tipe Lainnya - Hanya Teks -->
                      <span v-else class="text-sm">{{
                        formatRoomTypeDisplay(getRoomType(rentalDetail))
                      }}</span>
                    </span>
                  </div>
                </template>

                <!-- Nama Penyewa -->
                <div class="flex">
                  <span class="text-gray-600 w-48 text-sm">Nama Penyewa</span>
                  <span class="text-gray-600 w-4 text-sm">:</span>
                  <span class="font-medium text-black flex-1 text-sm">{{
                    rentalDetail.renter?.fullname || '-'
                  }}</span>
                </div>

                <!-- Email -->
                <div class="flex">
                  <span class="text-gray-600 w-48 text-sm">Email</span>
                  <span class="text-gray-600 w-4 text-sm">:</span>
                  <span class="font-medium text-black flex-1 text-sm">{{
                    rentalDetail.renter?.email || '-'
                  }}</span>
                </div>

                <!-- Jenis Kelamin -->
                <div class="flex">
                  <span class="text-gray-600 w-48 text-sm">Jenis Kelamin</span>
                  <span class="text-gray-600 w-4 text-sm">:</span>
                  <span class="font-medium text-black flex-1 text-sm">{{
                    translateGender(rentalDetail.renter?.gender)
                  }}</span>
                </div>

                <!-- Slot yang Dipakai -->
                <div class="flex">
                  <span class="text-gray-600 w-48 text-sm">Slot yang Dipakai</span>
                  <span class="text-gray-600 w-4 text-sm">:</span>
                  <span class="font-medium text-black flex-1 text-sm">{{
                    rentalDetail.slot || '-'
                  }}</span>
                </div>

                <!-- Field bersyarat berdasarkan jenis sewa -->
                <div class="flex" v-if="rentalDetail.guesthouse_room_pricing">
                  <span class="text-gray-600 w-48 text-sm">Jenis Retribusi</span>
                  <span class="text-gray-600 w-4 text-sm">:</span>
                  <span class="font-medium text-black flex-1 text-sm">{{
                    rentalDetail.guesthouse_room_pricing.retribution_type || '-'
                  }}</span>
                </div>
                <div class="flex" v-if="rentalDetail.city_hall_pricing">
                  <span class="text-gray-600 w-48 text-sm">Tipe Sewa</span>
                  <span class="text-gray-600 w-4 text-sm">:</span>
                  <span class="font-medium text-black flex-1 text-sm">{{
                    rentalDetail.city_hall_pricing.activity_type || '-'
                  }}</span>
                </div>
                <div class="flex">
                  <span class="text-gray-600 w-48 text-sm">Tanggal Pesanan Dibuat</span>
                  <span class="text-gray-600 w-4 text-sm">:</span>
                  <span class="font-medium text-black flex-1 text-sm">{{
                    formatDateTime(rentalDetail.created_at)
                  }}</span>
                </div>
                <div class="flex">
                  <span class="text-gray-600 w-48 text-sm">Tanggal Pesanan Diperbarui</span>
                  <span class="text-gray-600 w-4 text-sm">:</span>
                  <span class="font-medium text-black flex-1 text-sm">{{
                    formatDateTime(rentalDetail.updated_at)
                  }}</span>
                </div>
                <div class="flex">
                  <span class="text-gray-600 w-48 text-sm">Waktu Tanggal Sewa</span>
                  <span class="text-gray-600 w-4 text-sm">:</span>
                  <span class="font-medium text-black flex-1 text-sm">{{
                    formatDateTime(rentalDetail.start_date)
                  }}</span>
                </div>
                <div class="flex">
                  <span class="text-gray-600 w-48 text-sm">Tanggal Selesai Sewa</span>
                  <span class="text-gray-600 w-4 text-sm">:</span>
                  <span class="font-medium text-black flex-1 text-sm">{{
                    formatDateTime(rentalDetail.end_date)
                  }}</span>
                </div>
              </div>

              <!-- Bagian Detail Pembayaran dalam Kotak Putih -->
              <div class="mt-6 bg-white rounded-lg p-4 shadow-sm">
                <h3 class="text-lg font-bold text-black mb-4 text-center">Rincian Pembayaran</h3>
                <div class="space-y-3">
                  <div class="flex">
                    <span class="text-gray-600 w-48 text-sm">Metode Pembayaran</span>
                    <span class="font-medium text-black flex-1 text-right text-sm">{{
                      translatePaymentMethod(rentalDetail.payment?.method)
                    }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-600 w-48 text-sm">Status Pembayaran</span>
                    <span class="font-medium text-black flex-1 text-right text-sm">{{
                      translatePaymentStatus(rentalDetail.payment?.status)
                    }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-600 w-48 text-sm">Waktu Pembayaran Dibuat</span>
                    <span class="font-medium text-black flex-1 text-right text-sm">{{
                      formatDateTime(rentalDetail.payment?.payment_triggered_at)
                    }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-600 w-48 text-sm">Waktu Pembayaran Dikonfirmasi</span>
                    <span class="font-medium text-black flex-1 text-right text-sm">{{
                      formatDateTime(rentalDetail.payment?.payment_confirmed_at)
                    }}</span>
                  </div>
                  <div class="flex pt-3 border-t border-gray-300">
                    <span class="text-base font-bold text-black w-48">Total Jumlah Dibayar</span>
                    <span class="text-base font-bold text-black flex-1 text-right">{{
                      formatCurrency(rentalDetail.payment?.amount)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Export Laporan Keuangan -->
    <transition name="modal">
      <div
        v-if="showExportModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="closeExportModal"
      >
        <div class="bg-blue-100 rounded-lg max-w-2xl w-full p-6" @click.stop>
          <!-- Header Modal -->
          <h2 class="rent-column text-2xl font-bold text-black text-center mb-6">
            Ekspor Laporan Keuangan
          </h2>

          <!-- Pemilihan Jenis Gedung -->
          <div class="grid grid-cols-2 gap-6 mb-6">
            <!-- Gedung Nasional -->
            <div>
              <h3 class="rent-column font-bold text-black mb-3">Gedung Nasional</h3>
              <div v-if="loadingCityHalls" class="text-gray-500">
                <span class="loading-text">Memuat data gedung...</span>
              </div>
              <div v-else-if="cityHallsList.length === 0" class="text-gray-500">
                Tidak ada data gedung nasional
              </div>
              <div
                v-else
                class="space-y-2 max-h-40 overflow-y-auto border border-gray-400 rounded-lg p-3"
              >
                <label
                  v-for="hall in cityHallsList"
                  :key="hall.id"
                  class="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    v-model="selectedCityHalls"
                    :value="hall.id"
                    class="mr-2"
                  />
                  <span class="rent-column text-sm text-gray-900">{{ hall.name }}</span>
                </label>
              </div>
            </div>

            <!-- Gedung Mess -->
            <div>
              <h3 class="rent-column font-bold text-black mb-3">Gedung Mess</h3>
              <div v-if="loadingGuesthouses" class="text-gray-500">
                <span class="loading-text">Memuat data gedung...</span>
              </div>
              <div v-else-if="guesthousesList.length === 0" class="rent-column text-gray-500">
                Tidak ada data gedung mess
              </div>
              <div
                v-else
                class="space-y-2 max-h-40 overflow-y-auto border border-gray-400 rounded-lg p-3"
              >
                <label
                  v-for="guesthouse in guesthousesList"
                  :key="guesthouse.id"
                  class="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    v-model="selectedGuesthouses"
                    :value="guesthouse.id"
                    class="mr-2"
                  />
                  <span class="rent-column text-sm text-gray-900">{{ guesthouse.name }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Pemilihan Bulan dan Tahun -->
          <div class="mb-6">
            <h3 class="rent-column font-bold text-black mb-3">
              Pilih keuangan bulanan yang akan diekspor
            </h3>
            <div class="flex items-center space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <input
                type="month"
                v-model="exportMonth"
                class="text-black flex-1 p-3 border border-gray-300 rounded-lg"
                :max="currentYearMonth"
              />
            </div>
          </div>

          <!-- Tombol Aksi -->
          <div class="flex justify-center space-x-4">
            <button
              @click="exportToExcel"
              :disabled="
                (!selectedCityHalls.length && !selectedGuesthouses.length) ||
                !exportMonth ||
                isExporting
              "
              class="rent-column bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
            >
              <svg
                v-if="!isExporting"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <svg
                v-else
                class="animate-spin h-5 w-5 mr-2"
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
              {{ isExporting ? 'Mengekspor...' : 'Ekspor ke Excel' }}
            </button>
            <button
              @click="closeExportModal"
              class="rent-column bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Jump to Page -->
    <transition name="modal">
      <div
        v-if="showPageJumpModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="closePageJumpModal"
      >
        <div class="bg-blue-100 rounded-lg max-w-md w-1/4.5 p-6" @click.stop>
          <h2 class="rent-column text-2xl font-bold text-black text-center mb-6">Pilih Halaman</h2>

          <div class="mb-6">
            <label class="rent-column font-semibold text-black block mb-3">
              Masukkan nomor halaman (1 - {{ totalPages }})
            </label>
            <input
              v-model.number="pageJumpInput"
              type="number"
              :min="1"
              :max="totalPages"
              :class="[
                'w-full p-3 border-2 rounded-lg text-black text-center text-lg font-semibold focus:outline-none transition-colors',
                pageJumpError
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-300 focus:border-blue-500',
              ]"
              @keyup.enter="jumpToPage"
              @input="validatePageInput"
              placeholder="Nomor halaman"
            />
            <!-- Error message -->
            <transition name="fade">
              <p v-if="pageJumpError" class="text-red-600 text-sm font-semibold mt-2 text-center">
                {{ pageJumpError }}
              </p>
            </transition>
          </div>

          <div class="flex justify-center space-x-4">
            <button
              @click="jumpToPage"
              class="rent-column bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Pergi ke Halaman
            </button>
            <button
              @click="closePageJumpModal"
              class="rent-column bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import axios from 'axios';
import apiService from '@/services/apiService'
import Navigation from '@/components/Navigation.vue'
import RevenueStats from '@/components/dashboard/RevenueStats.vue'
import RentalsTable from '@/components/dashboard/RentalsTable.vue'
import CustomPagination from '@/components/dashboard/CustomPagination.vue'
import ExcelJS from 'exceljs'

// Import Vue Datepicker
import VueDatePicker from '@vuepic/vue-datepicker'
import RentalsFilterControls from '@/components/dashboard/RentalsFilterControls.vue'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  name: 'DashboardView',
  components: {
    Navigation,
    VueDatePicker,
    RevenueStats,
    RentalsTable,
    CustomPagination,
    RentalsFilterControls,
  },
  inject: ['showToast'],
  data() {
    return {
      rentals: [],
      allRentals: [],
      isLoading: false,
      errorMessage: '',

      // New dropdown states
      showSortDropdown: false,
      showItemsDropdown: false,

      // dropdown states for filter modal
      showPaymentStatusDropdown: false,
      showRoomTypeDropdown: false,
      showRetributionDropdown: false,
      showActivityTypeDropdown: false,
      showRentalTypeDropdown: false, // Tambahan untuk dropdown jenis sewa

      // Items per page options
      itemsOptions: [10, 15, 20],

      // Filter modal properties (what's being set in the modal)
      showFilterModal: false,
      searchQuery: '',
      sortBy: 'newest',
      filterStartDate: '',
      filterEndDate: '',
      filterRoomType: '',
      filterRetribution: '',
      filterActivityType: '',
      filterRentalType: '', // Tambahan untuk filter jenis sewa
      filterAllDates: true,
      dateRange: null,
      dateRangeValidationError: '',
      filterAllPaymentStatuses: true,
      selectedPaymentStatuses: [],
      appliedFilterAllDates: true,
      appliedFilterStartDate: '',
      appliedFilterEndDate: '',
      appliedFilterRentalType: '',
      appliedSelectedPaymentStatuses: [],
      rentalTypeOptions: [
        { value: '', label: 'Semua' },
        { value: 'guesthouse', label: 'Gedung Mess' },
        { value: 'city_hall', label: 'Gedung Nasional' },
      ],
      paymentStatusOptionsForCheckbox: [
        { value: 'pending', label: 'Pending' },
        { value: 'gagal', label: 'Gagal' },
        { value: 'dibayar', label: 'Dibayar' },
      ],

      // Date picker options
      useVueDatepicker: true, // Toggle between Vue Datepicker and native inputs

      // Existing properties
      currentPage: 1,
      itemsPerPage: 10,
      totalData: 0,
      totalPages: 0,
      showModal: false,
      rentalDetail: null,
      loadingDetailId: null,
      showWelcome: false,
      showPageJumpModal: false,
      pageJumpInput: null,
      pageJumpError: '', // Error message untuk validasi page jump
      fullname: '',
      // Revenue data
      dailyRevenue: 0,
      monthlyRevenue: 0,
      annualRevenue: 0,
      loadingRevenue: true,
      currentDayText: '',
      currentMonthText: '',
      currentYear: '',
      rentals: [],
      allRentals: [],
      // Export modal data
      showExportModal: false,
      cityHallsList: [],
      guesthousesList: [],
      selectedCityHalls: [],
      selectedGuesthouses: [],
      exportMonth: '',
      loadingCityHalls: false,
      loadingGuesthouses: false,
      isExporting: false,
      currentYearMonth: '',
    }
  },
  computed: {
    visiblePages() {
      const pages = []
      const total = this.totalPages
      const current = this.currentPage

      if (total <= 7) {
        // Show all pages if total is 7 or less
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        // Always show 5 pages including current page
        let pagesToShow = []

        // If current page is in the first 5 pages
        if (current <= 5) {
          for (let i = 1; i <= 5; i++) {
            pagesToShow.push(i)
          }
          // Add dots if there are more pages
          if (total > 5) {
            pagesToShow.push('...')
          }
        }
        // If current page is in the last 5 pages
        else if (current > total - 5) {
          // Add dots at the beginning
          pagesToShow.push('...')
          for (let i = total - 4; i <= total; i++) {
            pagesToShow.push(i)
          }
        }
        // Current page is in the middle
        else {
          // Add dots at the beginning
          pagesToShow.push('...')
          // Show current page and 2 pages before and after
          for (let i = current - 2; i <= current + 2; i++) {
            pagesToShow.push(i)
          }
          // Add dots at the end
          pagesToShow.push('...')
        }

        return pagesToShow
      }

      return pages
    },

    // Add computed property for paginated rentals
    paginatedRentals() {
      // Data sudah dipaginasi oleh backend, langsung kembalikan rentals
      // return this.rentals;
      return this.applyClientSideFilters(this.rentals);
    },

    // Computed property untuk active filters
    activeFilters() {
      const filters = []

      // Date range filter
      if (!this.appliedFilterAllDates && this.appliedFilterStartDate && this.appliedFilterEndDate) {
        const startDate = this.formatDateIndicator(this.appliedFilterStartDate)
        const endDate = this.formatDateIndicator(this.appliedFilterEndDate)
        filters.push({
          key: 'dateRange',
          label: `${startDate} - ${endDate}`,
        })
      }

      // Rental type filter
      if (this.appliedFilterRentalType) {
        const rentalTypeLabel = this.getRentalTypeLabel()
        if (rentalTypeLabel !== 'Semua') {
          filters.push({
            key: 'rentalType',
            label: rentalTypeLabel,
          })
        }
      }

      // Payment status filter
      if (this.appliedSelectedPaymentStatuses.length > 0) {
        const statusLabels = this.appliedSelectedPaymentStatuses.map((status) => {
          const option = this.paymentStatusOptionsForCheckbox.find((opt) => opt.value === status)
          return option ? option.label : status
        })

        if (statusLabels.length === 1) {
          filters.push({
            key: 'paymentStatus',
            label: `Status Pembayaran: ${statusLabels[0]}`,
          })
        } else {
          filters.push({
            key: 'paymentStatus',
            label: `Status Pembayaran: ${statusLabels.join(', ')}`,
          })
        }
      }

      return filters
    },
  },
  methods: {
    // Handler untuk menerima filter updates dari RentalsFilterControls
    handleFiltersUpdated(filters) {
      console.log('Filters updated:', filters)

      // Update state dari filter yang diterima
      this.searchQuery = filters.search || ''
      this.sortBy = filters.sort || 'newest'
      this.itemsPerPage = filters.limit || 10

      // Update filter tanggal
      this.appliedFilterAllDates = filters.allDates
      this.appliedFilterStartDate = filters.startDate || ''
      this.appliedFilterEndDate = filters.endDate || ''

      // Update filter tipe rental
      this.appliedFilterRentalType = filters.rentalType || ''

      // Update filter status pembayaran
      this.appliedSelectedPaymentStatuses = filters.paymentStatus || []

      // Reset ke halaman 1 dan fetch data baru
      this.currentPage = 1
      this.fetchRentals()
    },

    applyFilters() {
      this.dateRangeValidationError = ''

      if (!this.filterAllDates) {
        if (this.useVueDatepicker) {
          if (!this.dateRange || this.dateRange.length !== 2) {
            this.dateRangeValidationError =
              'Mohon pilih rentang tanggal atau centang "Semua Tanggal"'
            return
          }
        } else if (!this.filterStartDate || !this.filterEndDate) {
          this.dateRangeValidationError = 'Mohon pilih rentang tanggal atau centang "Semua Tanggal"'
          return
        }
      } else {
        this.filterStartDate = ''
        this.filterEndDate = ''
      }

      this.appliedFilterAllDates = this.filterAllDates
      this.appliedFilterStartDate = this.filterAllDates ? '' : this.filterStartDate
      this.appliedFilterEndDate = this.filterAllDates ? '' : this.filterEndDate
      this.appliedFilterRentalType = this.filterRentalType
      this.appliedSelectedPaymentStatuses = this.filterAllPaymentStatuses
        ? []
        : [...this.selectedPaymentStatuses]

      this.currentPage = 1
      this.fetchRentals()
      this.closeFilterModal()
    },

    // NEW METHODS FOR RENTAL TYPE AND ROOM DETAILS
    /**
     * Get rental type (Jenis Sewa)
     * @param {Object} rental - The rental detail object
     * @returns {String} - The rental type
     */
    getRentalType(rental) {
      if (rental.guesthouse_room_pricing) {
        return 'Gedung Mess'
      } else if (rental.city_hall_pricing) {
        return 'Gedung Nasional'
      }
      return 'Tidak Diketahui'
    },

    /**
     * Get room name for guesthouse rentals
     * @param {Object} rental - The rental detail object
     * @returns {String|null} - The room name or null
     */
    getRoomName(rental) {
      if (rental.guesthouse_room_pricing?.guesthouse_room?.name) {
        return rental.guesthouse_room_pricing.guesthouse_room.name
      }
      return null
    },

    /**
     * Get room type for guesthouse rentals
     * @param {Object} rental - The rental detail object
     * @returns {String|null} - The room type or null
     */
    getRoomType(rental) {
      if (rental.guesthouse_room_pricing?.guesthouse_room?.type) {
        return rental.guesthouse_room_pricing.guesthouse_room.type
      }
      return null
    },

    /**
     * Format room type for display
     * @param {String} type - The room type
     * @returns {String} - Formatted room type
     */
    formatRoomTypeDisplay(type) {
      if (!type) return ''

      const typeMap = {
        vip: 'VIP',
        standard: 'Standard',
      }

      return typeMap[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1)
    },

    // Client-side filtering method
    applyClientSideFilters(data) {
      let filtered = [...data]

      // Filter by payment status - use applied values
      const paymentStatusFilters = this.appliedSelectedPaymentStatuses || []
      if (paymentStatusFilters.length > 0) {
        filtered = filtered.filter((rental) => {
          const status = rental.payment?.status
          return paymentStatusFilters.includes(status)
        })
      }

      // Filter by rental type - use applied values
      if (this.appliedFilterRentalType) {
        filtered = filtered.filter((rental) => {
          if (this.appliedFilterRentalType === 'guesthouse') {
            return !!rental.guesthouse_room_pricing
          } else if (this.appliedFilterRentalType === 'city_hall') {
            return !!rental.city_hall_pricing
          }
          return true
        })
      }

      // TAMBAHKAN SORTING CLIENT-SIDE
      filtered = this.applySorting(filtered)

      return filtered
    },

    applySorting(data) {
      const sortedData = [...data]

      switch (this.sortBy) {
        case 'newest':
          return sortedData.sort((a, b) => {
            const dateA = new Date(a.created_at)
            const dateB = new Date(b.created_at)
            return dateB - dateA // Terbaru dulu (descending)
          })

        case 'oldest':
          return sortedData.sort((a, b) => {
            const dateA = new Date(a.created_at)
            const dateB = new Date(b.created_at)
            return dateA - dateB // Terlama dulu (ascending)
          })

        case 'name':
          return sortedData.sort((a, b) => {
            const nameA = (a.renterName || a.renter?.fullname || '').toLowerCase()
            const nameB = (b.renterName || b.renter?.fullname || '').toLowerCase()
            return nameA.localeCompare(nameB, 'id', { numeric: true }) // Urut abjad A-Z
          })

        default:
          return sortedData
      }
    },

    openFilterModal() {
      // Sinkronisasi nilai filter modal (temp) dengan filter yang sedang aktif diterapkan (applied)
      this.filterAllDates = this.appliedFilterAllDates;
      this.filterStartDate = this.appliedFilterStartDate;
      this.filterEndDate = this.appliedFilterEndDate;
      this.filterRentalType = this.appliedFilterRentalType;

      // Sinkronisasi checkbox status pembayaran
      if (this.appliedSelectedPaymentStatuses.length === 0) {
        this.filterAllPaymentStatuses = true;
        this.selectedPaymentStatuses = [];
      } else {
        this.filterAllPaymentStatuses = false;
        this.selectedPaymentStatuses = [...this.appliedSelectedPaymentStatuses];
      }

      // Sinkronisasi range komponen DatePicker jika ada
      if (!this.appliedFilterAllDates && this.appliedFilterStartDate && this.appliedFilterEndDate) {
        this.dateRange = [
          new Date(this.appliedFilterStartDate),
          new Date(this.appliedFilterEndDate),
        ];
      } else {
        this.dateRange = null;
      }

      // Tampilkan modal
      this.showFilterModal = true;
    },

    closeFilterModal() {
      this.showFilterModal = false
      this.showRentalTypeDropdown = false
      this.dateRangeValidationError = ''
    },

    // Method untuk remove active filter chip
    removeActiveFilter(filterKey) {
      console.log('Menghapus filter dengan key:', filterKey);

      switch (filterKey) {
        case 'dateRange':
          this.appliedFilterAllDates = true
          this.appliedFilterStartDate = ''
          this.appliedFilterEndDate = ''
          // Also reset modal values
          this.filterAllDates = true
          this.filterStartDate = ''
          this.filterEndDate = ''
          this.dateRange = null
          break

        case 'rentalType':
          this.appliedFilterRentalType = ''
          // Also reset modal values
          this.filterRentalType = ''
          break

        case 'paymentStatus':
          this.appliedSelectedPaymentStatuses = []
          // Also reset modal values
          this.selectedPaymentStatuses = []
          this.filterAllPaymentStatuses = true
          break
      }

      // Reset ke halaman 1 dan fetch data baru
      this.currentPage = 1
      this.fetchRentals()
    },

    // Method untuk format tanggal untuk display filter
    formatDateIndicator(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const day = date.getDate()
      const month = this.getMonthName(date.getMonth())
      const year = date.getFullYear()
      return `${day} ${month} ${year}`
    },

    handleAllDatesToggle() {
      if (this.filterAllDates) {
        this.filterStartDate = ''
        this.filterEndDate = ''
        this.dateRange = null
        this.dateRangeValidationError = ''
      }
    },

    handleDateRangeChange(range) {
      if (range && range.length === 2) {
        this.filterStartDate = range[0].toISOString().split('T')[0]
        this.filterEndDate = range[1].toISOString().split('T')[0]
        this.dateRangeValidationError = ''
      } else {
        this.filterStartDate = ''
        this.filterEndDate = ''
      }
    },

    toggleRentalTypeDropdown() {
      this.showRentalTypeDropdown = !this.showRentalTypeDropdown
    },

    selectRentalType(value) {
      this.filterRentalType = value
      this.showRentalTypeDropdown = false
      this.handleRentalTypeChange()
    },

    getRentalTypeLabel() {
      const option = this.rentalTypeOptions.find((opt) => opt.value === this.filterRentalType)
      return option ? option.label : 'Semua'
    },

    handleAllPaymentStatusToggle() {
      if (this.filterAllPaymentStatuses) {
        this.selectedPaymentStatuses = []
      }
    },

    handleIndividualPaymentStatusChange() {
      const allOptions = this.paymentStatusOptionsForCheckbox.map((option) => option.value)
      const allSelected = allOptions.every((option) =>
        this.selectedPaymentStatuses.includes(option),
      )

      if (allSelected) {
        this.filterAllPaymentStatuses = true
        this.selectedPaymentStatuses = []
      } else if (this.selectedPaymentStatuses.length > 0) {
        this.filterAllPaymentStatuses = false
      } else {
        this.filterAllPaymentStatuses = true
      }
    },

    handlePageChange(newPage) {
      // Panggil method asli yang mengurus logika pindah halaman
      this.goToPage(newPage)
    },

    toggleDatepickerType() {
      this.useVueDatepicker = !this.useVueDatepicker

      if (this.useVueDatepicker) {
        // Convert from separate dates to range format
        if (this.filterStartDate && this.filterEndDate) {
          this.dateRange = [new Date(this.filterStartDate), new Date(this.filterEndDate)]
        }
      } else {
        // Convert from range format to separate dates
        if (this.dateRange && this.dateRange.length === 2) {
          this.filterStartDate = this.dateRange[0].toISOString().split('T')[0]
          this.filterEndDate = this.dateRange[1].toISOString().split('T')[0]
        }
      }
    },

    openCalendarPicker() {
      // Legacy method - now handled by toggleDatepickerType
      this.toggleDatepickerType()
    },

    handleRentalTypeChange() {
      // Reset conditional filters when rental type changes
      this.filterRoomType = ''
      this.filterRetribution = ''
      this.filterActivityType = ''
    },

    formatDateTime(dateString) {
      if (!dateString) return '-'

      const date = new Date(dateString)
      const day = date.getDate()
      const month = this.getMonthName(date.getMonth())
      const year = date.getFullYear()
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')

      return `${day} ${month} ${year}, ${hours}.${minutes}`
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
    getDayName(dayIndex) {
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
      return days[dayIndex]
    },
    translateStatus(status) {
      const statusMap = {
        pending: 'Menunggu',
        confirmed: 'Dikonfirmasi',
        dikonfirmasi: 'Dikonfirmasi',
        selesai: 'Selesai',
        dibatalkan: 'Dibatalkan',
        cancelled: 'Dibatalkan',
      }
      return statusMap[status.toLowerCase()] || status
    },
    translateGender(gender) {
      const genderMap = {
        laki_laki: 'Laki-laki',
        perempuan: 'Perempuan',
      }
      return genderMap[gender] || gender
    },
    // FIXED PAYMENT STATUS TRANSLATION
    translatePaymentStatus(status) {
      const statusMap = {
        pending: 'Pending',
        dibayar: 'Dibayar',
        gagal: 'Gagal',
        cancelled: 'Dibatalkan',
      }
      return statusMap[status] || status
    },
    translatePaymentMethod(method) {
      const methodMap = {
        qris: 'qris',
        bank_transfer: 'Transfer Bank',
        cash: 'Tunai',
        credit_card: 'Kartu Kredit',
      }
      return methodMap[method] || method
    },

    formatCurrency(amount) {
      if (!amount && amount !== 0) return 'Rp0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount)
    },

    handleShowDetail(rentalId) {
      this.showRentalDetail(rentalId)
    },

    async fetchRevenue() {
      this.loadingRevenue = true

      try {
        const token = localStorage.getItem('authToken')
        if (!token) throw new Error('Token tidak ditemukan. Silakan login kembali.')

        const today = new Date()
        const dateString = today.toISOString().split('T')[0] // Format: YYYY-MM-DD

        // Set current date texts
        const dayName = this.getDayName(today.getDay())
        const day = today.getDate()
        const monthName = this.getMonthName(today.getMonth())
        const year = today.getFullYear()

        this.currentDayText = `${dayName}, ${day} ${monthName} ${year}`
        this.currentMonthText = `${monthName} ${year}`
        this.currentYear = year.toString()

        // fetch semua revenue data secara paralel menggunakan fungsi apiService.js
        const [dailyResponse, monthlyResponse, annualResponse] = await Promise.all([
          apiService.getDashboardRevenue('daily', dateString),
          apiService.getDashboardRevenue('monthly', dateString),
          apiService.getDashboardRevenue('annual', dateString),
        ])

        // Update revenue data
        if (dailyResponse.data.status) {
          this.dailyRevenue = dailyResponse.data.data || 0
        }
        if (monthlyResponse.data.status) {
          this.monthlyRevenue = monthlyResponse.data.data || 0
        }
        if (annualResponse.data.status) {
          this.annualRevenue = annualResponse.data.data || 0
        }
      } catch (error) {
        console.error('Error fetching revenue:', error)
        // Set default values on error
        this.dailyRevenue = 0
        this.monthlyRevenue = 0
        this.annualRevenue = 0

        // Still set the date texts even if API fails
        const today = new Date()
        const dayName = this.getDayName(today.getDay())
        const day = today.getDate()
        const monthName = this.getMonthName(today.getMonth())
        const year = today.getFullYear()

        this.currentDayText = `${dayName}, ${day} ${monthName} ${year}`
        this.currentMonthText = `${monthName} ${year}`
        this.currentYear = year.toString()
      } finally {
        this.loadingRevenue = false
      }
    },

    // UPDATED FETCH RENTALS WITH CLIENT-SIDE FILTERING
    async fetchRentals() {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Token tidak ditemukan. Silakan login kembali.');

        const params = new URLSearchParams({
          page: this.currentPage, 
          limit: this.itemsPerPage, 
        });

        if (this.searchQuery) {
          params.append('search', this.searchQuery);
        }

        if (!this.appliedFilterAllDates) {
          if (this.appliedFilterStartDate) params.append('start_date', this.appliedFilterStartDate);
          if (this.appliedFilterEndDate) params.append('end_date', this.appliedFilterEndDate);
        }

        // 1. FILTER JENIS SEWA
        if (this.appliedFilterRentalType) {
          params.append('rental_type', this.appliedFilterRentalType); 
          // CATATAN: Jika belum bekerja, tanyakan ke orang backend apakah key-nya 'rental_type' atau hanya 'type'
        }

        // 2. FILTER STATUS PEMBAYARAN (Sesuaikan dengan spec Framework Backend-mu)
        if (this.appliedSelectedPaymentStatuses && this.appliedSelectedPaymentStatuses.length > 0) {
          
          // OPSI 1: Format Standar / Node.js / Express / Python (Paling sering digunakan)
          // Hasilnya: ?payment_status=gagal&payment_status=dibayar
          this.appliedSelectedPaymentStatuses.forEach(status => {
            params.append('payment_status', status);
          });

          // OPSI 2: Format Laravel (PHP) jika opsi 1 gagal
          // Hasilnya: ?payment_status[]=gagal&payment_status[]=dibayar
          // (Aktifkan baris di bawah ini dan hapus Opsi 1 jika backend-mu Laravel)
          /*
          this.appliedSelectedPaymentStatuses.forEach(status => {
            params.append('payment_status[]', status);
          });
          */

          // OPSI 3: Format String Pisah Koma
          // Hasilnya: ?payment_status=gagal,dibayar
          /*
          params.append('payment_status', this.appliedSelectedPaymentStatuses.join(','));
          */
        }
        
        if (this.sortBy) {
          params.append('sort', this.sortBy);
        }

        const response = await apiService.getRentals(params);

        if (response.data.status) {
          this.rentals = response.data.data;
          
          // FIX BUG: Sesuaikan dengan 'total_data' dari response JSON asli backend
          if (response.data.pagination) {
            this.totalData = response.data.pagination.total_data; // <-- Diubah dari .total menjadi .total_data
            this.totalPages = response.data.pagination.last_page;
          } else {
            this.totalData = response.data.total_data || response.data.total || this.rentals.length;
            this.totalPages = response.data.last_page || Math.ceil(this.totalData / this.itemsPerPage);
          }

          // SIFATNYA OPSIONAL: Karena renter sudah include di JSON, fungsi di bawah ini 
          // sebenarnya bisa kamu hapus/komentari agar aplikasi berjalan jauh lebih cepat.
          // Jika di tabel/komponen lain kamu memanggil `rental.renterName`, kamu bisa ganti panggilannya menjadi `rental.renter?.fullname`.
          await this.fetchRenterDetails();
          
        } else {
          this.errorMessage = 'Gagal mengambil data sewa.';
        }
      } catch (error) {
        console.error('Error fetching rentals:', error);
        this.errorMessage = error.response?.data?.message || 'Gagal mengambil data. Coba lagi nanti.';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchRenterDetails() {
      const renterMap = new Map()

      const renterPromises = this.rentals.map(async (rental) => {
        if (!rental.renter_id) return

        if (renterMap.has(rental.renter_id)) {
          rental.renterName = renterMap.get(rental.renter_id)
          return
        }

        try {
          const token = localStorage.getItem('authToken')
          const response = await apiService.getRenter(rental.renter_id)

          if (response.data.status) {
            const renterName = response.data.data.fullname
            renterMap.set(rental.renter_id, renterName)
            rental.renterName = renterName
          }
        } catch (error) {
          console.error(`Error fetching renter ${rental.renter_id}:`, error)
          rental.renterName = 'Tidak ditemukan'
        }
      })

      await Promise.all(renterPromises)

      if (this.sortBy === 'name') {
        this.rentals = this.applySorting(this.rentals)
      }
    },

    async showRentalDetail(rentalId) {
      console.log('Fetching rental detail for ID:', rentalId)

      if (!rentalId) {
        console.error('ERROR: rentalId is empty or undefined!')
        this.showToast('warning', 'ID penyewaan tidak valid')
        return
      }

      this.loadingDetailId = rentalId
      this.showModal = true
      this.rentalDetail = null

      try {
        const token = localStorage.getItem('authToken')
        if (!token) throw new Error('Token tidak ditemukan. Silakan login kembali.')

        const response = await apiService.getRentalDetail(rentalId)

        if (response.data.status) {
          this.rentalDetail = response.data.data
        } else {
          this.errorMessage = 'Gagal mengambil detail sewa.'
          this.closeModal()
        }
      } catch (error) {
        console.error('Error fetching rental detail:', error)
        this.errorMessage = error.response?.data?.message || error.message || 'Gagal mengambil detail.'
        this.showToast('error', 'Error: ' + this.errorMessage)
        this.closeModal()
      } finally {
        this.loadingDetailId = null
      }
    },

    closeModal() {
      this.showModal = false
      this.rentalDetail = null
      this.loadingDetailId = null
    },

    openPageJumpModal() {
      this.showPageJumpModal = true
      this.pageJumpInput = this.currentPage
      this.pageJumpError = ''
    },

    closePageJumpModal() {
      this.showPageJumpModal = false
      this.pageJumpInput = null
      this.pageJumpError = ''
    },

    validatePageInput() {
      if (!this.pageJumpInput) {
        this.pageJumpError = 'Mohon masukkan nomor halaman'
      } else if (this.pageJumpInput < 1) {
        this.pageJumpError = `Nomor halaman tidak boleh kurang dari 1`
      } else if (this.pageJumpInput > this.totalPages) {
        this.pageJumpError = `Nomor halaman tidak boleh lebih dari ${this.totalPages}`
      } else {
        this.pageJumpError = ''
      }
    },

    jumpToPage() {
      if (!this.pageJumpInput) {
        this.pageJumpError = 'Mohon masukkan nomor halaman'
        return
      }

      if (this.pageJumpInput < 1 || this.pageJumpInput > this.totalPages) {
        this.pageJumpError = `Mohon masukkan nomor halaman yang valid antara 1 dan ${this.totalPages}`
        return
      }

      this.goToPage(this.pageJumpInput)
      this.closePageJumpModal()
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.currentPage = page;
        this.fetchRentals();
      }
    },

    // Export modal methods
    async openExportModal() {
      this.showExportModal = true
      // Set default month to current month
      const today = new Date()
      this.exportMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
      this.currentYearMonth = this.exportMonth

      // Fetch building lists
      await this.fetchBuildingLists()
    },
    closeExportModal() {
      this.showExportModal = false
      this.selectedCityHalls = []
      this.selectedGuesthouses = []
    },
    async fetchBuildingLists() {
      const token = localStorage.getItem('authToken')
      if (!token) {
        this.showToast('warning', 'Anda harus login terlebih dahulu!')
        return
      }

      // Fetch City Halls
      this.loadingCityHalls = true
      try {
        const response = await apiService.getCityHalls()

        if (response.data.status) {
          this.cityHallsList = response.data.data
        }
      } catch (error) {
        console.error('Error fetching city halls:', error)
      } finally {
        this.loadingCityHalls = false
      }

      // Fetch Guesthouses
      this.loadingGuesthouses = true
      try {
        const response = await apiService.getGuesthouses()

        if (response.data.status) {
          this.guesthousesList = response.data.data
        }
      } catch (error) {
        console.error('Error fetching guesthouses:', error)
      } finally {
        this.loadingGuesthouses = false
      }
    },

    // New method to fetch rentals by building
    applyCellStyleExcelJS(worksheet, cellAddress, style) {
      const cell = worksheet.getCell(cellAddress)

      if (style.font) {
        cell.font = { name: 'Arial', ...style.font }
      }

      if (style.alignment) {
        cell.alignment = style.alignment
      }

      if (style.fill) {
        cell.fill = style.fill
      }

      if (style.border) {
        cell.border = style.border
      }

      if (style.numFmt) {
        cell.numFmt = style.numFmt
      }
    },

    // New method to add logo to worksheet
    async addLogo(worksheet, startRow = 1, startCol = 1, logoSize = 100) {
      try {
        const logoPath = '/logo-pemda.png'

        const response = await fetch(logoPath)
        if (response.ok) {
          const blob = await response.blob()
          const buffer = await blob.arrayBuffer()

          const imageId = worksheet.workbook.addImage({
            buffer: buffer,
            extension: 'png',
          })

          // Gunakan logoSize parameter untuk width dan height
          worksheet.addImage(imageId, {
            tl: { col: startCol - 1, row: startRow - 1 },
            ext: { width: logoSize, height: logoSize }, // Ukuran sesuai parameter
            editAs: 'oneCell', // Menjaga aspect ratio
          })

          return true
        }
      } catch (error) {
        console.error('Error adding logo:', error)
        return false
      }
      return false
    },

    // New method to clean filename
    cleanFilename(name) {
      return name
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '') // Remove all spaces
        .replace(/-+/g, '') // Remove hyphens
    },

    // NEW UPDATED EXPORT TO EXCEL METHOD
    async exportToExcel() {
      if (
        (!this.selectedCityHalls.length && !this.selectedGuesthouses.length) ||
        !this.exportMonth
      ) {
        this.showToast('warning', 'Pilih minimal satu gedung dan bulan yang akan diekspor')
        return
      }

      this.isExporting = true

      try {
        const token = localStorage.getItem('authToken')
        if (!token) throw new Error('Token tidak ditemukan. Silakan login kembali.')

        // Parse month and year
        const [year, month] = this.exportMonth.split('-')
        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 0)

        // Format dates for API
        const startDateStr = startDate.toISOString().split('T')[0]
        const endDateStr = endDate.toISOString().split('T')[0]

        const monthName = this.getMonthName(parseInt(month) - 1)

        // Store all building data for summary
        const allBuildingData = []

        // Export separate files for each selected guesthouse
        for (const guesthouseId of this.selectedGuesthouses) {
          const rentals = await this.fetchRentalsByBuilding(
            'guesthouse',
            guesthouseId,
            startDateStr,
            endDateStr,
          )
          const guesthouse = this.guesthousesList.find((g) => g.id === guesthouseId)

          if (guesthouse) {
            // Clean building name for filename
            const cleanBuildingName = this.cleanFilename(guesthouse.name)
            await this.createBuildingReport(
              rentals,
              guesthouse.name,
              'Mess',
              cleanBuildingName,
              monthName,
              year,
            )

            // Store data for summary
            allBuildingData.push({
              type: 'Mess',
              name: guesthouse.name,
              transactions: rentals.filter(
                (r) => r.payment?.status === 'paid' || r.payment?.status === 'dibayar',
              ),
            })
          }
        }

        // Export separate files for each selected city hall
        for (const cityHallId of this.selectedCityHalls) {
          const rentals = await this.fetchRentalsByBuilding(
            'city_hall',
            cityHallId,
            startDateStr,
            endDateStr,
          )
          const cityHall = this.cityHallsList.find((c) => c.id === cityHallId)

          if (cityHall) {
            // Clean building name for filename
            const cleanBuildingName = this.cleanFilename(cityHall.name)
            await this.createBuildingReport(
              rentals,
              cityHall.name,
              'GedungNasional',
              cleanBuildingName,
              monthName,
              year,
            )

            // Store data for summary
            allBuildingData.push({
              type: 'Gedung Nasional',
              name: cityHall.name,
              transactions: rentals.filter(
                (r) => r.payment?.status === 'paid' || r.payment?.status === 'dibayar',
              ),
            })
          }
        }

        // Create summary report
        if (allBuildingData.length > 0) {
          await this.createSummaryReport(allBuildingData, monthName, year)
        }

        this.closeExportModal()
      } catch (error) {
        console.error('Error exporting to Excel:', error)
        this.showToast('error', 'Gagal mengekspor laporan. Silakan coba lagi.')
      } finally {
        this.isExporting = false
      }
    },

    // New method to clean filename for safe file naming
    cleanFilename(name) {
      return name
        .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, and hyphens
        .replace(/\s+/g, '') // Remove all spaces
        .replace(/-+/g, '') // Remove hyphens
    },

    // method to create individual building report
    async createBuildingReport(
      transactions,
      buildingName,
      buildingType,
      cleanBuildingName,
      monthName,
      year,
    ) {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Laporan Transaksi')

      // Filter transaksi yang sudah dibayar
      const paidTransactions = transactions.filter(
        (rental) => rental.payment?.status === 'paid' || rental.payment?.status === 'dibayar',
      )

      // Add logo
      await this.addLogo(worksheet, 1, 1, 116)

      // Lebar kolom
      if (buildingType === 'Mess') {
        worksheet.columns = [
          { width: 5 },
          { width: 20 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 45 },
          { width: 35 },
          { width: 15 },
          { width: 18 },
        ]
      } else {
        worksheet.columns = [
          { width: 5 },
          { width: 20 },
          { width: 25 },
          { width: 20 },
          { width: 40 },
          { width: 20 },
          { width: 15 },
          { width: 18 },
        ]
      }

      // HEADER SECTION dengan styling lengkap
      const headerData = [
        'PEMERINTAH KOTA PADANGSIDIMPUAN',
        'SEKRETARIAT DAERAH',
        'Jalan Jenderal Sudirman Nomor 2 Padangsidimpuan Utara,',
        'Padangsidimpuan, Sumatera Utara 22718, Telepon: (0634) 27806 - 27807',
        'Faksimile : (0634) 27227',
      ]

      // Apply header dengan styling
      for (let i = 0; i < headerData.length; i++) {
        const row = i + 1
        const cell = worksheet.getCell(`B${row}`)
        cell.value = headerData[i]

        const lastCol = buildingType === 'Mess' ? 'I' : 'H'
        worksheet.mergeCells(`B${row}:${lastCol}${row}`)

        this.applyCellStyleExcelJS(worksheet, `B${row}`, {
          font: {
            size: i === 1 ? 18 : 14,
            bold: i === 0 || i === 1,
          },
          alignment: { horizontal: 'center', vertical: 'middle' },
        })
      }

      // Border bawah kop surat
      const lastCol = buildingType === 'Mess' ? 'I' : 'H'
      for (let col = 1; col <= (buildingType === 'Mess' ? 9 : 8); col++) {
        const colLetter = String.fromCharCode(64 + col)
        this.applyCellStyleExcelJS(worksheet, `${colLetter}5`, {
          border: {
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
          },
        })
      }

      // Building name dan report title
      const buildingRow = 8
      const titleRow = 9

      worksheet.getCell(`A${buildingRow}`).value = buildingName
      worksheet.mergeCells(`A${buildingRow}:${lastCol}${buildingRow}`)
      this.applyCellStyleExcelJS(worksheet, `A${buildingRow}`, {
        font: { size: 14, bold: true },
        alignment: { horizontal: 'center', vertical: 'middle' },
      })

      worksheet.getCell(`A${titleRow}`).value = 'Laporan Transaksi Bulanan'
      worksheet.mergeCells(`A${titleRow}:${lastCol}${titleRow}`)
      this.applyCellStyleExcelJS(worksheet, `A${titleRow}`, {
        font: { size: 14, bold: true },
        alignment: { horizontal: 'center', vertical: 'middle' },
      })

      // Month info
      const monthRow = 11
      worksheet.getCell(`A${monthRow}`).value = `Bulan : ${monthName} ${year}`
      worksheet.mergeCells(`A${monthRow}:D${monthRow}`)
      this.applyCellStyleExcelJS(worksheet, `A${monthRow}`, {
        font: { size: 12 },
        alignment: { horizontal: 'left', vertical: 'middle' },
      })

      // PERBAIKAN: Table header TANPA background color
      const headerRow = 13
      let tableHeaders

      if (buildingType === 'Mess') {
        tableHeaders = [
          'No',
          'Tanggal Transaksi',
          'Nama Penyewa',
          'Tanggal Check-in',
          'Tanggal Check-out',
          'Nomor Invoice',
          'Jenis Retribusi',
          'Harga Item (@)',
          'Total Harga',
        ]
      } else {
        tableHeaders = [
          'No',
          'Tanggal Transaksi',
          'Nama Penyewa',
          'Tanggal Pemakaian',
          'Nomor Invoice',
          'Jenis Retribusi',
          'Harga Item (@)',
          'Total Harga',
        ]
      }

      tableHeaders.forEach((header, index) => {
        const colLetter = String.fromCharCode(65 + index)
        const cell = worksheet.getCell(`${colLetter}${headerRow}`)
        cell.value = header

        // Tanpa background color
        this.applyCellStyleExcelJS(worksheet, `${colLetter}${headerRow}`, {
          font: { size: 12, bold: true },
          alignment: { horizontal: 'center', vertical: 'middle' },
          border: {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } },
          },
        })
      })

      // Table data dengan border lengkap
      let currentRow = headerRow + 1

      paidTransactions.forEach((rental, index) => {
        let rowData

        if (buildingType === 'Mess') {
          rowData = [
            index + 1,
            this.formatDateExcel(rental.created_at),
            rental.renter?.fullname || '-',
            this.formatDateExcel(rental.start_date),
            this.formatDateExcel(rental.end_date),
            rental.payment?.id || '-',
            rental.guesthouse_room_pricing?.retribution_type || '-',
            rental.guesthouse_room_pricing?.price_per_day || 0,
            rental.payment?.amount || 0,
          ]
        } else {
          rowData = [
            index + 1,
            this.formatDateExcel(rental.created_at),
            rental.renter?.fullname || '-',
            this.formatDateExcel(rental.start_date),
            rental.payment?.id || '-',
            rental.city_hall_pricing?.activity_type || '-',
            rental.city_hall_pricing?.price_per_day || 0,
            rental.payment?.amount || 0,
          ]
        }

        // Apply data dengan styling lengkap
        rowData.forEach((value, colIndex) => {
          const colLetter = String.fromCharCode(65 + colIndex)
          const cell = worksheet.getCell(`${colLetter}${currentRow}`)
          cell.value = value

          const style = {
            font: { size: 12 },
            border: {
              top: { style: 'thin', color: { argb: 'FF000000' } },
              left: { style: 'thin', color: { argb: 'FF000000' } },
              bottom: { style: 'thin', color: { argb: 'FF000000' } },
              right: { style: 'thin', color: { argb: 'FF000000' } },
            },
          }

          if (colIndex === 0) {
            style.alignment = { horizontal: 'center', vertical: 'middle' }
          } else if (colIndex >= rowData.length - 2) {
            style.alignment = { horizontal: 'right', vertical: 'middle' }
            style.numFmt = '#,##0'
          }

          this.applyCellStyleExcelJS(worksheet, `${colLetter}${currentRow}`, style)
        })

        currentRow++
      })

      // PERBAIKAN: Total row dengan merge yang benar
      const totalRow = currentRow
      const total = paidTransactions.reduce((sum, rental) => sum + (rental.payment?.amount || 0), 0)

      // Merge "Jumlah" dari kolom A sampai sebelum kolom total harga
      const totalColIndex = tableHeaders.length - 1 // Index kolom total harga
      const beforeTotalCol = String.fromCharCode(65 + totalColIndex - 1) // Kolom sebelum total
      const totalCol = String.fromCharCode(65 + totalColIndex) // Kolom total

      // Merge dari A sampai kolom sebelum total
      worksheet.mergeCells(`A${totalRow}:${beforeTotalCol}${totalRow}`)
      worksheet.getCell(`A${totalRow}`).value = 'Jumlah'
      worksheet.getCell(`${totalCol}${totalRow}`).value = total

      // Style untuk baris total
      for (let colIndex = 0; colIndex < tableHeaders.length; colIndex++) {
        const colLetter = String.fromCharCode(65 + colIndex)
        this.applyCellStyleExcelJS(worksheet, `${colLetter}${totalRow}`, {
          font: { size: 11, bold: true },
          border: {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } },
          },
          alignment: { horizontal: 'right', vertical: 'middle' },
        })
      }

      // Format currency untuk kolom total
      worksheet.getCell(`${totalCol}${totalRow}`).numFmt = '#,##0'

      // Save dengan ExcelJS
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Laporan_Keuangan_${cleanBuildingName}_${monthName}_${year}.xlsx`
      link.click()
      window.URL.revokeObjectURL(url)
    },

    // Updated method to create summary report with signature section
    async createSummaryReport(allBuildingData, monthName, year) {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Ringkasan Keuangan')

      // PERBAIKAN: Set column widths yang lebih lebar
      worksheet.columns = [{ width: 8 }, { width: 45 }, { width: 18 }, { width: 25 }]

      // Add logo
      await this.addLogo(worksheet, 1, 1, 100)

      // Header section dengan logo space
      const headerData = [
        'PEMERINTAH KOTA PADANGSIDIMPUAN',
        'SEKRETARIAT DAERAH',
        'Jalan Jenderal Sudirman Nomor 2 Padangsidimpuan Utara,',
        'Padangsidimpuan, Sumatera Utara 22718, Telepon: (0634) 27806 - 27807',
        'Faksimile : (0634) 27227',
      ]

      for (let i = 0; i < headerData.length; i++) {
        const row = i + 1
        const cell = worksheet.getCell(`B${row}`)
        cell.value = headerData[i]

        worksheet.mergeCells(`B${row}:D${row}`)

        this.applyCellStyleExcelJS(worksheet, `B${row}`, {
          font: {
            size: i === 1 ? 18 : 14,
            bold: i === 0 || i === 1,
          },
          alignment: { horizontal: 'center', vertical: 'middle' },
        })
      }

      // Border bawah kop surat
      for (let col = 1; col <= 4; col++) {
        const colLetter = String.fromCharCode(64 + col)
        this.applyCellStyleExcelJS(worksheet, `${colLetter}5`, {
          border: {
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
          },
        })
      }

      // Title sections dengan row height yang lebih tinggi
      const titles = [
        'Laporan Keuangan',
        'Pendapatan Bagian Umum',
        'Sekretariat Daerah Kota Padangsidimpuan',
        '(SiGEMES)',
      ]

      titles.forEach((title, index) => {
        const row = 8 + index
        // worksheet.getRow(row).height = 20; // Tinggi baris lebih besar
        worksheet.getCell(`A${row}`).value = title
        worksheet.mergeCells(`A${row}:D${row}`)
        this.applyCellStyleExcelJS(worksheet, `A${row}`, {
          font: { size: 14, bold: true },
          alignment: { horizontal: 'center', vertical: 'middle' },
        })
      })

      // PERBAIKAN: Table header tanpa background color
      const headerRow = 14
      const tableHeaders = ['No', 'Retribusi', 'Jumlah Penyewa', 'Total Pendapatan']

      // worksheet.getRow(headerRow).height = 18; // Tinggi header lebih besar

      tableHeaders.forEach((header, index) => {
        const colLetter = String.fromCharCode(65 + index)
        const cell = worksheet.getCell(`${colLetter}${headerRow}`)
        cell.value = header

        // PERBAIKAN: Tanpa background color
        this.applyCellStyleExcelJS(worksheet, `${colLetter}${headerRow}`, {
          font: { size: 12, bold: true },
          alignment: { horizontal: 'center', vertical: 'middle' },
          border: {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } },
          },
        })
      })

      // Table data
      let currentRow = headerRow + 1

      allBuildingData.forEach((building, index) => {
        const totalAmount = building.transactions.reduce(
          (sum, t) => sum + (t.payment?.amount || 0),
          0,
        )

        const rowData = [index + 1, building.name, building.transactions.length, totalAmount]

        rowData.forEach((value, colIndex) => {
          const colLetter = String.fromCharCode(65 + colIndex)
          const cell = worksheet.getCell(`${colLetter}${currentRow}`)
          cell.value = value

          const style = {
            font: { size: 12 },
            border: {
              top: { style: 'thin', color: { argb: 'FF000000' } },
              left: { style: 'thin', color: { argb: 'FF000000' } },
              bottom: { style: 'thin', color: { argb: 'FF000000' } },
              right: { style: 'thin', color: { argb: 'FF000000' } },
            },
          }

          if (colIndex === 0) {
            style.alignment = { horizontal: 'center', vertical: 'middle' }
          } else if (colIndex >= 2) {
            style.alignment = { horizontal: 'right', vertical: 'middle' }
            if (colIndex === 3) style.numFmt = '#,##0'
          }

          this.applyCellStyleExcelJS(worksheet, `${colLetter}${currentRow}`, style)
        })

        currentRow++
      })

      // PERBAIKAN: Total row dengan merge yang benar
      const totalRow = currentRow
      const grandTotalPendapatan = allBuildingData.reduce((sum, building) => {
        return (
          sum +
          building.transactions.reduce(
            (buildingSum, t) => buildingSum + (t.payment?.amount || 0),
            0,
          )
        )
      }, 0)

      // PERBAIKAN: Merge "Total" dari kolom A sampai C
      worksheet.mergeCells(`A${totalRow}:C${totalRow}`)
      worksheet.getCell(`A${totalRow}`).value = 'Total'
      worksheet.getCell(`D${totalRow}`).value = grandTotalPendapatan

      // Style untuk baris total
      ;['A', 'B', 'C', 'D'].forEach((col, index) => {
        this.applyCellStyleExcelJS(worksheet, `${col}${totalRow}`, {
          font: { size: 12, bold: true },
          border: {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } },
          },
          alignment: { horizontal: 'right', vertical: 'middle' },
        })

        if (col === 'D') {
          worksheet.getCell(`${col}${totalRow}`).numFmt = '#,##0'
        }
      })

      // PERBAIKAN: SIGNATURE SECTION dengan tanggal otomatis dan posisi yang diperbaiki
      const signatureStartRow = totalRow + 3

      // PERBAIKAN: Tanggal otomatis
      const today = new Date()
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
      const monthNames = [
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

      const dayName = dayNames[today.getDay()]
      const day = today.getDate()
      const currentMonthName = monthNames[today.getMonth()]
      const yearName = today.getFullYear()
      const currentDate = `${day} ${currentMonthName} ${yearName}`

      // worksheet.getRow(signatureStartRow).height = 16;
      worksheet.getCell(`D${signatureStartRow}`).value = `Padangsidimpuan, ${currentDate}`
      this.applyCellStyleExcelJS(worksheet, `D${signatureStartRow}`, {
        font: { size: 12 },
        alignment: { horizontal: 'right', vertical: 'middle' },
      })

      const signatureRow1 = signatureStartRow + 2
      // worksheet.getRow(signatureRow1).height = 16;
      // PERBAIKAN: Posisi tanda tangan yang lebih baik (tidak berubah karena sudah pas)
      worksheet.getCell(`A${signatureRow1}`).value = 'Mengetahui,'
      worksheet.getCell(`D${signatureRow1}`).value = 'Bendahara Penerimaan,'

      const signatureRow2 = signatureRow1 + 1
      // worksheet.getRow(signatureRow2).height = 16;
      worksheet.getCell(`A${signatureRow2}`).value = 'a. n. Sekretaris Daerah'

      const signatureRow3 = signatureRow2 + 1
      // worksheet.getRow(signatureRow3).height = 16;
      worksheet.getCell(`A${signatureRow3}`).value = 'Asisten Administrasi Umum'

      const signatureRow4 = signatureRow3 + 1
      // worksheet.getRow(signatureRow4).height = 16;
      worksheet.getCell(`A${signatureRow4}`).value = 'u. b. Kepala Bagian Umum,'

      // Names (5 rows space untuk tanda tangan)
      const nameRow = signatureRow4 + 6 // PERBAIKAN: Lebih banyak space untuk tanda tangan
      // worksheet.getRow(nameRow).height = 16;
      worksheet.getCell(`A${nameRow}`).value = 'Tobonsyah Pulungan, S. Sos, M. M.'
      worksheet.getCell(`D${nameRow}`).value = 'Jenni Sartika'

      const rankRow = nameRow + 1
      // worksheet.getRow(rankRow).height = 16;
      worksheet.getCell(`A${rankRow}`).value = 'Pembina Tingkat I / IVb'
      worksheet.getCell(`D${rankRow}`).value = 'Penata Muda / IIa'

      const nipRow = rankRow + 1
      // worksheet.getRow(nipRow).height = 16;
      worksheet.getCell(`A${nipRow}`).value = 'NIP. 197909091998031002'
      worksheet.getCell(`D${nipRow}`).value = 'NIP. 198405202008012002'

      // Style signature section
      for (let row = signatureStartRow; row <= nipRow; row++) {
        // Style untuk kolom A (left alignment)
        this.applyCellStyleExcelJS(worksheet, `A${row}`, {
          font: { size: 12 },
          alignment: { horizontal: 'left', vertical: 'middle' },
        })

        // Style untuk kolom D (right alignment)
        this.applyCellStyleExcelJS(worksheet, `D${row}`, {
          font: { size: 12 },
          alignment: { horizontal: 'right', vertical: 'middle' },
        })
      }

      // Save file
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Ringkasan_Keuangan_${monthName}_${year}.xlsx`
      link.click()
      window.URL.revokeObjectURL(url)
    },

    // filter rental sesuai gedung dan tanggal
    async fetchRentalsByBuilding(type, buildingId, startDate, endDate) {
      const token = localStorage.getItem('authToken')
      const rentals = []
      let page = 1
      let hasMore = true

      while (hasMore) {
        try {
          const params = new URLSearchParams({
            page: page,
            limit: 1000, // Use larger limit to get more data at once
            start_date: startDate,
            end_date: endDate,
          })

          // fetch rental menggunakan fungsi apiService
          const response = await apiService.getRentals(params)

          if (response.data.status && response.data.data.length > 0) {
            // Filter by building type and ID on client side
            const filteredRentals = response.data.data.filter((rental) => {
              if (type === 'guesthouse') {
                return (
                  rental.guesthouse_room_pricing?.guesthouse_room?.guesthouse?.id === buildingId
                )
              } else if (type === 'city_hall') {
                return rental.city_hall_pricing?.city_hall?.id === buildingId
              }
              return false
            })

            // Fetch renter details for each filtered rental
            for (const rental of filteredRentals) {
              if (rental.renter_id) {
                try {
                  // fetch detail rental menggunakan fungsi apiService
                  const renterResponse = await apiService.getRenter(rental.renter_id)

                  if (renterResponse.data.status) {
                    rental.renter = renterResponse.data.data
                  }
                } catch (error) {
                  console.error(`Error fetching renter ${rental.renter_id}:`, error)
                }
              }
            }

            rentals.push(...filteredRentals)

            // Check if there are more pages
            if (response.data.pagination && page < response.data.pagination.last_page) {
              page++
            } else {
              hasMore = false
            }
          } else {
            hasMore = false
          }
        } catch (error) {
          console.error('Error fetching rentals:', error)
          hasMore = false
        }
      }

      return rentals
    },

    formatDateExcel(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    },
  },

  mounted() {
    // Ambil fullname dari localStorage (sama dengan key yang dipakai di authStore)
    // Gunakan 'userFullname' agar konsisten dengan pemanggilan nama di komponen lain
    this.fullname = localStorage.getItem('userFullname') || '[Nama User]'

    // Trigger animasi setelah komponen di-mount (delay sedikit agar lebih mulus)
    setTimeout(() => {
      this.showWelcome = true
    }, 150)

    this.fetchRevenue()
    this.fetchRentals()
  },
}
</script>

<style scoped>
#dashboard-header,
#export-report-button,
.revenue,
.rent-column {
  font-family: 'Poppins', sans-serif;
}

.revenue-cardbox {
  background-color: #e8f9ff;
}

/* Skeleton loader animation - konsisten dengan gedung nasional */
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

/* Animation for loading text */
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
}

/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Fade animation for error messages */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar untuk modal filter */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Table styling */
table {
  table-layout: fixed;
}

table th,
table td {
  word-wrap: break-word;
}

table th:first-child,
table td:first-child {
  text-align: center;
}

table th:last-child,
table td:last-child {
  text-align: center;
}

/* Modal styling */
.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-50 {
  z-index: 50;
}

.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.max-h-90vh {
  max-height: 90vh;
}

.overflow-y-auto {
  overflow-y: auto;
}

/* Add custom dropdown styling */
.relative {
  position: relative;
}

/* Dropdown animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
  transform-origin: top;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.9);
}

/* Custom focus states */
.custom-dropdown:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

/* Hover effects */
.custom-dropdown:hover {
  border-color: #60a5fa;
}

/* Icon rotation animation */
.rotate-180 {
  transform: rotate(180deg);
}

/* Transition for smooth interactions */
.transition-colors {
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.transition-transform {
  transition: transform 0.2s ease;
}

/* Animasi Welcome Message */
.welcome-fade-enter-active {
  transition:
    opacity 0.8s ease-out,
    transform 0.8s ease-out;
}
.welcome-fade-enter-from {
  opacity: 0;
  transform: translateY(-15px);
}
.welcome-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
