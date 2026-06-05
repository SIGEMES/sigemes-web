<template>
    <div>
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

        <!-- Modal Filter -->
        <transition name="modal">
            <div
                v-if="showFilterModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                @click="closeFilterModal"
            >
                <div class="bg-blue-100 rounded-lg max-w-lg max-h-[90vh] overflow-hidden" @click.stop>
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

                            <!-- Pemilih Rentang Tanggal -->
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

                        <!-- Status Pembayaran -->
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
                                    >{{ option.label }}</span>
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
    </div>
</template>

<script>
import RentalsTable from './RentalsTable.vue'
import CustomPagination from './CustomPagination.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
    name: 'RentalsFilterControls',
    components: {
        RentalsTable,
        CustomPagination,
        VueDatePicker,
    },
    props: {
        rentals: {
            type: Array,
            required: true,
        },
        paginatedRentals: {
            type: Array,
            required: true,
        },
        isLoading: {
            type: Boolean,
            required: true,
        },
        errorMessage: {
            type: String,
            default: '',
        },
        currentPage: {
            type: Number,
            required: true,
        },
        totalPages: {
            type: Number,
            required: true,
        },
        loadingDetailId: {
            type: [Number, String, null],
            default: null,
        },
    },
    emits: [
        'filters-updated',
        'show-detail',
        'page-changed',
        'open-jump-modal',
        'items-per-page-changed',
        'search-changed',
        'sort-changed',
    ],
    data() {
        return {
            // Search & Sort Controls
            searchQuery: '',
            sortBy: 'newest',
            searchTimeout: null,
            showSortDropdown: false,
            showItemsDropdown: false,
            itemsPerPage: 10,
            itemsOptions: [10, 15, 20],
            sortOptions: [
                { value: 'newest', label: 'Terbaru' },
                { value: 'oldest', label: 'Terlama' },
                { value: 'name', label: 'Nama Penyewa Urut Abjad' },
            ],

            // Filter Modal State
            showFilterModal: false,

            // Filter Modal Values (what's being set in the modal)
            filterAllDates: true,
            filterStartDate: '',
            filterEndDate: '',
            filterRentalType: '',
            selectedPaymentStatuses: [],
            filterAllPaymentStatuses: true,

            // Applied Filters (what actually affects the data display)
            appliedFilterAllDates: true,
            appliedFilterStartDate: '',
            appliedFilterEndDate: '',
            appliedFilterRentalType: '',
            appliedSelectedPaymentStatuses: [],

            // Date picker options
            useVueDatepicker: true,
            dateRange: null,
            dateRangeValidationError: '',

            // Dropdown states for filter modal
            showRentalTypeDropdown: false,

            // Filter Options
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
        }
    },
    computed: {
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
    },
    methods: {
        // Search & Sort Methods
        handleSearch() {
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout)
            }

            this.searchTimeout = setTimeout(() => {
                this.$emit('search-changed', this.searchQuery)
            }, 500)
        },

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
            this.$emit('sort-changed', value)
        },

        selectItemsPerPage(value) {
            this.itemsPerPage = value
            this.showItemsDropdown = false
            this.$emit('items-per-page-changed', value)
        },

        getSortLabel(value) {
            const option = this.sortOptions.find((opt) => opt.value === value)
            return option ? option.label : 'Terbaru'
        },

        handleClickOutside(event) {
            if (!event.target.closest('.relative')) {
                this.showSortDropdown = false
                this.showItemsDropdown = false
            }
        },

        // Filter Modal Methods
        openFilterModal() {
            this.showFilterModal = true
        },

        closeFilterModal() {
            this.showFilterModal = false
            this.closeOtherFilterDropdowns()
            this.dateRangeValidationError = ''
        },

        validateDateRange() {
            this.dateRangeValidationError = ''

            if (this.filterAllDates) {
                return true
            }

            let isDateRangeEmpty = false

            if (this.useVueDatepicker) {
                isDateRangeEmpty = !this.dateRange || this.dateRange.length !== 2
            } else {
                isDateRangeEmpty = !this.filterStartDate || !this.filterEndDate
            }

            if (isDateRangeEmpty) {
                this.dateRangeValidationError = 'Mohon pilih rentang tanggal atau centang "Semua Tanggal"'
                return false
            }

            return true
        },

        applyFilters() {
            if (!this.validateDateRange()) {
                return
            }

            // Copy modal filter values to applied filter values
            this.appliedFilterAllDates = this.filterAllDates
            this.appliedFilterStartDate = this.filterStartDate
            this.appliedFilterEndDate = this.filterEndDate
            this.appliedFilterRentalType = this.filterRentalType

            // For payment status
            if (this.filterAllPaymentStatuses) {
                this.appliedSelectedPaymentStatuses = []
            } else {
                this.appliedSelectedPaymentStatuses = [...this.selectedPaymentStatuses]
            }

            // Emit filters to parent
            this.$emit('filters-updated', {
                allDates: this.appliedFilterAllDates,
                startDate: this.appliedFilterStartDate,
                endDate: this.appliedFilterEndDate,
                rentalType: this.appliedFilterRentalType,
                paymentStatuses: this.appliedSelectedPaymentStatuses,
            })

            this.closeFilterModal()
        },

        handleAllPaymentStatusToggle() {
            if (this.filterAllPaymentStatuses) {
                this.selectedPaymentStatuses = []
            }
        },

        handleIndividualPaymentStatusChange() {
            const allIndividualOptions = this.paymentStatusOptionsForCheckbox.map((option) => option.value)
            const allSelected = allIndividualOptions.every((option) =>
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

        handleAllDatesToggle() {
            if (this.filterAllDates) {
                this.filterStartDate = ''
                this.filterEndDate = ''
                this.dateRange = null
                this.dateRangeValidationError = ''
            } else {
                this.filterStartDate = ''
                this.filterEndDate = ''
                this.dateRange = null
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
        },

        closeOtherFilterDropdowns() {
            this.showRentalTypeDropdown = false
        },

        getRentalTypeLabel(rentalType = null) {
            const filterValue = rentalType || this.filterRentalType
            const option = this.rentalTypeOptions.find((opt) => opt.value === filterValue)
            return option ? option.label : 'Semua'
        },

        removeFilter(filterKey) {
            switch (filterKey) {
                case 'dateRange':
                    this.appliedFilterAllDates = true
                    this.appliedFilterStartDate = ''
                    this.appliedFilterEndDate = ''
                    this.filterAllDates = true
                    this.filterStartDate = ''
                    this.filterEndDate = ''
                    this.dateRange = null
                    break

                case 'rentalType':
                    this.appliedFilterRentalType = ''
                    this.filterRentalType = ''
                    break

                case 'paymentStatus':
                    this.appliedSelectedPaymentStatuses = []
                    this.selectedPaymentStatuses = []
                    this.filterAllPaymentStatuses = true
                    break
            }

            // Emit filters update to parent
            this.$emit('filters-updated', {
                allDates: this.appliedFilterAllDates,
                startDate: this.appliedFilterStartDate,
                endDate: this.appliedFilterEndDate,
                rentalType: this.appliedFilterRentalType,
                paymentStatuses: this.appliedSelectedPaymentStatuses,
            })
        },

        formatDateIndicator(dateString) {
            if (!dateString) return ''
            const date = new Date(dateString)
            const day = date.getDate()
            const month = this.getMonthName(date.getMonth())
            const year = date.getFullYear()
            return `${day} ${month} ${year}`
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

        // Table event handlers
        handleShowDetail(rentalId) {
            this.$emit('show-detail', rentalId)
        },

        handlePageChange(newPage) {
            this.$emit('page-changed', newPage)
        },

        openPageJumpModal() {
            this.$emit('open-jump-modal')
        },
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside)
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside)
    },
}
</script>

<style scoped>
.rent-column {
    font-family: 'Poppins', sans-serif;
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
</style>