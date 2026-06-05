<template>
  <div>
    <Navigation />
    <div class="container mt-6 mx-auto px-6 py-8">
      <!-- Heading -->
      <div class="flex justify-between items-center">
        <h1 class="data-gedung-text text-3xl font-black text-black">Daftar Gedung Nasional</h1>
        <button
          @click="openCreateModal"
          class="data-gedung-text font-bold bg-blue-500 text-white px-5 py-2 text-sm rounded-lg hover-gradient"
        >
          Tambah Gedung Nasional
        </button>
      </div>

      <!-- Skeleton Loader -->
      <div
        v-if="isLoading"
        class="cardbox-gedung mt-6 bg-blue-100 p-6 shadow-lg flex relative rounded-xl"
      >
        <!-- Image placeholder -->
        <div class="skeleton w-48 h-32 rounded-lg"></div>

        <!-- Content placeholders -->
        <div class="flex-1 pl-4">
          <div class="skeleton h-7 w-3/4 mb-2"></div>
          <div class="skeleton h-5 w-1/2 mb-2"></div>
          <div class="skeleton h-6 w-1/3 mt-3"></div>
        </div>

        <!-- Rating -->
        <div class="rating absolute top-4 right-4 flex items-center space-x-1">
          <div class="skeleton h-5 w-5 mr-1 rounded-full"></div>
          <div class="skeleton h-6 w-10 rounded"></div>
        </div>

        <!-- Actions -->
        <div class="absolute bottom-4 right-4 flex space-x-3">
          <div class="skeleton w-24 h-10 rounded-lg"></div>
          <div class="skeleton w-24 h-10 rounded-lg"></div>
          <div class="skeleton w-24 h-10 rounded-lg"></div>
        </div>
      </div>
      <div
        v-if="isLoading"
        class="cardbox-gedung mt-6 bg-blue-100 p-6 shadow-lg flex relative rounded-xl"
      >
        <!-- Image placeholder -->
        <div class="skeleton w-48 h-32 rounded-lg"></div>

        <!-- Content placeholders -->
        <div class="flex-1 pl-4">
          <div class="skeleton h-7 w-3/4 mb-2"></div>
          <div class="skeleton h-5 w-1/2 mb-2"></div>
          <div class="skeleton h-6 w-1/3 mt-3"></div>
        </div>

        <!-- Rating -->
        <div class="rating absolute top-4 right-4 flex items-center space-x-1">
          <div class="skeleton h-5 w-5 mr-1 rounded-full"></div>
          <div class="skeleton h-6 w-10 rounded"></div>
        </div>

        <!-- Actions -->
        <div class="absolute bottom-4 right-4 flex space-x-3">
          <div class="skeleton w-24 h-10 rounded-lg"></div>
          <div class="skeleton w-24 h-10 rounded-lg"></div>
          <div class="skeleton w-24 h-10 rounded-lg"></div>
        </div>
      </div>

      <!-- Tampilan jika tidak ada gedung -->
      <div v-else-if="cityHalls.length === 0" class="mt-6 p-8 bg-blue-100 rounded-xl text-center">
        <p class="text-lg text-gray-700">Belum ada data gedung. Silakan tambahkan gedung baru.</p>
      </div>

      <!-- Loop semua gedung yang tersedia -->
      <div v-else class="space-y-6 mt-6">
        <div
          v-for="cityHall in cityHalls"
          :key="cityHall.id"
          class="cardbox-gedung bg-blue-100 p-6 shadow-lg flex relative rounded-xl"
        >
          <!-- Gambar Gedung -->
          <img
            :src="cityHall.media[0]?.url || 'https://via.placeholder.com/150'"
            :alt="cityHall.name"
            class="w-48 h-32 object-cover rounded-lg"
          />

          <!-- Detail Gedung -->
          <div class="flex-1 pl-4">
            <h2 class="nama-gedung text-xl font-black text-black mb-1">{{ cityHall.name }}</h2>
            <p class="text-black mb-7">{{ cityHall.address }}</p>
            <!-- <p class="font-semibold text-black">
                            Rp{{ formatCurrency(getMinMaxPrice(cityHall.id).min) }} - Rp{{ formatCurrency(getMinMaxPrice(cityHall.id).max) }}
                        </p> -->
          </div>

          <!-- Rating -->
          <!-- <div class="rating absolute top-4 right-4 flex items-center space-x-1">
                        <img src="@/assets/star.png" alt="Rating" class="w-5 h-5 mr-1" />
                        <span class="text-gray-700 text-base font-semibold">8.1</span>
                    </div> -->

          <!-- Actions -->
          <div class="absolute bottom-4 right-4 flex space-x-3">
            <button
              @click="showCityHallDetail(cityHall.id)"
              class="action-button bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-1 hover-action-button"
            >
              <img src="@/assets/detail.png" alt="Detail" class="w-5 h-5" />
              <span>Detail</span>
            </button>
            <button
              @click="openEditModal(cityHall)"
              class="action-button bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-1 hover-action-button"
            >
              <img src="@/assets/edit.png" alt="Edit" class="w-5 h-5" />
              <span>Edit</span>
            </button>
            <button
              @click="openDeleteModal(cityHall)"
              class="action-button bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-1 hover-action-button"
            >
              <img src="@/assets/delete.png" alt="Hapus" class="w-5 h-5" />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Popup Detail -->
    <transition name="modal">
      <div
        v-if="showModal"
        class="detail-modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      >
        <div
          class="detail-modal-cardbox w-3/4 max-w-3xl rounded-2xl shadow-lg p-0 relative overflow-hidden"
        >
          <!-- Tombol Close di atas gambar -->
          <button
            @click="showModal = false"
            class="absolute top-4 right-4 text-white hover:text-gray-200 z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="4"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Loading Skeleton for the entire modal -->
          <template v-if="isLoadingDetail">
            <!-- Skeleton for Image -->
            <div class="relative w-full h-80 bg-gray-200 animate-pulse"></div>

            <!-- Skeleton for Content -->
            <div class="p-6">
              <div class="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-6 animate-pulse"></div>

              <!-- Tentang Gedung Skeleton -->
              <div class="bg-white p-4 rounded-lg mt-4 shadow-xl">
                <div class="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                <div class="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div class="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>

              <!-- Daftar Harga Sewa Skeleton -->
              <div class="bg-white p-4 rounded-xl mt-4 shadow-xl">
                <div class="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                <div class="border border-gray-300 rounded-lg p-4 mt-2">
                  <div class="h-6 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
                  <div class="h-8 bg-gray-200 rounded w-40 mb-3 animate-pulse"></div>
                  <div class="h-5 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <div class="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div class="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div class="h-8 bg-gray-200 rounded w-28 animate-pulse"></div>
                  </div>
                </div>
              </div>

              <!-- Ulasan Tamu Skeleton -->
              <div class="bg-white p-6 rounded-xl mt-4 shadow-xl">
                <div class="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                <div class="mt-3">
                  <div class="border rounded-lg overflow-hidden">
                    <div class="p-4">
                      <div class="flex items-start justify-between">
                        <div class="flex items-center space-x-3">
                          <div class="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                          <div>
                            <div class="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                            <div class="h-5 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
                            <div class="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                          </div>
                        </div>
                        <div class="flex items-center space-x-1 mr-4">
                          <div class="w-6 h-6 bg-gray-200 rounded-full mr-1 animate-pulse"></div>
                          <div class="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Actual Modal Content (when data is loaded) -->
          <template v-else>
            <!-- Konten Modal -->
            <div class="relative">
              <!-- Gambar Utama - Full Width -->
              <div class="relative w-full h-80">
                <img
                  :src="selectedCityHall?.media[0]?.url || 'https://via.placeholder.com/300x200'"
                  :alt="selectedCityHall?.name"
                  class="w-full h-80 object-cover"
                />
                <div
                  class="absolute inset-0 bg-black opacity-50 photo-overlay"
                  :style="{ opacity: isHoveringPhotoButton ? '0' : '0.5' }"
                ></div>
              </div>

              <!-- Tombol Lihat Semua Foto - tetap di tengah -->
              <div class="absolute inset-0 flex items-center justify-center">
                <button
                  @click="openPhotoSlideshow"
                  @mouseenter="handlePhotoButtonHover(true)"
                  @mouseleave="handlePhotoButtonHover(false)"
                  class="foto-button flex flex-col items-center"
                >
                  <div class="foto-icon-container">
                    <img src="@/assets/gallery.png" alt="Gallery" class="w-8 h-8" />
                  </div>
                  <span class="foto-text font-black">Lihat Semua Foto</span>
                </button>
              </div>

              <!-- Tombol Lihat di Maps - tetap di bawah kanan -->
              <div class="absolute bottom-4 right-4">
                <a
                  :href="getMapsUrl(selectedCityHall?.latitude, selectedCityHall?.longitude)"
                  target="_blank"
                  class="maps-button bg-white rounded-xl p-3 shadow-md flex flex-col items-center"
                >
                  <img src="@/assets/maps.png" alt="Maps" class="h-8" />
                  <span class="maps-text text-sm text-center font-black block mt-1"
                    >Lihat di Maps</span
                  >
                </a>
              </div>
            </div>

            <!-- Content di bawah gambar -->
            <div class="p-6">
              <h2 id="nama-gedung-detail" class="nama-gedung text-2xl font-black text-black mb-1">
                {{ selectedCityHall?.name }}
              </h2>
              <p class="text-black font-medium">{{ selectedCityHall?.address }}</p>

              <!-- Tentang Gedung -->
              <div class="bg-white p-4 rounded-lg mt-4 shadow-xl">
                <h3 class="font-bold text-black header-content">Tentang Gedung</h3>
                <p class="text-black mt-3 text-justify text-sm">
                  {{ selectedCityHall?.description }}
                </p>
              </div>

              <!-- Daftar Harga Sewa -->
              <div class="bg-white p-4 rounded-xl mt-4 shadow-xl">
                <h3 class="font-bold text-black header-content">Daftar Harga Sewa</h3>

                <div
                  v-for="price in selectedCityHall?.pricing"
                  :key="price.id"
                  class="border border-gray-300 rounded-lg p-4 mt-2"
                >
                  <span class="px-3 py-1 rounded-full text-black border border-black font-semibold">
                    {{ price.activity_type }}
                  </span>
                  <p class="text-black font-bold text-lg mt-2">
                    Rp{{ formatCurrency(price.price_per_day) }}/hari
                  </p>
                  <h4 class="text-gray-600 mt-2">Fasilitas</h4>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span
                      v-for="facility in price.facilities.split('; ')"
                      :key="facility"
                      class="facility-badge"
                    >
                      {{ facility }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Ulasan Tamu -->
              <div class="bg-white p-6 rounded-xl mt-4 shadow-xl">
                <h3 class="font-bold text-black header-content text-lg">Ulasan dari Tamu</h3>

                <!-- Skeleton Loader (Loading State) -->
                <div v-if="isLoadingReviews" class="mt-4">
                  <div class="skeleton h-24 w-full rounded-lg mb-4"></div>
                  <div class="skeleton h-24 w-full rounded-lg mb-4"></div>
                </div>

                <!-- Tidak ada review -->
                <div
                  v-else-if="reviews.length === 0"
                  class="p-4 text-center mt-3 border rounded-lg"
                >
                  <p class="text-gray-600">Belum ada ulasan untuk gedung ini.</p>
                </div>

                <!-- Review Cards -->
                <div v-else>
                  <div v-for="review in reviews" :key="review.id" class="mt-3">
                    <!-- Review Card -->
                    <div class="border rounded-lg overflow-hidden">
                      <!-- Review Content -->
                      <div class="p-4">
                        <div class="flex items-start justify-between">
                          <div class="flex items-center space-x-3">
                            <img
                              :src="
                                review.rent.renter.profile_picture ||
                                'https://via.placeholder.com/50'
                              "
                              alt="Profile Picture"
                              class="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <p class="text-gray-600 text-sm">
                                Diulas {{ formatReviewDate(review.created_at) }}
                              </p>
                              <p class="text-gray-800 font-bold">
                                {{ review.rent.renter.fullname }}
                              </p>
                              <p class="text-gray-600 text-sm">{{ review.comment }}</p>
                            </div>
                          </div>

                          <div class="flex items-center space-x-1 mr-4">
                            <img src="@/assets/star.png" alt="Rating" class="w-6 h-6 mr-1" />
                            <span class="text-black font-bold text-base"
                              >{{ review.rating }}/5</span
                            >
                          </div>
                        </div>

                        <!-- Foto review -->
                        <div
                          v-if="review.review_media && review.review_media.length > 0"
                          class="mt-3 flex space-x-2 overflow-x-auto py-2"
                        >
                          <img
                            v-for="(media, mediaIndex) in review.review_media"
                            :key="media.id"
                            :src="media.url"
                            class="h-24 w-32 object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                            alt="Review Image"
                            @click="openReviewPhotoSlideshow(review, mediaIndex)"
                          />
                        </div>

                        <!-- Review Reply Button - Only show if no reply exists -->
                        <div v-if="!review.review_reply" class="mt-3 flex justify-end">
                          <button
                            @click="toggleReplyForm(review.id)"
                            class="text-blue-500 hover:text-blue-700 text-sm font-medium"
                          >
                            Balas
                          </button>
                        </div>

                        <!-- Reply Form -->
                        <div v-if="activeReplyId === review.id" class="mt-3 border-t pt-3">
                          <textarea
                            v-model="replyText"
                            rows="2"
                            class="w-full p-2 border border-gray-300 rounded-lg text-gray-600"
                            placeholder="Tulis balasan Anda..."
                          ></textarea>
                          <div class="flex justify-end space-x-2 mt-2">
                            <button
                              @click="toggleReplyForm(review.id)"
                              class="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                            >
                              Batal
                            </button>
                            <button
                              @click="submitReply(review.rent.id, review.id)"
                              class="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center"
                              :disabled="isSubmittingReply"
                            >
                              <svg
                                v-if="isSubmittingReply"
                                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                              {{ isSubmittingReply ? 'Mengirim...' : 'Kirim Balasan' }}
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Admin Reply (if exists) -->
                      <div v-if="review.review_reply" class="bg-gray-50 p-4 border-t">
                        <div class="flex items-start space-x-3">
                          <!-- Admin Icon -->
                          <div class="bg-blue-100 text-blue-800 p-2 rounded-full">
                            <svg
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>

                          <!-- Admin Reply Content -->
                          <div class="flex-1">
                            <div class="flex items-center space-x-2">
                              <!-- Admin Name - Dynamic from API -->
                              <p class="font-semibold text-black">
                                {{ getAdminName(review.review_reply.adminId) }}
                              </p>
                              <p class="text-gray-500 text-xs">
                                {{ formatReviewDate(review.review_reply.createdAt) }}
                              </p>
                              <p
                                v-if="
                                  review.review_reply.updatedAt !== review.review_reply.createdAt
                                "
                                class="text-gray-500 text-xs italic"
                              >
                                (diubah)
                              </p>
                            </div>

                            <!-- Normal display of reply -->
                            <p v-if="activeEditReplyId !== review.id" class="text-gray-700 mt-1">
                              {{ review.review_reply.comment }}
                            </p>

                            <!-- Edit reply form -->
                            <div v-else class="mt-2">
                              <textarea
                                v-model="editReplyText"
                                rows="3"
                                class="w-full p-2 border border-gray-300 rounded-lg text-gray-600"
                                placeholder="Edit balasan Anda..."
                              ></textarea>
                              <div class="flex justify-end space-x-2 mt-2">
                                <button
                                  @click="cancelEditReply"
                                  class="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                                >
                                  Batal
                                </button>
                                <button
                                  @click="
                                    updateReply(review.rent.id, review.id, review.review_reply.id)
                                  "
                                  class="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center"
                                  :disabled="isUpdatingReply"
                                >
                                  <svg
                                    v-if="isUpdatingReply"
                                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                  {{ isUpdatingReply ? 'Menyimpan...' : 'Simpan Perubahan' }}
                                </button>
                              </div>
                            </div>
                          </div>

                          <!-- Action Buttons (Edit & Delete) -->
                          <div v-if="activeEditReplyId !== review.id" class="flex space-x-2">
                            <!-- Edit Button -->
                            <button
                              @click="showEditReplyForm(review)"
                              class="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                              title="Edit balasan"
                            >
                              <svg
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>

                            <!-- Delete Button -->
                            <button
                              v-if="isConfirmingReplyDelete !== review.id"
                              @click="confirmDeleteReply(review.id)"
                              class="text-gray-400 hover:text-red-600 transition-colors duration-200"
                              title="Hapus balasan"
                            >
                              <svg
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>

                            <!-- Confirmation Buttons -->
                            <div v-else class="flex space-x-1">
                              <!-- Indikator spinner ketika delete -->
                              <div v-if="isDeletingReply" class="flex items-center">
                                <svg
                                  class="animate-spin h-5 w-5 text-red-500"
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
                              </div>
                              <button
                                v-else
                                @click="deleteReply(review.rent.id, review.id)"
                                class="text-red-500 hover:text-red-700 text-xs font-medium"
                                title="Konfirmasi hapus"
                              >
                                <svg
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </button>
                              <button
                                @click="cancelDeleteReply()"
                                class="text-gray-500 hover:text-gray-700 text-xs font-medium"
                                title="Batal hapus"
                                :disabled="isDeletingReply"
                              >
                                <svg
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
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </transition>

    <!-- Photo Slideshow Modal -->
    <transition name="modal">
      <div
        v-if="showSlideshow"
        class="photo-slideshow fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      >
        <!-- Container utama diperlebar untuk memberi ruang bagi tombol navigasi -->
        <div class="relative w-full max-w-6xl px-16">
          <div class="relative w-full flex justify-center">
            <!-- Container untuk foto dan tombol close -->
            <div class="relative max-w-4xl">
              <!-- Tombol Close - sekarang di pojok kanan atas foto -->
              <button
                @click="showSlideshow = false"
                class="absolute top-3 right-3 z-20 bg-black bg-opacity-50 text-white hover:text-gray-200 p-2 rounded-full"
              >
                <svg
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <!-- Main Slideshow Image -->
              <img
                :src="selectedCityHall?.media[currentSlideIndex]?.url"
                :alt="selectedCityHall?.name"
                class="max-w-4xl max-h-[70vh] object-contain"
              />
            </div>

            <!-- Slide Counter di bawah foto -->
            <div
              class="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full"
            >
              {{ currentSlideIndex + 1 }} / {{ selectedCityHall?.media.length }}
            </div>
          </div>

          <!-- Navigation Arrows - di luar foto -->
          <button
            @click="prevSlide"
            class="navigation-button text-black absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl"
            :disabled="currentSlideIndex === 0"
            :class="{ 'opacity-50 cursor-not-allowed': currentSlideIndex === 0 }"
          >
            ◀
          </button>

          <button
            @click="nextSlide"
            class="navigation-button text-black absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl"
            :disabled="currentSlideIndex === selectedCityHall?.media.length - 1"
            :class="{
              'opacity-50 cursor-not-allowed':
                currentSlideIndex === selectedCityHall?.media.length - 1,
            }"
          >
            ▶
          </button>
        </div>
      </div>
    </transition>

    <!-- Modal slideshot foto ulasan -->
    <transition name="modal">
      <div
        v-if="showReviewSlideshow"
        class="photo-slideshow fixed inset-0 flex items-center justify-center z-50"
      >
        <!-- Overlay hitam sebagai background -->
        <div class="absolute inset-0 bg-black bg-opacity-75"></div>

        <!-- Container utama dengan tombol close di luar container foto -->
        <div class="relative w-full h-full max-w-5xl max-h-screen p-4 flex flex-col">
          <!-- Tombol Close - di pojok kanan atas, tidak terikat pada foto -->
          <button
            @click="showReviewSlideshow = false"
            class="absolute top-4 right-4 z-30 bg-black bg-opacity-50 text-white hover:text-gray-200 p-2 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Container untuk foto yang dibatasi ukurannya -->
          <div class="flex-1 flex items-center justify-center mt-8 mb-12 overflow-hidden">
            <img
              :src="selectedReview?.review_media[currentReviewSlideIndex]?.url"
              :alt="'Foto ulasan dari ' + selectedReview?.rent.renter.fullname"
              class="max-w-full max-h-full object-contain"
            />
          </div>

          <!-- Navigasi dan counter foto -->
          <div class="flex justify-between items-center w-full px-4">
            <!-- Previous Button -->
            <button
              @click="prevReviewSlide"
              class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20"
              :disabled="currentReviewSlideIndex === 0"
              :class="{ 'opacity-50 cursor-not-allowed': currentReviewSlideIndex === 0 }"
            >
              ◀
            </button>

            <!-- Counter foto -->
            <div class="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full z-20">
              {{ currentReviewSlideIndex + 1 }} / {{ selectedReview?.review_media.length }}
            </div>

            <!-- Next Button -->
            <button
              @click="nextReviewSlide"
              class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20"
              :disabled="currentReviewSlideIndex === selectedReview?.review_media.length - 1"
              :class="{
                'opacity-50 cursor-not-allowed':
                  currentReviewSlideIndex === selectedReview?.review_media.length - 1,
              }"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Konfirmasi Hapus -->
    <transition name="modal">
      <div
        v-if="showDeleteModal"
        class="detail-modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40"
      >
        <div
          class="detail-modal-cardbox w-3/4 max-w-2xl rounded-2xl shadow-lg p-6 relative overflow-hidden"
        >
          <h2 class="data-gedung-text text-2xl font-black text-center text-black mb-6">
            Hapus Data Gedung Nasional?
          </h2>

          <div class="flex justify-center items-center">
            <!-- Gambar Gedung -->
            <div class="w-1/2 pr-4">
              <img
                :src="deleteCityHall?.media[0]?.url || 'https://via.placeholder.com/150'"
                :alt="deleteCityHall?.name"
                class="object-cover rounded-xl"
              />
            </div>

            <!-- Detail Gedung -->
            <div class="w-1/3">
              <h3 class="data-gedung-text text-xl font-bold text-black">
                {{ deleteCityHall?.name }}
              </h3>
              <p class="text-black mt-2">{{ deleteCityHall?.address }}</p>
            </div>
          </div>

          <!-- Tombol Aksi -->
          <div class="flex justify-center space-x-4 mt-8">
            <button
              @click="deleteConfirm"
              :disabled="isDeletingCityHall"
              class="font-semibold bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              <svg
                v-if="isDeletingCityHall"
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
              <span>{{ isDeletingCityHall ? 'Menghapus...' : 'Ya, Hapus' }}</span>
            </button>
            <button
              @click="closeDeleteModal"
              :disabled="isDeletingCityHall"
              class="font-semibold bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Tambah Gedung Nasional -->
    <transition name="modal">
      <div
        v-if="showCreateModal"
        class="detail-modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40"
      >
        <div
          class="detail-modal-cardbox w-4/5 max-w-4xl rounded-2xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
        >
          <h2 class="data-gedung-text text-2xl font-black text-center text-black mb-6">
            Tambah Gedung Nasional
          </h2>

          <!-- Tombol Close -->
          <button
            @click="closeCreateModal"
            class="absolute top-4 right-4 text-gray-800 hover:text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <form @submit.prevent="submitCreateForm">
            <!-- Photo upload section -->
            <div class="mb-6 text-center">
              <div
                class="relative w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-2"
              >
                <div
                  v-if="uploadedPhotos.length === 0"
                  class="text-center cursor-pointer"
                  @click="$refs.photoUploadInput.click()"
                >
                  <div
                    class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div class="text-black font-bold data-gedung-text">Tambah Foto</div>
                </div>

                <!-- Photo previews -->
                <div v-else class="flex overflow-x-auto p-2 w-full h-full">
                  <div
                    v-for="(photo, index) in uploadedPhotos"
                    :key="index"
                    class="relative flex-shrink-0 w-32 h-32 mr-2"
                  >
                    <img
                      :src="photo.preview"
                      class="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      @click="openCreatePhotoSlideshow(index)"
                    />
                    <button
                      type="button"
                      @click.stop="removePhoto(index)"
                      class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <!-- Add more photos button -->
                  <div
                    class="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                    @click="$refs.photoUploadInput.click()"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>

                <input
                  id="photoUpload"
                  ref="photoUploadInput"
                  type="file"
                  class="hidden"
                  @change="handlePhotoUpload"
                  accept="image/*"
                  multiple
                />
              </div>
              <!-- Photo error message -->
              <p v-if="photoError" class="text-red-500 text-sm mt-1">
                {{ photoError }}
              </p>
            </div>

            <!-- Basic Information -->
            <div class="space-y-4">
              <!-- Nama Gedung -->
              <div>
                <label for="buildingName" class="block text-black data-gedung-text font-bold mb-1"
                  >Nama Gedung</label
                >
                <input
                  id="buildingName"
                  v-model="newCityHall.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama gedung"
                />
              </div>

              <!-- Tentang Gedung (deskripsi) -->
              <div>
                <label for="description" class="block text-black data-gedung-text font-bold mb-1"
                  >Tentang Gedung</label
                >
                <textarea
                  id="description"
                  v-model="newCityHall.description"
                  rows="4"
                  required
                  class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-500': descriptionError }"
                  placeholder="Deskripsi tentang gedung"
                  @input="validateDescription"
                ></textarea>
                <p v-if="descriptionError" class="text-red-500 text-sm mt-1">
                  {{ descriptionError }}
                </p>
                <p v-else class="text-gray-500 text-sm mt-1">
                  {{ newCityHall.description.length }} / minimum 10 karakter
                </p>
              </div>

              <!-- Luas Bangunan dan Kapasitas Orang (dalam satu baris) -->
              <div class="flex space-x-4">
                <div class="w-1/2">
                  <label for="area" class="block text-black data-gedung-text font-bold mb-1"
                    >Luas Bangunan (m²)</label
                  >
                  <input
                    id="area"
                    v-model="newCityHall.area_m2"
                    type="text"
                    required
                    class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': areaMError }"
                    placeholder="Contoh: 250"
                    @input="preventLeadingZero($event, 'area_m2')"
                  />
                  <p v-if="areaMError" class="text-red-500 text-sm mt-1">
                    {{ areaMError }}
                  </p>
                </div>
                <div class="w-1/2">
                  <label for="capacity" class="block text-black data-gedung-text font-bold mb-1"
                    >Kapasitas Orang</label
                  >
                  <input
                    id="capacity"
                    v-model="newCityHall.people_capacity"
                    type="text"
                    required
                    class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': capacityError }"
                    placeholder="Contoh: 100"
                    @input="preventLeadingZero($event, 'people_capacity')"
                  />
                  <p v-if="capacityError" class="text-red-500 text-sm mt-1">
                    {{ capacityError }}
                  </p>
                </div>
              </div>

              <!-- Contact Person -->
              <div>
                <label for="contactPerson" class="block text-black data-gedung-text font-bold mb-1"
                  >Contact Person</label
                >
                <input
                  id="contactPerson"
                  v-model="newCityHall.contact_person"
                  type="text"
                  required
                  class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-red-500': contactError }"
                  placeholder="Contoh: 081234567890"
                  @input="preventLeadingZero($event, 'contact_person')"
                />
              </div>

              <!-- Koordinat Maps -->
              <div>
                <label class="block text-black data-gedung-text font-bold mb-1">Lokasi</label>
                <div class="mb-2">
                  <div class="flex">
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Ketikkan lokasi atau pilih dari peta"
                      class="w-full px-3 py-2 border text-black border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      @keyup.enter="searchLocation"
                    />
                    <button
                      type="button"
                      @click="searchLocation"
                      class="px-4 py-2 bg-blue-500 data-gedung-text font-bold text-white rounded-r-lg hover:bg-blue-600"
                    >
                      Cari
                    </button>
                  </div>
                  <p v-if="searchError" class="text-red-500 text-sm mt-1">{{ searchError }}</p>
                </div>
                <div class="border border-gray-300 rounded-lg overflow-hidden h-48">
                  <div id="map" class="w-full h-full"></div>
                </div>
                <div class="flex space-x-4 mt-2 text-sm text-gray-500">
                  <p hidden>Latitude: {{ newCityHall.latitude }}</p>
                  <p hidden>Longitude: {{ newCityHall.longitude }}</p>
                </div>
              </div>

              <!-- Alamat -->
              <div>
                <label for="address" class="block text-black data-gedung-text font-bold mb-1"
                  >Alamat</label
                >
                <input
                  id="address"
                  v-model="newCityHall.address"
                  type="text"
                  required
                  class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan alamat lengkap"
                />
              </div>

              <!-- Kategori Sewa -->
              <div>
                <label class="block text-black data-gedung-text font-bold mb-2"
                  >Kategori Sewa</label
                >

                <div
                  v-for="(price, index) in newCityHall.pricing"
                  :key="index"
                  class="bg-white p-4 rounded-lg border border-gray-300 mb-4"
                >
                  <div class="flex justify-between items-center mb-2">
                    <h4 class="font-bold text-black data-gedung-text">Kategori {{ index + 1 }}</h4>
                    <button
                      v-if="newCityHall.pricing.length > 1"
                      type="button"
                      @click="removePricing(index)"
                      class="text-red-500 hover:text-red-700"
                    >
                      <svg
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <div class="space-y-3">
                    <div>
                      <label
                        :for="`category-${index}`"
                        class="block text-black data-gedung-text font-bold mb-1"
                        >Jenis Kegiatan</label
                      >
                      <input
                        :id="`category-${index}`"
                        v-model="price.activity_type"
                        type="text"
                        required
                        class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Contoh: Komersial, Sosial, dll."
                      />
                    </div>

                    <div>
                      <label
                        :for="`price-${index}`"
                        class="block text-black data-gedung-text font-bold mb-1"
                        >Harga Sewa Per Hari (Rp)</label
                      >
                      <input
                        :id="`price-${index}`"
                        type="text"
                        required
                        class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Contoh: 500.000"
                        :value="formatRupiah(price.price_per_day)"
                        @input="handlePriceInput($event, index)"
                      />
                    </div>

                    <div>
                      <label
                        :for="`facilities-${index}`"
                        class="block text-black data-gedung-text font-bold mb-1"
                        >Fasilitas</label
                      >
                      <div class="flex">
                        <input
                          :id="`facility-input-${index}`"
                          v-model="facilityInputs[index]"
                          type="text"
                          class="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 text-black focus:ring-blue-500"
                          placeholder="Tambahkan fasilitas"
                          @keyup.enter="addFacility(index)"
                        />
                        <button
                          type="button"
                          @click="addFacility(index)"
                          class="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 font-semibold data-gedung-text"
                        >
                          + Tambah
                        </button>
                      </div>
                    </div>

                    <!-- Display Facilities -->
                    <div v-if="price.facilities" class="flex flex-wrap gap-2 mt-2">
                      <span
                        v-for="(facility, facilityIndex) in price.facilities.split('; ')"
                        :key="`${index}-${facilityIndex}`"
                        class="bg-gray-300 text-black px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {{ facility }}
                        <button
                          type="button"
                          @click="removeFacility(index, facilityIndex)"
                          class="ml-2 text-black hover:text-black"
                        >
                          ×
                        </button>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Add Another Category Button -->
                <button
                  type="button"
                  @click="addPricing"
                  class="mt-3 data-gedung-text font-bold w-full py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Tambah Kategori Sewa
                </button>
              </div>
            </div>

            <!-- Form Action Buttons -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeCreateModal"
                class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold data-gedung-text"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center font-semibold data-gedung-text"
                :disabled="isSubmitting"
              >
                <svg
                  v-if="isSubmitting"
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Gedung' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal Edit Gedung Nasional -->
    <transition name="modal">
      <div
        v-if="showEditModal"
        class="detail-modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40"
      >
        <div
          class="detail-modal-cardbox w-4/5 max-w-4xl rounded-2xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
        >
          <h2 class="data-gedung-text text-2xl font-black text-center text-black mb-6">
            Edit Gedung Nasional
          </h2>

          <!-- Tombol Close -->
          <button
            @click="closeEditModal"
            class="absolute top-4 right-4 text-gray-800 hover:text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <form @submit.prevent="submitEditForm">
            <!-- Photo upload section -->
            <div class="mb-6 text-center">
              <div
                class="relative w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-2"
              >
                <div
                  v-if="editedPhotos.length === 0"
                  class="text-center cursor-pointer"
                  @click="$refs.photoEditUploadInput.click()"
                >
                  <div
                    class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div class="text-black font-bold data-gedung-text">Tambah Foto</div>
                </div>

                <!-- Photo previews -->
                <div v-else class="flex overflow-x-auto p-2 w-full h-full">
                  <div
                    v-for="(photo, index) in editedPhotos"
                    :key="index"
                    class="relative flex-shrink-0 w-32 h-32 mr-2"
                  >
                    <img
                      :src="photo.preview"
                      class="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      @click="openEditPhotoSlideshow(index)"
                    />
                    <button
                      type="button"
                      @click.stop="removeEditPhoto(index)"
                      class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <!-- Add more photos button -->
                  <div
                    class="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                    @click="$refs.photoEditUploadInput.click()"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>

                <input
                  id="photoEditUpload"
                  ref="photoEditUploadInput"
                  type="file"
                  class="hidden"
                  @change="handleEditPhotoUpload"
                  accept="image/*"
                  multiple
                />
              </div>
            </div>

            <!-- Basic Information -->
            <div class="space-y-4">
              <!-- Nama Gedung -->
              <div>
                <label for="editBuildingName" class="block font-semibold text-black"
                  >Nama Gedung</label
                >
                <input
                  id="editBuildingName"
                  v-model="editCityHall.name"
                  type="text"
                  required
                  class="text-black w-full p-3 border border-gray-300 rounded-lg mt-1"
                  placeholder="Masukkan nama gedung"
                />
              </div>

              <!-- Alamat -->
              <div>
                <label for="editAddress" class="block font-semibold text-black">Alamat</label>
                <input
                  id="editAddress"
                  v-model="editCityHall.address"
                  type="text"
                  required
                  class="text-black w-full p-3 border border-gray-300 rounded-lg mt-1"
                  placeholder="Masukkan alamat lengkap"
                />
              </div>

              <!-- Tentang Gedung (deskripsi) -->
              <div>
                <label for="editDescription" class="block font-semibold text-black"
                  >Tentang Gedung</label
                >
                <textarea
                  id="editDescription"
                  v-model="editCityHall.description"
                  rows="4"
                  required
                  class="text-black w-full p-3 border border-gray-300 rounded-lg mt-1"
                  :class="{ 'border-red-500': descriptionError }"
                  placeholder="Deskripsi tentang gedung"
                  @input="validateDescription"
                ></textarea>
                <p v-if="descriptionError" class="text-red-500 text-sm mt-1">
                  {{ descriptionError }}
                </p>
                <p v-else class="text-gray-500 text-sm mt-1">
                  {{ editCityHall.description.length }} / minimum 10 karakter
                </p>
              </div>

              <!-- Luas Bangunan dan Kapasitas Orang (dalam satu baris) -->
              <div class="flex space-x-4">
                <div class="w-1/2">
                  <label for="editArea" class="block font-semibold text-black">Luas Bangunan</label>
                  <div class="flex">
                    <input
                      id="editArea"
                      v-model="editCityHall.area_m2"
                      type="text"
                      required
                      class="text-black w-full p-3 border border-gray-300 rounded-l-lg mt-1"
                      placeholder="Luas"
                      @input="preventEditLeadingZero($event, 'area_m2')"
                    />
                    <span
                      class="inline-flex items-center px-3 border border-l-0 border-gray-300 rounded-r-lg mt-1 bg-gray-100 text-gray-600"
                    >
                      m²
                    </span>
                  </div>
                </div>
                <div class="w-1/2">
                  <label for="editCapacity" class="block font-semibold text-black"
                    >Kapasitas Orang</label
                  >
                  <div class="flex">
                    <input
                      id="editCapacity"
                      v-model="editCityHall.people_capacity"
                      type="text"
                      required
                      class="text-black w-full p-3 border border-gray-300 rounded-l-lg mt-1"
                      placeholder="Kapasitas"
                      @input="preventEditLeadingZero($event, 'people_capacity')"
                    />
                    <span
                      class="inline-flex items-center px-3 border border-l-0 border-gray-300 rounded-r-lg mt-1 bg-gray-100 text-gray-600"
                    >
                      orang
                    </span>
                  </div>
                </div>
              </div>

              <!-- Contact Person -->
              <div>
                <label for="editContactPerson" class="block font-semibold text-black"
                  >Contact Person</label
                >
                <input
                  id="editContactPerson"
                  v-model="editCityHall.contact_person"
                  type="text"
                  required
                  class="text-black w-full p-3 border border-gray-300 rounded-lg mt-1"
                  placeholder="Nomor telepon contact person"
                  @input="preventEditLeadingZero($event, 'contact_person')"
                />
              </div>

              <!-- Koordinat Maps -->
              <div>
                <label class="block font-semibold text-black mb-2">Koordinat Maps</label>
                <div class="mb-2">
                  <div class="flex">
                    <input
                      v-model="editSearchQuery"
                      type="text"
                      placeholder="Ketikkan lokasi atau pilih dari peta"
                      class="text-black w-full p-3 border border-gray-300 rounded-l-lg"
                      @keyup.enter="searchEditLocation"
                    />
                    <button
                      type="button"
                      @click="searchEditLocation"
                      class="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-700"
                    >
                      Cari
                    </button>
                  </div>
                  <p v-if="editSearchError" class="text-red-500 text-sm mt-1">
                    {{ editSearchError }}
                  </p>
                </div>
                <div class="border border-gray-300 rounded-lg overflow-hidden h-64">
                  <div id="editMap" class="w-full h-full"></div>
                </div>
                <div class="flex space-x-4 mt-2">
                  <div class="hidden">
                    <input id="editLatitude" v-model="editCityHall.latitude" type="text" required />
                    <input
                      id="editLongitude"
                      v-model="editCityHall.longitude"
                      type="text"
                      required
                    />
                  </div>
                </div>
              </div>

              <!-- Kategori Sewa -->
              <div>
                <label class="block font-semibold text-black mb-2">Kategori Sewa</label>

                <div
                  v-for="(price, index) in editCityHall.pricing"
                  :key="index"
                  class="bg-white p-4 rounded-lg border border-gray-300 mb-4"
                >
                  <div class="flex justify-between items-center mb-2">
                    <h4 class="font-semibold text-black">Kategori {{ index + 1 }}</h4>
                    <button
                      v-if="editCityHall.pricing.length > 1"
                      type="button"
                      @click="removeEditPricing(index)"
                      class="text-red-500 hover:text-red-700"
                    >
                      <svg
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <div class="space-y-3">
                    <div>
                      <label :for="`edit-category-${index}`" class="block text-sm text-gray-600"
                        >Jenis Kegiatan</label
                      >
                      <input
                        :id="`edit-category-${index}`"
                        v-model="price.activity_type"
                        type="text"
                        required
                        class="text-black w-full p-2 border border-gray-300 rounded-lg mt-1"
                        placeholder="Contoh: Komersial, Sosial, dll."
                      />
                    </div>

                    <div>
                      <label :for="`edit-price-${index}`" class="block text-sm text-gray-600"
                        >Harga Sewa Per Hari</label
                      >
                      <div class="flex">
                        <span
                          class="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg mt-1 bg-gray-100 text-gray-600"
                        >
                          Rp
                        </span>
                        <input
                          :id="`edit-price-${index}`"
                          type="text"
                          required
                          class="text-black w-full p-2 border border-gray-300 rounded-r-lg mt-1"
                          placeholder="Contoh: 500.000"
                          :value="formatRupiah(price.price_per_day)"
                          @input="handleEditPriceInput($event, index)"
                        />
                      </div>
                    </div>

                    <div>
                      <label :for="`edit-facilities-${index}`" class="block text-sm text-gray-600"
                        >Fasilitas</label
                      >
                      <div class="flex">
                        <input
                          :id="`edit-facility-input-${index}`"
                          v-model="editFacilityInputs[index]"
                          type="text"
                          class="text-black w-full p-2 border border-gray-300 rounded-l-lg mt-1"
                          placeholder="Tambahkan fasilitas"
                        />
                        <button
                          type="button"
                          @click="addEditFacility(index)"
                          class="px-3 py-2 bg-blue-500 text-white rounded-r-lg mt-1 hover:bg-blue-700"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>

                    <!-- Display Facilities -->
                    <div v-if="price.facilities" class="flex flex-wrap gap-2 mt-2">
                      <div
                        v-for="(facility, facilityIndex) in price.facilities.split('; ')"
                        :key="`${index}-${facilityIndex}`"
                        class="facility-badge flex items-center"
                      >
                        <span>{{ facility }}</span>
                        <button
                          type="button"
                          @click="removeEditFacility(index, facilityIndex)"
                          class="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Add Another Category Button -->
                <button
                  type="button"
                  @click="addEditPricing"
                  class="mt-2 w-full py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold hover:bg-blue-200 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Tambah Kategori Sewa
                </button>
              </div>
            </div>

            <!-- Form Action Buttons -->
            <div class="flex justify-center space-x-4 mt-8">
              <button
                type="submit"
                class="font-semibold bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
              <button
                type="button"
                @click="closeEditModal"
                class="font-semibold bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-700"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal Slideshow Foto Form Tambah -->
    <transition name="modal">
      <div
        v-if="showCreatePhotoSlideshow"
        class="photo-slideshow fixed inset-0 flex items-center justify-center z-50"
      >
        <!-- Overlay hitam sebagai background -->
        <div class="absolute inset-0 bg-black bg-opacity-75"></div>

        <!-- Container utama dengan tombol close di luar container foto -->
        <div class="relative w-full h-full max-w-5xl max-h-screen p-4 flex flex-col">
          <!-- Tombol Close - di pojok kanan atas -->
          <button
            @click="showCreatePhotoSlideshow = false"
            class="absolute top-4 right-4 z-30 bg-black bg-opacity-50 text-white hover:text-gray-200 p-2 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Container untuk foto yang dibatasi ukurannya -->
          <div class="flex-1 flex items-center justify-center mt-8 mb-12 overflow-hidden">
            <img
              :src="uploadedPhotos[currentPhotoIndex]?.preview"
              alt="Preview foto gedung nasional"
              class="max-w-full max-h-full object-contain"
            />
          </div>

          <!-- Navigasi dan counter foto -->
          <div class="flex justify-between items-center w-full px-4">
            <!-- Previous Button -->
            <button
              @click="prevPhoto"
              class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20"
              :disabled="currentPhotoIndex === 0"
              :class="{ 'opacity-50 cursor-not-allowed': currentPhotoIndex === 0 }"
            >
              ◀
            </button>

            <!-- Counter foto -->
            <div class="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full z-20">
              {{ currentPhotoIndex + 1 }} / {{ uploadedPhotos.length }}
            </div>

            <!-- Next Button -->
            <button
              @click="nextPhoto"
              class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20"
              :disabled="currentPhotoIndex === uploadedPhotos.length - 1"
              :class="{
                'opacity-50 cursor-not-allowed': currentPhotoIndex === uploadedPhotos.length - 1,
              }"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Slideshow Foto Form Edit -->
    <transition name="modal">
      <div
        v-if="showEditPhotoSlideshow"
        class="photo-slideshow fixed inset-0 flex items-center justify-center z-50"
      >
        <!-- Overlay hitam sebagai background -->
        <div class="absolute inset-0 bg-black bg-opacity-75"></div>

        <!-- Container utama dengan tombol close di luar container foto -->
        <div class="relative w-full h-full max-w-5xl max-h-screen p-4 flex flex-col">
          <!-- Tombol Close - di pojok kanan atas -->
          <button
            @click="showEditPhotoSlideshow = false"
            class="absolute top-4 right-4 z-30 bg-black bg-opacity-50 text-white hover:text-gray-200 p-2 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Container untuk foto yang dibatasi ukurannya -->
          <div class="flex-1 flex items-center justify-center mt-8 mb-12 overflow-hidden">
            <img
              :src="editedPhotos[currentEditPhotoIndex]?.preview"
              alt="Preview foto gedung nasional"
              class="max-w-full max-h-full object-contain"
            />
          </div>

          <!-- Navigasi dan counter foto -->
          <div class="flex justify-between items-center w-full px-4">
            <!-- Previous Button -->
            <button
              @click="prevEditPhoto"
              class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20"
              :disabled="currentEditPhotoIndex === 0"
              :class="{ 'opacity-50 cursor-not-allowed': currentEditPhotoIndex === 0 }"
            >
              ◀
            </button>

            <!-- Counter foto -->
            <div class="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full z-20">
              {{ currentEditPhotoIndex + 1 }} / {{ editedPhotos.length }}
            </div>

            <!-- Next Button -->
            <button
              @click="nextEditPhoto"
              class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20"
              :disabled="currentEditPhotoIndex === editedPhotos.length - 1"
              :class="{
                'opacity-50 cursor-not-allowed': currentEditPhotoIndex === editedPhotos.length - 1,
              }"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'
import apiService from '@/services/apiService'
import Navigation from '@/components/Navigation.vue'

export default {
  name: 'DataGedungNasionalView',
  components: { Navigation },
  inject: ['showToast'],
  data() {
    return {
      // Validation state
      descriptionError: '',
      addressError: '',
      photoError: '',
      areaMError: '',
      capacityError: '',
      contactError: '',
      coordinateError: '',
      pricingErrors: [], // Array untuk error setiap pricing

      showModal: false,
      showSlideshow: false,
      showCreatePhotoSlideshow: false, // State untuk slideshow foto form tambah
      showEditPhotoSlideshow: false, // State untuk slideshow foto form edit
      showDeleteModal: false, // State untuk modal konfirmasi hapus
      showCreateModal: false, // State untuk modal tambah gedung
      showEditModal: false, // State untuk modal edit gedung
      isDeletingCityHall: false, // State loading untuk hapus gedung
      deletingCityHallId: null, // Track which city hall is being deleted
      cityHalls: [], // Array semua gedung (diubah dari cityHall menjadi cityHalls)
      currentSlideIndex: 0, // index slide foto gedung nasional
      currentPhotoIndex: 0, // index slide foto preview upload
      currentEditPhotoIndex: 0, // index slide foto preview edit
      searchQuery: '', // query pencarian pada form maps
      editSearchQuery: '', // query pencarian pada form maps untuk edit modal
      searchError: null, // error message saat pencarian maps
      editSearchError: null, // error message saat pencarian maps untuk edit modal
      searchResults: [], // hasil pencarian maps
      isHoveringPhotoButton: false, // state hover tombol foto
      reviews: [], // Array untuk review gedung
      admins: {}, // Object untuk data admin
      isLoadingAdmins: false, // state loading saat fetch data admin
      selectedCityHall: null, // gedung yang dipilih untuk detail
      deleteCityHall: null, // gedung yang akan dihapus
      isLoadingDetail: false, // state loading saat fetch detail gedung
      isConfirmingReplyDelete: null, // konfirmasi review yang akan dihapus
      activeReplyId: null, // id ulasan yang akan di reply
      replyText: '', // initial state isi form reply ulasan
      isSubmittingReply: false, // State submit reply
      activeEditReplyId: null, // id ulasan review yang akan diedit
      editReplyText: '', // intial state isian form edit reply ulasan
      isEditingReply: false, // initial state edit reply
      isUpdatingReply: false, // loading state update reply
      isDeletingReply: false, // loading state menghapus reply
      showReviewsSlideshow: false, // state untuk slideshow foto review
      selectedReview: null, // initial state review yang dipilih untuk lihat foto ulasannya
      currentReviewSlideIndex: 0, // index foto review yang aktif
      isLoading: true, // state skeleton loader
      isSubmitting: false, // state untuk loading saat submit
      map: null, // OpenStreetMap object
      marker: null, // Map marker
      editMap: null, // OpenStreetMap object untuk edit
      editMarker: null, // Map marker untuk edit

      // Data untuk gedung baru
      newCityHall: {
        name: '',
        description: '',
        area_m2: '',
        people_capacity: '',
        address: '',
        latitude: '',
        longitude: '',
        contact_person: '',
        status: 'tersedia', // Default value
        pricing: [
          {
            activity_type: '',
            facilities: '',
            price_per_day: '',
          },
        ],
      },
      // Data untuk edit gedung
      editCityHall: {
        id: '',
        name: '',
        description: '',
        area_m2: '',
        people_capacity: '',
        address: '',
        latitude: '',
        longitude: '',
        contact_person: '',
        status: 'tersedia',
        pricing: [],
      },
      uploadedPhotos: [], // Array untuk menyimpan file foto yang diupload
      editedPhotos: [], // Array untuk menyimpan file foto yang diupload pada edit
      facilityInputs: [''], // Input untuk fasilitas
      editFacilityInputs: [''], // Input untuk fasilitas pada edit
    }
  },
  computed: {
    // Ubah cara menghitung min dan max price karena sekarang bekerja dengan array gedung
    minMaxPrices() {
      // Mengembalikan objek berisi minPrice dan maxPrice untuk setiap gedung
      return this.cityHalls.map((cityHall) => {
        const min =
          cityHall.pricing?.reduce(
            (min, p) => (p.price_per_day < min ? p.price_per_day : min),
            Infinity,
          ) || 0
        const max = cityHall.pricing?.reduce(
          (max, p) => (p.price_per_day > max ? p.price_per_day : max),
          0,
        )
        return { id: cityHall.id, minPrice: min, maxPrice: max }
      })
    },
  },
  methods: {
    // Validation methods
    validateDescription() {
      // Check both newCityHall and editCityHall
      const description = this.showCreateModal
        ? this.newCityHall.description
        : this.editCityHall.description

      if (description.length < 10) {
        this.descriptionError = 'Tentang gedung harus minimal 10 karakter'
      } else {
        this.descriptionError = ''
      }
    },

    async fetchCityHall() {
      this.isLoading = true
      const token = localStorage.getItem('authToken')
      if (!token) {
        this.showToast('warning', 'Anda harus login terlebih dahulu!')
        return
      }

      try {
        // fetch semua daftar gedung dengan menggunakan fungsi apiService.js
        const response = await apiService.getCityHalls()

        if (response.data.status) {
          this.cityHalls = response.data.data // Simpan semua data gedung
        } else {
          this.showToast('error', 'Gagal mengambil data gedung.')
        }
      } catch (error) {
        console.error('Error fetching city hall data:', error)
        this.showToast('error', 'Terjadi kesalahan saat mengambil data.')
      } finally {
        this.isLoading = false // state skeleton loader berakhir setelah data berhasil diambil
      }
    },

    // fetch detail gedung berdasarkan ID
    async showCityHallDetail(id) {
      // tampil modal sebelum fetch
      this.selectedCityHall = null // initial state (kosong)
      this.reviews = [] // Reset reviews
      this.isLoadingDetail = true // loading state

      // tampil modal secepatnya
      this.showModal = true

      // fetch data
      this.fetchCityHallDetailData(id)
    },

    // New method to fetch city hall detail data
    async fetchCityHallDetailData(id) {
      const token = localStorage.getItem('authToken')

      if (!token) {
        this.showToast('warning', 'Anda harus login terlebih dahulu!')
        this.showModal = false
        return
      }

      try {
        // Fetch detail gedung nasional menggunakan fungsi apiService.js
        const response = await apiService.getCityHallDetail(id)

        if (response.data.status) {
          this.selectedCityHall = response.data.data

          // Fetch reviews after getting city hall details
          await this.fetchCityHallReviews(id)
        } else {
          this.showToast('error', 'Gagal mengambil detail gedung.')
          this.showModal = false
        }
      } catch (error) {
        console.error('Error fetching city hall detail:', error)
        this.showToast('error', 'Terjadi kesalahan saat mengambil detail gedung.')
        this.showModal = false
      } finally {
        this.isLoadingDetail = false
      }
    },

    // Fetch admin details by ID
    async fetchAdminData(adminId) {
      if (this.admins[adminId]) {
        // Return cached data if already fetched
        return this.admins[adminId]
      }

      const token = localStorage.getItem('authToken')

      if (!token) {
        console.error('No authentication token found')
        return null
      }

      try {
        // fetch data admin menggunakan fungsi apiService.js
        const response = await apiService.getAdmin(adminId, token)

        if (response.data.status) {
          // Store admin data in cache
          this.admins[adminId] = response.data.data
          return response.data.data
        } else {
          console.error('Failed to fetch admin data:', response.data.message)
          return null
        }
      } catch (error) {
        console.error(`Error fetching admin data for ID ${adminId}:`, error)
        return null
      }
    },

    // Process reviews to add admin data
    async processReviewsWithAdminData(reviews) {
      if (!reviews || reviews.length === 0) return []

      // Normalize review replies data and collect unique adminIds
      const normalizedReviews = reviews.map((review) => {
        if (review.review_reply) {
          // Normalize the reply data from snake_case to camelCase
          const normalizedReply = {
            id: review.review_reply.id,
            adminId: review.review_reply.admin_id || review.review_reply.adminId,
            comment: review.review_reply.comment,
            createdAt: review.review_reply.created_at || review.review_reply.createdAt,
            updatedAt: review.review_reply.updated_at || review.review_reply.updatedAt,
          }
          return {
            ...review,
            review_reply: normalizedReply,
          }
        }
        return review
      })

      // Collect all unique adminIds from normalized review replies
      const adminIds = normalizedReviews
        .filter((review) => review.review_reply)
        .map((review) => review.review_reply.adminId)
        .filter((id, index, self) => self.indexOf(id) === index) // Get unique IDs

      // Fetch admin data for all needed admins
      this.isLoadingAdmins = true
      const fetchPromises = adminIds.map((adminId) => this.fetchAdminData(adminId))
      await Promise.all(fetchPromises)
      this.isLoadingAdmins = false

      // Return the normalized reviews
      return normalizedReviews
    },

    // Get admin name for a review reply
    getAdminName(adminId) {
      if (!adminId) return 'Admin'
      return this.admins[adminId]?.fullname || 'Admin'
    },

    // Method fetch review city hall
    async fetchCityHallReviews(cityHallId) {
      this.isLoadingReviews = true
      this.reviews = [] // reset reviews sebelumnya, initial state

      const token = localStorage.getItem('authToken')

      if (!token) {
        console.error('No authentication token found')
        this.isLoadingReviews = false
        return
      }

      try {
        // fetch data review menggunakan fungsi apiService.js
        const response = await apiService.getReviewsForCityHall(cityHallId)

        if (response.data.status) {
          // Process reviews to add admin data
          const processedReviews = await this.processReviewsWithAdminData(response.data.data)
          this.reviews = processedReviews
          console.log('Reviews fetched with admin data:', this.reviews)
        } else {
          console.error('Failed to fetch reviews:', response.data.message)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        this.isLoadingReviews = false
      }
    },

    // format tanggal review
    formatReviewDate(dateString) {
      if (!dateString) return 'Tanggal tidak tersedia'

      const date = new Date(dateString)

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString)
        return 'Tanggal tidak valid'
      }

      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return date.toLocaleDateString('id-ID', options)
    },

    // tombol reply untum membalas ulasan sebagai admin
    toggleReplyForm(reviewId) {
      if (this.activeReplyId === reviewId) {
        this.activeReplyId = null // tutup form reply
        this.replyText = ''
      } else {
        this.activeReplyId = reviewId // buka form reply
        this.replyText = ''
      }
    },

    // method untuk menghapus reply ulasan
    confirmDeleteReply(reviewId) {
      this.isConfirmingReplyDelete = reviewId
    },

    // method untuk membatalkan hapus reply ulasan
    cancelDeleteReply() {
      this.isConfirmingReplyDelete = null
    },

    // method untuk menghapus reply ulasan
    async deleteReply(rentId, reviewId) {
      const token = localStorage.getItem('authToken')

      if (!token) {
        this.showToast('warning', 'Anda harus login terlebih dahulu!')
        return
      }

      // Find the review to get the reply ID
      const review = this.reviews.find((r) => r.id === reviewId)
      if (!review || !review.review_reply) {
        this.showToast('warning', 'Balasan tidak ditemukan.')
        this.isConfirmingReplyDelete = null
        return
      }

      const replyId = review.review_reply.id

      // Set loading state
      this.isDeletingReply = true

      try {
        // delete reply menggunakan fungsi apiService.js
        const response = await apiService.deleteReviewReply(rentId, reviewId, replyId)

        if (response.data.status) {
          // Find the review and remove its reply
          const reviewIndex = this.reviews.findIndex((review) => review.id === reviewId)
          if (reviewIndex !== -1) {
            // Create a new review object without the reply
            const updatedReview = { ...this.reviews[reviewIndex] }
            delete updatedReview.review_reply

            // Update the reviews array
            this.reviews.splice(reviewIndex, 1, updatedReview)
          }

          this.showToast('success', 'Balasan berhasil dihapus!')
        } else {
          this.showToast('error', response.data.message || 'Gagal menghapus balasan.')
        }
      } catch (error) {
        console.error('Error deleting reply:', error)
        const errorMessage =
          error.response?.data?.message || 'Gagal menghapus balasan. Coba lagi nanti.'
        this.showToast('error', errorMessage)
      } finally {
        this.isDeletingReply = false
        this.isConfirmingReplyDelete = null
      }
    },

    showEditReplyForm(review) {
      this.activeEditReplyId = review.id
      this.editReplyText = review.review_reply.comment
    },

    cancelEditReply() {
      this.activeEditReplyId = null
      this.editReplyText = ''
    },

    async updateReply(rentId, reviewId, replyId) {
      if (!this.editReplyText.trim()) {
        this.showToast('warning', 'Silakan masukkan balasan terlebih dahulu')
        return
      }

      this.isUpdatingReply = true
      const token = localStorage.getItem('authToken')

      if (!token) {
        this.showToast('warning', 'Anda harus login terlebih dahulu!')
        this.isUpdatingReply = false
        return
      }

      try {
        // update balasan menggunakan fungsi dari apiService.js
        const response = await apiService.updateReviewReply(
          rentId,
          reviewId,
          replyId,
          this.editReplyText,
        )

        if (response.data.status) {
          const updatedReplyData = response.data.data

          // Normalize the updated reply data
          const normalizedReply = {
            id: updatedReplyData.id || replyId,
            adminId:
              updatedReplyData.admin_id ||
              updatedReplyData.adminId ||
              this.reviews.find((r) => r.id === reviewId)?.review_reply?.adminId,
            comment: updatedReplyData.comment || this.editReplyText,
            createdAt:
              updatedReplyData.created_at ||
              updatedReplyData.createdAt ||
              this.reviews.find((r) => r.id === reviewId)?.review_reply?.createdAt,
            updatedAt:
              updatedReplyData.updated_at || updatedReplyData.updatedAt || new Date().toISOString(),
          }

          // Find the review to update
          const reviewIndex = this.reviews.findIndex((review) => review.id === reviewId)
          if (reviewIndex !== -1) {
            // Create a new updated review object
            const updatedReview = {
              ...this.reviews[reviewIndex],
              review_reply: normalizedReply,
            }

            // Update the reviews array with the new review
            this.reviews.splice(reviewIndex, 1, updatedReview)
          }

          // Reset edit state
          this.cancelEditReply()

          this.showToast('success', 'Balasan berhasil diperbarui!')
        } else {
          this.showToast('error', response.data.message || 'Gagal memperbarui balasan.')
        }
      } catch (error) {
        console.error('Error updating reply:', error)
        const errorMessage =
          error.response?.data?.message || 'Gagal memperbarui balasan. Coba lagi nanti.'
        this.showToast('error', errorMessage)
      } finally {
        this.isUpdatingReply = false
      }
    },

    // untuk membuka slideshow foto review
    openReviewPhotoSlideshow(review, startIndex = 0) {
      this.selectedReview = review
      this.currentReviewSlideIndex = startIndex
      this.showReviewSlideshow = true
    },

    // untuk membuka slideshow foto form tambah
    openCreatePhotoSlideshow(startIndex = 0) {
      this.currentPhotoIndex = startIndex
      this.showCreatePhotoSlideshow = true
    },

    // untuk membuka slideshow foto form edit
    openEditPhotoSlideshow(startIndex = 0) {
      this.currentEditPhotoIndex = startIndex
      this.showEditPhotoSlideshow = true
    },

    // navigasi slideshow foto review
    nextReviewSlide() {
      if (this.currentReviewSlideIndex < this.selectedReview?.review_media.length - 1) {
        this.currentReviewSlideIndex++
      }
    },

    prevReviewSlide() {
      if (this.currentReviewSlideIndex > 0) {
        this.currentReviewSlideIndex--
      }
    },

    // method untuk mengirim balasan ulasan
    async submitReply(rentId, reviewId) {
      if (!this.replyText.trim()) {
        this.showToast('warning', 'Silakan masukkan balasan terlebih dahulu')
        return
      }

      this.isSubmittingReply = true
      const token = localStorage.getItem('authToken')

      if (!token) {
        this.showToast('warning', 'Anda harus login terlebih dahulu!')
        this.isSubmittingReply = false
        return
      }

      try {
        // submit reply menggunakan fungsi apiService.js
        const response = await apiService.createReviewReply(rentId, reviewId, this.replyText)

        if (response.data.status) {
          const replyData = response.data.data

          // Normalize the reply data - convert snake_case to camelCase if needed
          const normalizedReply = {
            id: replyData.id,
            adminId: replyData.admin_id || replyData.adminId,
            comment: replyData.comment,
            createdAt: replyData.created_at || replyData.createdAt,
            updatedAt: replyData.updated_at || replyData.updatedAt,
          }

          // Fetch admin data for the new reply
          await this.fetchAdminData(normalizedReply.adminId)

          // Update the review with the new reply
          const reviewIndex = this.reviews.findIndex((review) => review.id === reviewId)
          if (reviewIndex !== -1) {
            // Create a new review object with the reply data
            const updatedReview = {
              ...this.reviews[reviewIndex],
              review_reply: normalizedReply,
            }

            // Update the reviews array
            this.reviews.splice(reviewIndex, 1, updatedReview)
          }

          // Reset form state
          this.activeReplyId = null
          this.replyText = ''

          this.showToast('success', 'Balasan berhasil dikirim!')
        } else {
          this.showToast('error', response.data.message || 'Gagal mengirim balasan.')
        }
      } catch (error) {
        console.error('Error submitting reply:', error)
        const errorMessage =
          error.response?.data?.message || 'Gagal mengirim balasan. Coba lagi nanti.'
        this.showToast('error', errorMessage)
      } finally {
        this.isSubmittingReply = false
      }
    },

    // Method untuk menghandle hover tombol foto
    handlePhotoButtonHover(isHovering) {
      this.isHoveringPhotoButton = isHovering
    },

    // untuk membuka slideshow foto
    openPhotoSlideshow() {
      this.currentSlideIndex = 0
      this.showSlideshow = true
    },

    // navigasi slideshow
    nextSlide() {
      if (this.currentSlideIndex < this.selectedCityHall?.media.length - 1) {
        this.currentSlideIndex++
      }
    },

    prevSlide() {
      if (this.currentSlideIndex > 0) {
        this.currentSlideIndex--
      }
    },

    // navigasi preview foto
    nextPhoto() {
      if (this.currentPhotoIndex < this.uploadedPhotos.length - 1) {
        this.currentPhotoIndex++
      }
    },

    prevPhoto() {
      if (this.currentPhotoIndex > 0) {
        this.currentPhotoIndex--
      }
    },

    // navigasi preview foto edit
    nextEditPhoto() {
      if (this.currentEditPhotoIndex < this.editedPhotos.length - 1) {
        this.currentEditPhotoIndex++
      }
    },

    prevEditPhoto() {
      if (this.currentEditPhotoIndex > 0) {
        this.currentEditPhotoIndex--
      }
    },

    // Menghapus foto pada modal tambah gedung
    removePhoto(index) {
      if (confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
        // Revoke object URL untuk menghindari memory leak
        URL.revokeObjectURL(this.uploadedPhotos[index].preview)

        // Hapus foto dari array
        this.uploadedPhotos.splice(index, 1)

        // Reset indeks jika foto terakhir atau foto yang ditampilkan dihapus
        if (this.uploadedPhotos.length === 0) {
          this.currentPhotoIndex = 0
        } else if (index <= this.currentPhotoIndex && this.currentPhotoIndex > 0) {
          this.currentPhotoIndex--
        }
      }
    },

    // Menghapus foto pada modal edit gedung
    removeEditPhoto(index) {
      if (confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
        const photo = this.editedPhotos[index]

        // Jika foto baru (belum di server)
        if (!photo.existing) {
          // Revoke object URL untuk menghindari memory leak
          URL.revokeObjectURL(photo.preview)
        }

        // Hapus foto dari array
        this.editedPhotos.splice(index, 1)

        // Reset indeks jika foto terakhir atau foto yang ditampilkan dihapus
        if (this.editedPhotos.length === 0) {
          this.currentEditPhotoIndex = 0
        } else if (index <= this.currentEditPhotoIndex && this.currentEditPhotoIndex > 0) {
          this.currentEditPhotoIndex--
        }
      }
    },

    // mendapatkan URL Maps
    getMapsUrl(latitude, longitude) {
      if (!latitude || !longitude) return '#'
      return `https://www.google.com/maps?q=${latitude},${longitude}`
    },

    // Method mencari lokasi menggunakan nonimatim API
    async searchLocation() {
      if (!this.searchQuery.trim()) {
        this.searchError = 'Silakan masukkan nama lokasi'
        return
      }

      this.searchError = null

      try {
        // Gunakan Nominatim API (OpenStreetMap)
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            q: this.searchQuery,
            format: 'json',
            limit: 1, // Batasi hasil ke 1 lokasi
            addressdetails: 1,
          },
          headers: {
            'Accept-Language': 'id', // Hasil dalam bahasa Indonesia
          },
        })

        if (response.data && response.data.length > 0) {
          const result = response.data[0]
          const lat = parseFloat(result.lat)
          const lng = parseFloat(result.lon)

          // Pindahkan peta ke lokasi yang ditemukan
          this.map.setView([lat, lng], 15)

          // Update marker
          if (this.marker) {
            this.marker.setLatLng([lat, lng])
          } else {
            this.marker = L.marker([lat, lng]).addTo(this.map)
          }

          // Update koordinat pada form
          this.newCityHall.latitude = lat.toFixed(10)
          this.newCityHall.longitude = lng.toFixed(10)

          // Opsional: Perbarui alamat jika belum diisi
          if (!this.newCityHall.address && result.display_name) {
            this.newCityHall.address = result.display_name
          }
        } else {
          this.searchError = 'Lokasi tidak ditemukan'
        }
      } catch (error) {
        console.error('Error saat pencarian lokasi:', error)
        this.searchError = 'Terjadi kesalahan saat mencari lokasi. Coba lagi nanti.'
      }
    },

    // Method mencari lokasi untuk edit form
    async searchEditLocation() {
      if (!this.editSearchQuery.trim()) {
        this.editSearchError = 'Silakan masukkan nama lokasi'
        return
      }

      this.editSearchError = null

      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            q: this.editSearchQuery,
            format: 'json',
            limit: 1,
            addressdetails: 1,
          },
          headers: {
            'Accept-Language': 'id',
          },
        })

        if (response.data && response.data.length > 0) {
          const result = response.data[0]
          const lat = parseFloat(result.lat)
          const lng = parseFloat(result.lon)

          // Pindahkan peta ke lokasi yang ditemukan
          this.editMap.setView([lat, lng], 15)

          // Update marker
          if (this.editMarker) {
            this.editMarker.setLatLng([lat, lng])
          } else {
            this.editMarker = L.marker([lat, lng]).addTo(this.editMap)
          }

          // Update koordinat pada form
          this.editCityHall.latitude = lat.toFixed(10)
          this.editCityHall.longitude = lng.toFixed(10)

          // Opsional: Perbarui alamat jika diminta user
          if (confirm('Apakah Anda ingin mengupdate alamat dengan hasil pencarian?')) {
            this.editCityHall.address = result.display_name
          }
        } else {
          this.editSearchError = 'Lokasi tidak ditemukan'
        }
      } catch (error) {
        console.error('Error saat pencarian lokasi:', error)
        this.editSearchError = 'Terjadi kesalahan saat mencari lokasi. Coba lagi nanti.'
      }
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID').format(value)
    },

    // Membuka modal konfirmasi hapus
    openDeleteModal(cityHall) {
      this.deleteCityHall = cityHall
      this.showDeleteModal = true
    },

    // Menutup modal konfirmasi hapus
    closeDeleteModal() {
      if (this.isDeletingCityHall) return // Prevent closing while deleting
      this.showDeleteModal = false
      this.deleteCityHall = null
      this.isDeletingCityHall = false
      this.deletingCityHallId = null
    },

    // Konfirmasi penghapusan dan mengirim request DELETE
    async deleteConfirm() {
      if (this.isDeletingCityHall) return // Prevent multiple clicks

      this.isDeletingCityHall = true
      this.deletingCityHallId = this.deleteCityHall.id

      try {
        const token = localStorage.getItem('authToken')

        if (!token) {
          this.showToast('warning', 'Anda harus login terlebih dahulu!')
          this.isDeletingCityHall = false
          this.deletingCityHallId = null
          return
        }

        // request delete menggunakan fungsi apiService.js
        const response = await apiService.deleteCityHall(this.deleteCityHall.id)

        if (response.data.status) {
          // Jika berhasil, refresh data
          this.showToast('success', 'Data gedung berhasil dihapus!')
          this.closeDeleteModal()
          this.fetchCityHall() // Refresh data gedung
        } else {
          this.showToast('error', response.data.message || 'Gagal menghapus data gedung.')
        }
      } catch (error) {
        console.error('Error deleting city hall:', error)
        const errorMessage =
          error.response?.data?.message || 'Gagal menghapus data gedung. Coba lagi nanti.'
        this.showToast('error', errorMessage)
      } finally {
        this.isDeletingCityHall = false
        this.deletingCityHallId = null
      }
    },

    // Membuka modal tambah gedung
    openCreateModal() {
      this.showCreateModal = true
      // Reset form data
      this.resetForm()

      // Initialize map after modal is visible
      this.$nextTick(() => {
        this.initMap()
      })
    },

    // Menutup modal tambah gedung
    closeCreateModal() {
      this.showCreateModal = false
      this.descriptionError = '' // Reset validation error
      this.resetForm()
    },

    // Membuka modal edit gedung
    openEditModal(cityHall) {
      // Clone data gedung yang akan diedit untuk menghindari perubahan langsung
      this.editCityHall = JSON.parse(JSON.stringify(cityHall))

      // Inisialisasi editedPhotos dari media yang sudah ada
      this.editedPhotos = cityHall.media.map((media) => ({
        id: media.id,
        preview: media.url,
        existing: true, // Flag untuk foto yang sudah ada di server
      }))

      // Inisialisasi editFacilityInputs
      this.editFacilityInputs = Array(this.editCityHall.pricing.length).fill('')

      // Tampilkan modal
      this.showEditModal = true

      // Initialize map after modal is visible
      this.$nextTick(() => {
        this.initEditMap()
      })
    },

    // Menutup modal edit gedung
    closeEditModal() {
      this.showEditModal = false
      this.descriptionError = '' // Reset validation error
      // Bersihkan data edit
      this.editCityHall = {
        id: '',
        name: '',
        description: '',
        area_m2: '',
        people_capacity: '',
        address: '',
        latitude: '',
        longitude: '',
        contact_person: '',
        status: 'tersedia',
        pricing: [],
      }
      this.editedPhotos = []
      this.currentEditPhotoIndex = 0
      this.editFacilityInputs = ['']
      if (this.editMarker) {
        this.editMarker.remove()
        this.editMarker = null
      }
    },

    // Reset form untuk tambah gedung
    resetForm() {
      this.descriptionError = '' // Reset validation error
      this.newCityHall = {
        name: '',
        description: '',
        area_m2: '',
        people_capacity: '',
        address: '',
        latitude: '',
        longitude: '',
        contact_person: '',
        status: 'tersedia',
        pricing: [
          {
            activity_type: '',
            facilities: '',
            price_per_day: '',
          },
        ],
      }
      this.uploadedPhotos = []
      this.currentPhotoIndex = 0
      this.facilityInputs = ['']
      if (this.marker) {
        this.marker.remove()
        this.marker = null
      }
    },

    // Inisialisasi peta (OpenStreetMap)
    initMap() {
      if (!window.L) {
        // Load Leaflet script if not already loaded
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'
        script.integrity =
          'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=='
        script.crossOrigin = ''
        document.head.appendChild(script)

        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'
        link.integrity =
          'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=='
        link.crossOrigin = ''
        document.head.appendChild(link)

        script.onload = () => {
          this.createMap()
        }
      } else {
        this.createMap()
      }
    },

    // Inisialisasi peta untuk edit modal
    initEditMap() {
      if (!window.L) {
        // Load Leaflet script if not already loaded
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'
        script.integrity =
          'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=='
        script.crossOrigin = ''
        document.head.appendChild(script)

        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'
        link.integrity =
          'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=='
        link.crossOrigin = ''
        document.head.appendChild(link)

        script.onload = () => {
          this.createEditMap()
        }
      } else {
        this.createEditMap()
      }
    },

    // Create OpenStreetMap
    createMap() {
      // Default coordinates (Jakarta)
      const defaultLat = -6.2088
      const defaultLng = 106.8456

      // Create map
      this.map = L.map('map').setView([defaultLat, defaultLng], 13)

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map)

      // Add click event to map
      this.map.on('click', (e) => {
        const { lat, lng } = e.latlng

        // Update marker position
        if (this.marker) {
          this.marker.setLatLng([lat, lng])
        } else {
          this.marker = L.marker([lat, lng]).addTo(this.map)
        }

        // Update form fields
        this.newCityHall.latitude = lat.toFixed(10)
        this.newCityHall.longitude = lng.toFixed(10)
      })

      // Refresh map size
      setTimeout(() => {
        this.map.invalidateSize()
      }, 100)
    },

    // Create OpenStreetMap untuk edit
    createEditMap() {
      // Use existing coordinates from editCityHall
      const lat = parseFloat(this.editCityHall.latitude) || -6.2088
      const lng = parseFloat(this.editCityHall.longitude) || 106.8456

      // Create map
      this.editMap = L.map('editMap').setView([lat, lng], 15)

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.editMap)

      // Add initial marker for existing location
      this.editMarker = L.marker([lat, lng]).addTo(this.editMap)

      // Add click event to map
      this.editMap.on('click', (e) => {
        const { lat, lng } = e.latlng

        // Update marker position
        if (this.editMarker) {
          this.editMarker.setLatLng([lat, lng])
        } else {
          this.editMarker = L.marker([lat, lng]).addTo(this.editMap)
        }

        // Update form fields
        this.editCityHall.latitude = lat.toFixed(10)
        this.editCityHall.longitude = lng.toFixed(10)
      })

      // Refresh map size
      setTimeout(() => {
        this.editMap.invalidateSize()
      }, 100)
    },

    // Handle photo upload
    handlePhotoUpload(event) {
      const files = event.target.files

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]

          // Create preview URL
          const preview = URL.createObjectURL(file)

          // Add to uploaded photos array
          this.uploadedPhotos.push({
            file: file,
            preview: preview,
          })
        }

        // Reset file input
        event.target.value = ''
      }
    },

    // Handle photo upload for edit
    handleEditPhotoUpload(event) {
      const files = event.target.files

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]

          // Create preview URL
          const preview = URL.createObjectURL(file)

          // Add to edited photos array
          this.editedPhotos.push({
            file: file,
            preview: preview,
            existing: false, // New photo that doesn't exist on server yet
          })
        }

        // Reset file input
        event.target.value = ''
      }
    },

    // Add pricing category
    addPricing() {
      this.newCityHall.pricing.push({
        activity_type: '',
        facilities: '',
        price_per_day: '',
      })
      this.facilityInputs.push('')
    },

    // Add pricing category for edit
    addEditPricing() {
      this.editCityHall.pricing.push({
        activity_type: '',
        facilities: '',
        price_per_day: '',
      })
      this.editFacilityInputs.push('')
    },

    // Remove pricing category
    removePricing(index) {
      this.newCityHall.pricing.splice(index, 1)
      this.facilityInputs.splice(index, 1)
    },

    // Remove pricing category for edit
    removeEditPricing(index) {
      this.editCityHall.pricing.splice(index, 1)
      this.editFacilityInputs.splice(index, 1)
    },

    // Prevent input starting with 0 for numeric fields
    preventLeadingZero(event, field) {
      console.log('🔍 preventLeadingZero called:', field, event.target.value)
      let value = event.target.value
      // Remove non-digit characters
      value = value.replace(/\D/g, '')
      // Prevent leading zero
      if (value.startsWith('0') && value.length > 1) {
        value = value.replace(/^0+/, '')
      }
      // Update both display and model
      event.target.value = value
      this.newCityHall[field] = value ? parseInt(value) : ''
      console.log('✅ Updated value:', value, 'Model:', this.newCityHall[field])
    },

    // Prevent input starting with 0 for edit numeric fields
    preventEditLeadingZero(event, field) {
      console.log('🔍 preventEditLeadingZero called:', field, event.target.value)
      let value = event.target.value
      // Remove non-digit characters
      value = value.replace(/\D/g, '')
      // Prevent leading zero
      if (value.startsWith('0') && value.length > 1) {
        value = value.replace(/^0+/, '')
      }
      // Update both display and model
      event.target.value = value
      this.editCityHall[field] = value ? parseInt(value) : ''
      console.log('✅ Updated value:', value, 'Model:', this.editCityHall[field])
    },

    // Format to Rupiah display
    formatRupiah(value) {
      if (!value) return ''
      // Remove non-digit characters
      const number = value.toString().replace(/\D/g, '')
      // Add thousand separators
      return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },

    // Handle price input with Rupiah format
    handlePriceInput(event, index) {
      console.log('💰 handlePriceInput called:', index, event.target.value)
      let value = event.target.value.replace(/\D/g, '') // Remove non-digit

      // Prevent starting with 0
      if (value.startsWith('0') && value.length > 1) {
        value = value.replace(/^0+/, '')
      }

      // Store raw number for API
      this.newCityHall.pricing[index].price_per_day = value ? parseInt(value) : ''

      // Display formatted value
      event.target.value = this.formatRupiah(value)
      console.log('✅ Price updated:', value, 'Formatted:', event.target.value)
    },

    // Handle price input with Rupiah format for edit
    handleEditPriceInput(event, index) {
      console.log('💰 handleEditPriceInput called:', index, event.target.value)
      let value = event.target.value.replace(/\D/g, '') // Remove non-digit

      // Prevent starting with 0
      if (value.startsWith('0') && value.length > 1) {
        value = value.replace(/^0+/, '')
      }

      // Store raw number for API
      this.editCityHall.pricing[index].price_per_day = value ? parseInt(value) : ''

      // Display formatted value
      event.target.value = this.formatRupiah(value)
      console.log('✅ Edit price updated:', value, 'Formatted:', event.target.value)
    },

    // Add facility to a pricing category
    addFacility(index) {
      if (!this.facilityInputs[index] || this.facilityInputs[index].trim() === '') return

      const facility = this.facilityInputs[index].trim()
      const facilities = this.newCityHall.pricing[index].facilities

      if (facilities) {
        this.newCityHall.pricing[index].facilities = facilities + '; ' + facility
      } else {
        this.newCityHall.pricing[index].facilities = facility
      }

      // Clear input
      this.facilityInputs[index] = ''
    },

    // Add facility to a pricing category for edit
    addEditFacility(index) {
      if (!this.editFacilityInputs[index] || this.editFacilityInputs[index].trim() === '') return

      const facility = this.editFacilityInputs[index].trim()
      const facilities = this.editCityHall.pricing[index].facilities

      if (facilities) {
        this.editCityHall.pricing[index].facilities = facilities + '; ' + facility
      } else {
        this.editCityHall.pricing[index].facilities = facility
      }

      // Clear input
      this.editFacilityInputs[index] = ''
    },

    // Remove facility from a pricing category
    removeFacility(priceIndex, facilityIndex) {
      const facilities = this.newCityHall.pricing[priceIndex].facilities.split('; ')
      facilities.splice(facilityIndex, 1)
      this.newCityHall.pricing[priceIndex].facilities = facilities.join('; ')
    },

    // Remove facility from a pricing category for edit
    removeEditFacility(priceIndex, facilityIndex) {
      const facilities = this.editCityHall.pricing[priceIndex].facilities.split('; ')
      facilities.splice(facilityIndex, 1)
      this.editCityHall.pricing[priceIndex].facilities = facilities.join('; ')
    },

    // Submit form to create new city hall
    async submitCreateForm() {
      if (this.isSubmitting) return

      // Validate form
      if (!this.validateForm()) {
        return
      }

      this.isSubmitting = true

      try {
        const token = localStorage.getItem('authToken')

        if (!token) {
          this.showToast('warning', 'Anda harus login terlebih dahulu!')
          this.isSubmitting = false
          return
        }

        // Create form data
        const formData = new FormData()

        // Add basic information
        formData.append('name', this.newCityHall.name)
        formData.append('description', this.newCityHall.description)
        formData.append('area_m2', this.newCityHall.area_m2)
        formData.append('people_capacity', this.newCityHall.people_capacity)
        formData.append('address', this.newCityHall.address)
        formData.append('latitude', this.newCityHall.latitude)
        formData.append('longitude', this.newCityHall.longitude)
        formData.append('status', this.newCityHall.status)
        formData.append('contact_person', this.newCityHall.contact_person)

        // Add pricing as JSON string
        formData.append('pricing', JSON.stringify(this.newCityHall.pricing))

        // Add photos
        this.uploadedPhotos.forEach((photo) => {
          formData.append('city_hall_media', photo.file)
        })

        // request create menggunakan fungsi apiService.js
        const response = await apiService.createCityHall(formData, token)

        if (response.data.status) {
          this.showToast('success', 'Data gedung berhasil ditambahkan!')
          this.closeCreateModal()
          this.fetchCityHall() // Refresh data gedung
        } else {
          this.showToast('error', response.data.message || 'Gagal menambahkan data gedung.')
        }
      } catch (error) {
        console.error('Error creating city hall:', error)
        const errorMessage =
          error.response?.data?.message || 'Gagal menambahkan data gedung. Coba lagi nanti.'
        this.showToast('error', errorMessage)
      } finally {
        this.isSubmitting = false
      }
    },

    // Submit form to update city hall
    async submitEditForm() {
      if (this.isSubmitting) return

      // Validate form
      if (!this.validateEditForm()) {
        return
      }

      this.isSubmitting = true

      try {
        const token = localStorage.getItem('authToken')

        if (!token) {
          this.showToast('warning', 'Anda harus login terlebih dahulu!')
          this.isSubmitting = false
          return
        }

        // Create form data
        const formData = new FormData()

        // Add basic information
        formData.append('name', this.editCityHall.name)
        formData.append('description', this.editCityHall.description)
        formData.append('area_m2', this.editCityHall.area_m2)
        formData.append('people_capacity', this.editCityHall.people_capacity)
        formData.append('address', this.editCityHall.address)
        formData.append('latitude', this.editCityHall.latitude)
        formData.append('longitude', this.editCityHall.longitude)
        formData.append('status', this.editCityHall.status)
        formData.append('contact_person', this.editCityHall.contact_person)

        // Add pricing as JSON string
        formData.append('pricing', JSON.stringify(this.editCityHall.pricing))

        // Add IDs of existing media to keep
        const existingMediaIds = this.editedPhotos
          .filter((photo) => photo.existing)
          .map((photo) => photo.id)
        formData.append('existing_media_ids', JSON.stringify(existingMediaIds))

        // Add new photos
        this.editedPhotos
          .filter((photo) => !photo.existing)
          .forEach((photo) => {
            formData.append('city_hall_media', photo.file)
          })

        // request delete menggunakan fungsi apiService.js
        const response = await apiService.updateCityHall(this.editCityHall.id, formData, token)

        if (response.data.status) {
          this.showToast('success', 'Data gedung berhasil diperbarui!')
          this.closeEditModal()
          this.fetchCityHall() // Refresh data gedung
        } else {
          this.showToast('error', response.data.message || 'Gagal memperbarui data gedung.')
        }
      } catch (error) {
        console.error('Error updating city hall:', error)
        const errorMessage =
          error.response?.data?.message || 'Gagal memperbarui data gedung. Coba lagi nanti.'
        this.showToast('error', errorMessage)
      } finally {
        this.isSubmitting = false
      }
    },

    // Validate form before submission
    validateForm() {
      // Reset all errors first
      this.descriptionError = ''
      this.addressError = ''
      this.photoError = ''
      this.areaMError = ''
      this.capacityError = ''
      this.contactError = ''
      this.coordinateError = ''
      this.pricingErrors = []

      let isValid = true

      // Validate description length
      if (!this.newCityHall.description || this.newCityHall.description.length < 10) {
        this.descriptionError = 'Tentang gedung harus minimal 10 karakter'
        this.showToast('warning', 'Tentang gedung harus minimal 10 karakter')
        isValid = false
      }

      // Validate address length
      if (!this.newCityHall.address || this.newCityHall.address.trim().length < 5) {
        this.addressError = 'Alamat harus minimal 5 karakter'
        if (isValid) this.showToast('warning', 'Alamat harus minimal 5 karakter')
        isValid = false
      }

      // Check if photos are uploaded
      if (this.uploadedPhotos.length === 0) {
        this.photoError = 'Silakan upload minimal satu foto gedung'
        if (isValid) this.showToast('warning', 'Silakan upload minimal satu foto gedung')
        isValid = false
      }

      // Validate numeric fields
      if (
        !this.newCityHall.area_m2 ||
        this.newCityHall.area_m2 === '0' ||
        this.newCityHall.area_m2 === 0
      ) {
        this.areaMError = 'Silakan isi luas bangunan dengan angka yang valid'
        if (isValid) this.showToast('warning', 'Silakan isi luas bangunan dengan angka yang valid')
        isValid = false
      }

      if (
        !this.newCityHall.people_capacity ||
        this.newCityHall.people_capacity === '0' ||
        this.newCityHall.people_capacity === 0
      ) {
        this.capacityError = 'Silakan isi kapasitas orang dengan angka yang valid'
        if (isValid) this.showToast('warning', 'Silakan isi kapasitas orang dengan angka yang valid')
        isValid = false
      }

      if (!this.newCityHall.contact_person) {
        this.contactError = 'Silakan isi contact person dengan nomor telepon yang valid'
        if (isValid) this.showToast('warning', 'Silakan isi contact person dengan nomor telepon yang valid')
        isValid = false
      }

      // Check if coordinates are selected
      if (!this.newCityHall.latitude || !this.newCityHall.longitude) {
        this.coordinateError = 'Silakan pilih lokasi pada peta'
        if (isValid) this.showToast('warning', 'Silakan pilih lokasi pada peta')
        isValid = false
      }

      // Check if pricing data is valid
      this.newCityHall.pricing.forEach((price, index) => {
        const priceError = {
          activityType: '',
          pricePerDay: '',
          facilities: ''
        }

        if (!price.activity_type || !price.activity_type.trim()) {
          priceError.activityType = 'Silakan isi jenis kegiatan'
          if (isValid) this.showToast('warning', 'Silakan isi jenis kegiatan pada semua kategori sewa')
          isValid = false
        }
        
        if (!price.price_per_day || price.price_per_day === '0' || price.price_per_day === 0) {
          priceError.pricePerDay = 'Silakan isi harga sewa per hari'
          if (isValid) this.showToast('warning', 'Silakan isi harga sewa per hari pada semua kategori')
          isValid = false
        }
        
        if (!price.facilities || !price.facilities.trim()) {
          priceError.facilities = 'Silakan tambahkan minimal satu fasilitas'
          if (isValid) this.showToast('warning', 'Silakan tambahkan minimal satu fasilitas pada semua kategori sewa')
          isValid = false
        }

        this.pricingErrors[index] = priceError
      })

      return isValid
    },

    // Validate edit form before submission
    validateEditForm() {
      // Reset all errors first
      this.descriptionError = ''
      this.addressError = ''
      this.photoError = ''
      this.areaMError = ''
      this.capacityError = ''
      this.contactError = ''
      this.coordinateError = ''
      this.pricingErrors = []

      let isValid = true

      // Validate description length
      if (!this.editCityHall.description || this.editCityHall.description.length < 10) {
        this.descriptionError = 'Tentang gedung harus minimal 10 karakter'
        this.showToast('warning', 'Tentang gedung harus minimal 10 karakter')
        isValid = false
      }

      // Validate address length
      if (!this.editCityHall.address || this.editCityHall.address.trim().length < 5) {
        this.addressError = 'Alamat harus minimal 5 karakter'
        if (isValid) this.showToast('warning', 'Alamat harus minimal 5 karakter')
        isValid = false
      }

      // Check if photos are uploaded
      if (this.editedPhotos.length === 0) {
        this.photoError = 'Silakan upload minimal satu foto gedung'
        if (isValid) this.showToast('warning', 'Silakan upload minimal satu foto gedung')
        isValid = false
      }

      // Validate numeric fields
      if (
        !this.editCityHall.area_m2 ||
        this.editCityHall.area_m2 === '0' ||
        this.editCityHall.area_m2 === 0
      ) {
        this.areaMError = 'Silakan isi luas bangunan dengan angka yang valid'
        if (isValid) this.showToast('warning', 'Silakan isi luas bangunan dengan angka yang valid')
        isValid = false
      }

      if (
        !this.editCityHall.people_capacity ||
        this.editCityHall.people_capacity === '0' ||
        this.editCityHall.people_capacity === 0
      ) {
        this.capacityError = 'Silakan isi kapasitas orang dengan angka yang valid'
        if (isValid) this.showToast('warning', 'Silakan isi kapasitas orang dengan angka yang valid')
        isValid = false
      }

      if (!this.editCityHall.contact_person) {
        this.contactError = 'Silakan isi contact person dengan nomor telepon yang valid'
        if (isValid) this.showToast('warning', 'Silakan isi contact person dengan nomor telepon yang valid')
        isValid = false
      }

      // Check if coordinates are selected
      if (!this.editCityHall.latitude || !this.editCityHall.longitude) {
        this.coordinateError = 'Silakan pilih lokasi pada peta'
        if (isValid) this.showToast('warning', 'Silakan pilih lokasi pada peta')
        isValid = false
      }

      // Check if pricing data is valid
      this.editCityHall.pricing.forEach((price, index) => {
        const priceError = {
          activityType: '',
          pricePerDay: '',
          facilities: ''
        }

        if (!price.activity_type || !price.activity_type.trim()) {
          priceError.activityType = 'Silakan isi jenis kegiatan'
          if (isValid) this.showToast('warning', 'Silakan isi jenis kegiatan pada semua kategori sewa')
          isValid = false
        }
        
        if (!price.price_per_day || price.price_per_day === '0' || price.price_per_day === 0) {
          priceError.pricePerDay = 'Silakan isi harga sewa per hari'
          if (isValid) this.showToast('warning', 'Silakan isi harga sewa per hari pada semua kategori')
          isValid = false
        }
        
        if (!price.facilities || !price.facilities.trim()) {
          priceError.facilities = 'Silakan tambahkan minimal satu fasilitas'
          if (isValid) this.showToast('warning', 'Silakan tambahkan minimal satu fasilitas pada semua kategori sewa')
          isValid = false
        }

        this.pricingErrors[index] = priceError
      })

      return isValid
    },

    // Old validateEditForm removed - now using the one above
  },
  mounted() {
    this.fetchCityHall()
  },
}
</script>

<style scoped>
.data-gedung-text,
.nama-gedung,
.foto-text,
.action-button {
  font-family: 'Poppins', sans-serif;
}

.detail-modal-cardbox {
  background-color: #e8f9ff;
  max-height: 90%;
  overflow-y: auto;
}

.photo-overlay {
  transition: opacity 0.25s ease-in-out;
}

/* Tombol Lihat di Maps */
.maps-button {
  background-color: white !important; /* Memaksa warna latar belakang tetap putih */
  transform: all 1.2s ease;
}

.maps-button:hover {
  background-color: #e8f9ff !important; /* Warna latar tetap putih saat hover */
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06) !important; /* Shadow tetap sama */
}

.maps-text {
  color: #008bcd !important;
  font-family: 'Poppins', sans-serif;
}

/* tidak ada perubahan ketika hover */
.maps-button:hover,
.maps-text:hover * {
  color: inherit !important;
  transform: none !important;
}

.facility-badge {
  background-color: #d1d5db;
  color: black;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.875rem;
}
.rating {
  margin-right: 15px;
  margin-top: 3px;
}

/* Tombol Lihat Semua Foto */
.foto-button {
  color: white;
  font-weight: bold;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}

.foto-icon-container {
  background-color: transparent;
  border-radius: 8px;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.foto-text {
  font-size: 1rem;
  text-align: center;
}

.foto-button:hover {
  background-color: #1e88e5;
}

/* Animasi untuk modal */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Style untuk tombol navigasi */
.navigation-button {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.navigation-button:focus {
  outline: none;
}

/* Efek hover untuk tombol Tambah Gedung Nasional */
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

/* Efek hover untuk tombol aksi (Detail, Edit, Hapus) */
.hover-action-button {
  transition: all 0.3s ease;
  background: linear-gradient(to right, #3b82f6, #3b82f6);
  background-size: 200% auto;
  background-position: 0% 0%;
}

.hover-action-button:hover {
  background-position: 100% 0%;
  background: linear-gradient(to right, #3b82f6, #2563eb);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.4);
}

.skeleton {
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 4px;
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
