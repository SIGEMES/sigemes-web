<template>
  <div class="flex justify-center mt-3" v-if="!isLoading && !errorMessage && totalPages > 1">
    <div class="pagination-container">
      <!-- Tombol Halaman Pertama -->
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1"
              :class="[
                'pagination-btn',
                'pagination-nav-text',
                currentPage === 1 ? 'disabled' : '',
              ]"
              title="Halaman Pertama"
            >
              &lt;&lt; Halaman Pertama
            </button>

            <!-- Tombol Sebelumnya -->
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              :class="['pagination-btn', 'pagination-nav', currentPage === 1 ? 'disabled' : '']"
              title="Halaman Sebelumnya"
            >
              &#8249;
            </button>

            <!-- Nomor Halaman -->
            <button
              v-for="page in visiblePages"
              :key="'page-' + page"
              @click=""
              :class="[
                'pagination-btn',
                page === currentPage ? 'active' : '',
                typeof page === 'string' ? 'dots' : '',
              ]"
            >
              {{ page }}
            </button>

            <!-- Tombol Selanjutnya -->
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              :class="[
                'pagination-btn',
                'pagination-nav',
                currentPage === totalPages ? 'disabled' : '',
              ]"
              title="Halaman Selanjutnya"
            >
              &#8250;
            </button>

            <!-- Tombol Halaman Terakhir -->
            <button
              @click="goToPage(totalPages)"
              :disabled="currentPage === totalPages"
              :class="[
                'pagination-btn',
                'pagination-nav-text',
                currentPage === totalPages ? 'disabled' : '',
              ]"
              title="Halaman Terakhir"
            >
              Halaman Terakhir &gt;&gt;
            </button>
          </div>
        </div>
</template>

<script>
    export default {
    name: 'CustomPagination',
    props: {
        currentPage: {
        type: Number,
        required: true,
        },
        totalPages: {
        type: Number,
        required: true,
        },
    },
    emits: ['page-changed', 'open-jump-modal'], // Tambah emit untuk jump modal
    computed: {
        // Pindahkan computed visiblePages ke sini
        visiblePages() {
        const pages = [];
        const total = this.totalPages;
        const current = this.currentPage;
        // ... (logika visiblePages SAMA PERSIS seperti di parent) ...
        if (total <= 7) {
            for (let i = 1; i <= total; i++) { pages.push(i); }
            } else {
            let pagesToShow = [];
            if (current <= 5) {
                for (let i = 1; i <= 5; i++) { pagesToShow.push(i); }
                if (total > 5) { pagesToShow.push('...'); }
            }
            else if (current > total - 5) {
                pagesToShow.push('...');
                for (let i = total - 4; i <= total; i++) { pagesToShow.push(i); }
            }
            else {
                pagesToShow.push('...');
                for (let i = current - 2; i <= current + 2; i++) { pagesToShow.push(i); }
                pagesToShow.push('...');
            }
            return pagesToShow; // Pastikan return di sini
            }
            return pages; // Pastikan return di sini juga
        }
    },
    methods: {
        handlePageClick(page) {
            if (typeof page === 'number') {
                this.$emit('page-changed', page);
            } else {
                // Beri tahu parent untuk membuka modal jump
                this.$emit('open-jump-modal');
            }
        }
    }
    }
</script>