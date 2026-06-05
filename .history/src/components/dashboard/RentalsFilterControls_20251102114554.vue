<template>
    <div class="mt-8 bg-blue-100 p-6 rounded-xl shadow-xl">
            <!-- Baris Kontrol Filter yang Diperbarui -->
            <div class="flex justify-center items-center gap-3 mb-6">
            <!-- Kotak Pencarian dengan Ikon -->
            <div class="flex-1 max-w-md relative">
                <div class="relative">
                <svg
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                </svg>
                <input
                    v-model="searchQuery"
                    @input="handleSearch"
                    type="text"
                    placeholder="Nama penyewa atau nomor invoice"
                    class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-black text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                </div>
            </div>

            <!-- Dropdown Kustom untuk Urutkan -->
            <div class="relative">
                <div
                class="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2.5 min-w-[140px] cursor-pointer hover:border-blue-400 transition-colors"
                @click="toggleSortDropdown"
                >
                <svg
                    class="w-4 h-4 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                </svg>
                <span class="text-black text-sm font-medium">Urutkan</span>
                <span class="text-gray-600 text-sm flex-1">{{ getSortLabel(sortBy) }}</span>
                <svg
                    class="w-4 h-4 text-gray-500 transition-transform"
                    :class="{ 'rotate-180': showSortDropdown }"
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

                <!-- Menu Dropdown Urutkan -->
                <div
                v-if="showSortDropdown"
                class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10"
                >
                <div class="py-1">
                    <div
                    v-for="option in sortOptions"
                    :key="option.value"
                    @click="selectSort(option.value)"
                    class="px-3 py-2 text-sm text-black hover:bg-blue-50 cursor-pointer"
                    :class="{ 'bg-blue-100 font-medium': sortBy === option.value }"
                    >
                    {{ option.label }}
                    </div>
                </div>
                </div>
            </div>

            <!-- Dropdown Kustom untuk Item Per Halaman -->
            <div class="relative">
                <div
                class="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2.5 min-w-[180px] cursor-pointer hover:border-blue-400 transition-colors"
                @click="toggleItemsDropdown"
                >
                <span class="text-black text-sm font-medium">Baris per halaman</span>
                <span class="text-gray-600 text-sm flex-1">{{ itemsPerPage }}</span>
                <svg
                    class="w-4 h-4 text-gray-500 transition-transform"
                    :class="{ 'rotate-180': showItemsDropdown }"
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

                <!-- Menu Dropdown Item Per Halaman -->
                <div
                v-if="showItemsDropdown"
                class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10"
                >
                <div class="py-1">
                    <div
                    v-for="option in itemsOptions"
                    :key="option"
                    @click="selectItemsPerPage(option)"
                    class="px-3 py-2 text-sm text-black hover:bg-blue-50 cursor-pointer"
                    :class="{ 'bg-blue-100 font-medium': itemsPerPage === option }"
                    >
                    {{ option }}
                    </div>
                </div>
                </div>
            </div>

            <!-- Tombol Filter dengan Ikon Baru -->
            <button
                @click="openFilterModal"
                class="flex items-center justify-center bg-blue-500 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
                <!-- Ikon Pengaturan/Filter -->
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                    d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"
                />
                </svg>
            </button>
            </div>

            <!-- Tampilan Filter Aktif -->
            <div v-if="activeFilters().length > 0" class="mt-4 mb-4">
            <div class="flex justify-center flex-wrap gap-2">
                <div
                v-for="filter in activeFilters()"
                :key="filter.key"
                class="inline-flex items-center rent-column bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                <span>{{ filter.label }}</span>
                <button
                    @click="removeFilter(filter.key)"
                    class="ml-2 text-white hover: font-bold text-lg leading-none"
                    title="Hapus filter"
                >
                    ×
                </button>
                </div>
            </div>
            </div>

            <RentalsTable
            :rentals="paginatedRentals"
            :isLoading="isLoading"
            :errorMessage="errorMessage"
            :currentPage="currentPage"
            :itemsPerPage="itemsPerPage"
            :loadingDetailId="loadingDetailId"
            @show-detail="handleShowDetail"
            />

            <CustomPagination
            v-if="!isLoading && !errorMessage && totalPages > 1"
            :currentPage="currentPage"
            :totalPages="totalPages"
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
</template>

<script>
export default {
    name: 'RentalsFilterControls',
    emits: ['filtersupdated'],
    data(){
        return {
            searchQuery: '',
            sortBy: 'newest',
            showSortDropdown: false,
            showItemsDropdown: false,
            itemsPerPage: 10,
            itemsOptions: [5, 10, 25, 50, 100],
            sortOptions: [
                { value: 'newest', label: 'Terbaru' },
                { value: 'oldest', label: 'Terlama' },
                { value: 'name', label: 'Nama A-Z' },
                { value: 'status', label: 'Status' }
            ],
            
            // State untuk filter modal
            showFilterModal: false,
            filterAllDates: true, // Default to "Semua Tanggal"
            dateRange: null, // For Vue Datepicker range
            dateRangeValidationError: '',
            filterRentalType: '',
            showRentalTypeDropdown: false,
            filterAllPaymentStatuses: true, // Default: semua status pembayaran dipilih
            selectedPaymentStatuses: [], // Array untuk menyimpan status pembayaran yang dipilih

            // Applied filters (what actually affects the data display)
            appliedFilterAllDates: true,
            appliedFilterStartDate: '',
            appliedFilterEndDate: '',
            appliedFilterRentalType: '',
            appliedSelectedPaymentStatuses: [],

            
            // State untuk filter yang diterapkan
            filters: {
                status: [],
                dateRange: {
                    start: null,
                    end: null
                },
                paymentMethod: [],
                amountRange: {
                    min: null,
                    max: null
                }
            },
            
            // Opsi filter
            statusOptions: [
                { value: 'active', label: 'Aktif' },
                { value: 'completed', label: 'Selesai' },
                { value: 'cancelled', label: 'Dibatalkan' },
                { value: 'pending', label: 'Tertunda' }
            ],
            paymentMethodOptions: [
                { value: 'cash', label: 'Tunai' },
                { value: 'transfer', label: 'Transfer' },
                { value: 'qris', label: 'QRIS' },
                { value: 'credit', label: 'Kredit' }
            ],

            // Opsi untuk checkbox status pembayaran
            paymentStatusOptionsForCheckbox: [
                { value: 'pending', label: 'Pending' },
                { value: 'gagal', label: 'Gagal' },
                { value: 'dibayar', label: 'Dibayar' },
            ],

            rentalTypeOptions: [
                { value: '', label: 'Semua' },
                { value: 'guesthouse', label: 'Gedung Mess' },
                { value: 'city_hall', label: 'Gedung Nasional' },
            ],

            searchTimeout: null, // Debounce untuk pencarian
        }
    },
    methods: {
        // Method to validate date range
        validateDateRange() {
        // Clear previous validation error
        this.dateRangeValidationError = ''

        // If "Semua Tanggal" is checked, no validation needed
        if (this.filterAllDates) {
            return true
        }

        // Update applyFilters method to include validation
        applyFilters() {
        // Validate date range first
        if (!this.validateDateRange()) {
            return // Don't proceed if validation fails
        }

        // Copy modal filter values to applied filter values
        this.appliedFilterAllDates = this.filterAllDates
        this.appliedFilterStartDate = this.filterStartDate
        this.appliedFilterEndDate = this.filterEndDate
        this.appliedFilterRentalType = this.filterRentalType

        // For payment status, if "Semua" is selected, clear individual selections
        if (this.filterAllPaymentStatuses) {
            this.appliedSelectedPaymentStatuses = []
        } else {
            this.appliedSelectedPaymentStatuses = [...this.selectedPaymentStatuses]
        }

        this.currentPage = 1
        this.fetchRentals()
        this.closeFilterModal()
        },

        // New method to handle "Semua" payment status toggle
        handleAllPaymentStatusToggle() {
            if (this.filterAllPaymentStatuses) {
                // When "Semua" is checked, clear individual selections
                this.selectedPaymentStatuses = []
            }
        },

        // New method to handle individual payment status changes
        handleIndividualPaymentStatusChange() {
            // Check if all individual options are selected
            const allIndividualOptions = this.paymentStatusOptionsForCheckbox.map(
                (option) => option.value,
            )
            const allSelected = allIndividualOptions.every((option) =>
                this.selectedPaymentStatuses.includes(option),
            )

            if (allSelected) {
                // If all individual options are selected, revert to "Semua" state
                this.filterAllPaymentStatuses = true
                this.selectedPaymentStatuses = []
            } else if (this.selectedPaymentStatuses.length > 0) {
                // When any individual status is selected (but not all), uncheck "Semua"
                this.filterAllPaymentStatuses = false
            } else {
                // When no individual status is selected, check "Semua"
                this.filterAllPaymentStatuses = true
            }
        },

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
                const rentalTypeLabel = this.getRentalTypeLabel(this.appliedFilterRentalType)
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
                        label: `Status Pembayaran : ${statusLabels[0]}`,
                    })
                } else {
                    filters.push({
                        key: 'paymentStatus',
                        label: `Status Pembayaran : ${statusLabels.join(', ')}`,
                    })
                }
            }

            return filters
        },

        // Update handleAllDatesToggle to clear validation error
        handleAllDatesToggle() {
            if (this.filterAllDates) {
                // Clear date inputs when "Semua Tanggal" is selected
                this.filterStartDate = ''
                this.filterEndDate = ''
                this.dateRange = null
                this.dateRangeValidationError = '' // Clear validation error
            } else {
                // Don't set default dates - let user choose
                this.filterStartDate = ''
                this.filterEndDate = ''
                this.dateRange = null
            }
        },

        removeFilter(filterKey) {
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

            // Apply filters after removing
            this.currentPage = 1
            this.fetchRentals()
        },

        formatDateIndicator(dateString) {
            if (!dateString) return ''
            const date = new Date(dateString)
            const day = date.getDate()
            const month = this.getMonthName(date.getMonth())
            const year = date.getFullYear()
            return `${day} ${month} ${year}`
        },

        // Update handleDateRangeChange to clear validation error
        handleDateRangeChange(range) {
            if (range && range.length === 2) {
                this.filterStartDate = range[0].toISOString().split('T')[0]
                this.filterEndDate = range[1].toISOString().split('T')[0]
                this.dateRangeValidationError = '' // Clear validation error when dates are selected
            } else {
                // Clear dates if range is invalid
                this.filterStartDate = ''
                this.filterEndDate = ''
            }
        },

        // Update closeFilterModal to clear validation error
        closeFilterModal() {
            this.showFilterModal = false
            this.closeOtherFilterDropdowns()
            this.dateRangeValidationError = '' // Clear validation error when closing modal
        },

        // New methods for custom dropdowns
        toggleSortDropdown() {
            this.showSortDropdown = !this.showSortDropdown
            if (this.showSortDropdown) {
                this.showItemsDropdown = false
            }
        },

        toggleItemsDropdown() {
            this.showItemsDropdown = !this.showItemsDropdown
            if (this.showItemsDropdown) {
                this.showSortDropdown = false
            }
        },

        selectSort(value) {
            this.sortBy = value
            this.showSortDropdown = false
            this.handleSortChange()
        },

        selectItemsPerPage(value) {
            this.itemsPerPage = value
            this.showItemsDropdown = false
            this.changeItemsPerPage()
        },

        getSortLabel(value) {
            const option = this.sortOptions.find((opt) => opt.value === value)
            return option ? option.label : 'Terbaru'
        },
    }
}