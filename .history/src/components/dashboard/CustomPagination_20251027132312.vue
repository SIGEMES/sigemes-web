<template>
  <div class="flex justify-center mt-3">
    <div class="pagination-container">
      <!-- Tombol Halaman Pertama -->
      <button
        @click="$emit('page-changed', 1)"
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
              @click="$emit('page-changed', currentPage - 1)"
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
              @click="handlePageClick(page)"
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
              @click="$emit('page-changed', currentPage + 1)"
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
              @click="$emit('page-changed', totalPages)"
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
        },
    },
}
</script>

<style scoped>
/* Custom pagination styling */
.pagination-container {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-btn {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  background-color: white;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 0 12px;
}

.pagination-btn.pagination-nav-text {
  min-width: auto;
  white-space: nowrap;
}

.pagination-btn:hover:not(.disabled):not(.active) {
  background-color: #f5f5f5;
  border-color: #bbb;
}

.pagination-btn.active {
  background-color: #4682b4 !important;
  color: white !important;
  border-color: #4682b4 !important;
}

.pagination-btn.dots {
  cursor: pointer;
  background-color: #f9f9f9;
}

.pagination-btn.dots:hover {
  background-color: #e0e0e0;
}

.pagination-btn.pagination-nav {
  font-size: 18px;
  font-weight: bold;
}

.pagination-btn.disabled {
  background-color: #f9f9f9;
  color: #ccc;
  cursor: not-allowed;
  border-color: #eee;
}

.pagination-btn.disabled:hover {
  background-color: #f9f9f9;
  border-color: #eee;
}
</style>