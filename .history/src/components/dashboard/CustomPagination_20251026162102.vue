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
              @click="typeof page === 'number' ? goToPage(page) : openPageJumpModal()"
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