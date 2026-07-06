<template>
  <div>
    <Navigation />
    <div class="container mt-6 mx-auto px-6 py-8">
      <div class="flex justify-between items-center">
        <h1 class="data-gedung-text text-3xl font-black text-black">Daftar Gedung Mess</h1>
        <button
          @click="openAddGuesthouseModal"
          class="data-gedung-text font-bold bg-blue-500 text-white px-5 py-2 text-sm rounded-lg hover-gradient"
        >
          Tambah Gedung Mess
        </button>
        
        <transition name="modal">
          <div
            v-if="showReviewSlideshow"
            class="photo-slideshow fixed inset-0 flex items-center justify-center z-50"
          >
            <div class="absolute inset-0 bg-black bg-opacity-75"></div>
            <div class="relative w-full h-full max-w-5xl max-h-screen p-4 flex flex-col">
              <button
                @click="showReviewSlideshow = false"
                class="absolute top-4 right-4 z-30 bg-black bg-opacity-50 text-white hover:text-gray-200 p-2 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div class="flex-1 flex items-center justify-center mt-8 mb-12 overflow-hidden relative min-h-[300px]">
                <div v-if="isImageLoading" class="absolute flex flex-col items-center justify-center space-y-2 z-10">
                  <svg class="animate-spin h-10 w-10 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span class="text-white text-sm font-semibold">Memuat foto...</span>
                </div>
                <img
                  v-show="!isImageLoading"
                  :src="selectedReview?.review_media[currentReviewSlideIndex]?.url"
                  :alt="'Foto ulasan dari ' + selectedReview?.rent.renter.fullname"
                  class="max-w-full max-h-full object-contain"
                  @load="isImageLoading = false"
                />
              </div>

              <div class="flex justify-between items-center w-full px-4">
                <button
                  @click="prevReviewSlide"
                  class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20 text-black"
                  :disabled="currentReviewSlideIndex === 0"
                  :class="{ 'opacity-50 cursor-not-allowed': currentReviewSlideIndex === 0 }"
                >
                  ◀
                </button>
                <div class="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full z-20">
                  {{ currentReviewSlideIndex + 1 }} / {{ selectedReview?.review_media.length }}
                </div>
                <button
                  @click="nextReviewSlide"
                  class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20 text-black"
                  :disabled="currentReviewSlideIndex === selectedReview?.review_media.length - 1"
                  :class="{ 'opacity-50 cursor-not-allowed': currentReviewSlideIndex === selectedReview?.review_media.length - 1 }"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        </</transition>
      </div>

      <div v-if="isLoading" class="cardbox-gedung mt-6 bg-blue-100 p-6 shadow-lg flex relative rounded-xl">
        <div class="skeleton w-48 h-32 rounded-lg"></div>
        <div class="flex-1 pl-4">
          <div class="skeleton h-7 w-3/4 mb-2"></div>
          <div class="skeleton h-5 w-1/2 mb-2"></div>
          <div class="skeleton h-6 w-1/3 mt-3"></div>
        </div>
        <div class="rating absolute top-4 right-4 flex items-center space-x-1">
          <div class="skeleton h-5 w-5 mr-1 rounded-full"></div>
          <div class="skeleton h-6 w-10 rounded"></div>
        </div>
        <div class="absolute bottom-4 right-4 flex space-x-3">
          <div class="skeleton w-24 h-10 rounded-lg"></div>
          <div class="skeleton w-24 h-10 rounded-lg"></div>
          <div class="skeleton w-24 h-10 rounded-lg"></div>
        </div>
      </div>
      <div v-if="isLoading" class="cardbox-gedung mt-6 bg-blue-100 p-6 shadow-lg flex relative rounded-xl">
        <div class="skeleton w-48 h-32 rounded-lg"></div>
        <div class="flex-1 pl-4">
          <div class="skeleton h-7 w-3/4 mb-2"></div>
          <div class="skeleton h-5 w-1/2 mb-2"></div>
          <div class="skeleton h-6 w-1/3 mt-3"></div>
        </div>
        <div class="rating absolute top-4 right-4 flex items-center space-x-1">
          <div class="skeleton h-5 w-5 mr-1 rounded-full"></div>
          <div class="skeleton h-6 w-10 rounded"></div>
        </div>
        <div class="absolute bottom-4 right-4 flex space-x-3">
          <div class="skeleton w-24 h-10 rounded-lg"></div>
          <div class="skeleton w-24 h-10 rounded-lg"></div>
          <div class="skeleton w-24 h-10 rounded-lg"></div>
        </div>
      </div>

      <div v-else-if="guesthouses.length === 0" class="mt-6 p-8 bg-blue-100 rounded-xl text-center">
        <p class="text-lg text-gray-700">Belum ada data ruang mess. Silakan tambahkan ruang mess baru.</p>
      </div>

      <div v-else class="space-y-6 mt-6">
        <div
          v-for="guesthouse in guesthouses"
          :key="guesthouse.id"
          class="cardbox-gedung bg-blue-100 p-6 shadow-lg flex relative rounded-xl"
        >
          <img
            :src="guesthouse.guesthouse_media && guesthouse.guesthouse_media.length > 0 ? guesthouse.guesthouse_media[0]?.url : 'https://via.placeholder.com/150'"
            :alt="guesthouse.name"
            class="w-48 h-32 object-cover rounded-lg"
          />

          <div class="flex-1 pl-4">
            <h2 class="nama-gedung text-xl font-black text-black mb-1">{{ guesthouse.name }}</h2>
            <p class="text-black mb-7">{{ guesthouse.address }}</p>
          </div>

          <div class="absolute bottom-4 right-4 flex space-x-3">
            <button
              @click="showGuesthouseDetail(guesthouse.id)"
              class="action-button bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-1 hover-action-button"
            >
              <img src="@/assets/detail.png" alt="Detail" class="w-5 h-5" />
              <span>Detail</span>
            </button>
            <button
              @click="openEditGuesthouseModal(guesthouse)"
              class="action-button bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-1 hover-action-button"
            >
              <img src="@/assets/edit.png" alt="Edit" class="w-5 h-5" />
              <span>Edit</span>
            </button>
            <button
              @click="openDeleteGuesthouseModal(guesthouse)"
              class="action-button bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-1 hover-action-button"
              :disabled="isDeletingGuesthouse"
            >
              <template v-if="isDeletingGuesthouse && guesthouse.id === deletingGuesthouseId">
                <svg class="animate-spin h-5 w-5 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Menghapus...</span>
              </template>
              <template v-else>
                <img src="@/assets/delete.png" alt="Hapus" class="w-5 h-5" />
                <span>Hapus</span>
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>

    <transition name="modal">
      <div
        v-if="showAddGuesthouseModal"
        class="detail-modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="detail-modal-cardbox w-4/5 max-w-4xl rounded-2xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
          <button @click="closeAddGuesthouseModal" class="absolute top-4 right-4 text-gray-700 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 class="text-2xl text-black font-bold data-gedung-text mb-6 text-center">Tambah Gedung Mess</h2>

          <div class="flex justify-center mb-6">
            <div class="w-1/2 flex items-center">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center font-bold mr-2', formStep === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700']">1</div>
              <div class="flex-grow h-1" :class="formStep === 1 ? 'bg-blue-500' : 'bg-gray-300'"></div>
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center font-bold ml-2', formStep === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700']">2</div>
            </div>
          </div>

          <transition name="modal">
            <div v-if="showAddGuesthouseSlideshow" class="photo-slideshow fixed inset-0 flex items-center justify-center z-50">
              <div class="absolute inset-0 bg-black bg-opacity-75"></div>
              <div class="relative w-full h-full max-w-5xl max-h-screen p-4 flex flex-col">
                <button @click="showAddGuesthouseSlideshow = false" class="absolute top-4 right-4 z-30 bg-black bg-opacity-50 text-white hover:text-gray-200 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div class="flex-1 flex items-center justify-center mt-8 mb-12 overflow-hidden relative min-h-[300px]">
                  <div v-if="isImageLoading" class="absolute flex flex-col items-center justify-center space-y-2 z-10">
                    <svg class="animate-spin h-10 w-10 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span class="text-white text-sm font-semibold">Memuat foto...</span>
                  </div>
                  <img v-show="!isImageLoading" :src="guesthousePhotoPreviews[currentAddGuesthouseSlideIndex]" alt="Preview foto gedung mess" class="max-w-full max-h-full object-contain" @load="isImageLoading = false" />
                </div>
                <div class="flex justify-between items-center w-full px-4">
                  <button @click="prevAddGuesthouseSlide" class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20 text-black" :disabled="currentAddGuesthouseSlideIndex === 0" :class="{ 'opacity-50 cursor-not-allowed': currentAddGuesthouseSlideIndex === 0 }">◀</button>
                  <div class="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full z-20">{{ currentAddGuesthouseSlideIndex + 1 }} / {{ guesthousePhotoPreviews.length }}</div>
                  <button @click="nextAddGuesthouseSlide" class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20 text-black" :disabled="currentAddGuesthouseSlideIndex === guesthousePhotoPreviews.length - 1" :class="{ 'opacity-50 cursor-not-allowed': currentAddGuesthouseSlideIndex === guesthousePhotoPreviews.length - 1 }">▶</button>
                </div>
              </div>
            </div>
          </transition>

          <transition name="modal">
            <div v-if="showAddRoomSlideshow" class="photo-slideshow fixed inset-0 flex items-center justify-center z-50">
              <div class="absolute inset-0 bg-black bg-opacity-75"></div>
              <div class="relative w-full h-full max-w-5xl max-h-screen p-4 flex flex-col">
                <button @click="showAddRoomSlideshow = false" class="absolute top-4 right-4 z-30 bg-black bg-opacity-50 text-white hover:text-gray-200 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div class="flex-1 flex items-center justify-center mt-8 mb-12 overflow-hidden relative min-h-[300px]">
                  <div v-if="isImageLoading" class="absolute flex flex-col items-center justify-center space-y-2 z-10">
                    <svg class="animate-spin h-10 w-10 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span class="text-white text-sm font-semibold">Memuat foto...</span>
                  </div>
                  <img v-show="!isImageLoading" :src="roomPhotoPreviews[currentAddRoomSlideIndex]" alt="Preview foto ruang mess" class="max-w-full max-h-full object-contain" @load="isImageLoading = false" />
                </div>
                <div class="flex justify-between items-center w-full px-4">
                  <button @click="prevAddRoomSlide" class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20 text-black" :disabled="currentAddRoomSlideIndex === 0" :class="{ 'opacity-50 cursor-not-allowed': currentAddRoomSlideIndex === 0 }">◀</button>
                  <div class="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full z-20">{{ currentAddRoomSlideIndex + 1 }} / {{ roomPhotoPreviews.length }}</div>
                  <button @click="nextAddRoomSlide" class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20 text-black" :disabled="currentAddRoomSlideIndex === roomPhotoPreviews.length - 1" :class="{ 'opacity-50 cursor-not-allowed': currentAddRoomSlideIndex === roomPhotoPreviews.length - 1 }">▶</button>
                </div>
              </div>
            </div>
          </transition>

          <form v-if="formStep === 1" @submit.prevent="submitGuesthouseForm" class="space-y-4">
            <div class="mb-6 text-center">
              <div class="relative w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <div v-if="guesthousePhotoPreviews.length === 0" class="text-center cursor-pointer" @click="triggerPhotoInput">
                  <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div class="text-black font-bold data-gedung-text">Tambah Foto</div>
                </div>
                <div v-else class="flex overflow-x-auto p-2 w-full h-full">
                  <div v-for="(preview, index) in guesthousePhotoPreviews" :key="index" class="relative flex-shrink-0 w-32 h-32 mr-2">
                    <img :src="preview" class="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity" @click="openAddGuesthouseSlideshow(index)" />
                    <button type="button" @click.stop="removeGuesthousePhoto(index)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div class="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer" @click="triggerPhotoInput">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <input type="file" ref="photoInput" multiple accept="image/*" class="hidden" @change="handleGuesthousePhotoChange" />
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-black data-gedung-text font-bold mb-1">Nama Gedung</label>
                <input v-model="newGuesthouse.name" type="text" class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label class="block text-black data-gedung-text font-bold mb-1">Tentang Gedung</label>
                <textarea v-model="newGuesthouse.description" rows="4" class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" :class="{ 'border-red-500': descriptionError }" required @input="validateDescription"></textarea>
                <p v-if="descriptionError" class="text-red-500 text-sm mt-1">{{ descriptionError }}</p>
                <p v-else class="text-gray-500 text-sm mt-1">{{ newGuesthouse.description.length }} / minimum 10 karakter</p>
              </div>
              <div>
                <label class="block text-black data-gedung-text font-bold mb-1">Luas Bangunan (m²)</label>
                <input v-model="newGuesthouse.area_m2" type="text" @input="validateNumberOnly($event, 'area_m2', 'guesthouse')" class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 250" required />
              </div>
              <div>
                <label class="block text-black data-gedung-text font-bold mb-1">Contact Person</label>
                <input v-model="newGuesthouse.contact_person" type="text" @input="validateNumberOnly($event, 'contact_person', 'guesthouse')" class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 081234567890" required />
              </div>
              <div>
                <label class="block text-black data-gedung-text font-bold mb-1">Fasilitas Utama</label>
                <div class="flex">
                  <input v-model="facilityInput" type="text" class="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 text-black focus:ring-blue-500" placeholder="Tambah Fasilitas Utama..." @keyup.enter="addFacility" />
                  <button type="button" @click="addFacility" class="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 font-semibold data-gedung-text">+ Tambah Fasilitas</button>
                </div>
                <div class="flex flex-wrap gap-2 mt-2 mb-2">
                  <span v-for="(facility, index) in newGuesthouse.facilitiesList" :key="index" class="bg-gray-300 text-black px-3 py-1 rounded-full text-sm flex items-center">
                    {{ facility }}
                    <button type="button" @click="removeFacility(index)" class="ml-2 text-black hover:text-black">×</button>
                  </span>
                </div>
                <p v-if="newGuesthouse.facilitiesList.length > 0 && newGuesthouse.facilitiesList.length < 2" class="text-red-500 text-sm mt-1">⚠️ Minimal harus menambahkan 2 fasilitas utama</p>
              </div>
              <div>
                <label class="block text-black data-gedung-text font-bold mb-1">Lokasi</label>
                <div class="mb-2">
                  <div class="flex">
                    <input v-model="searchQuery" type="text" placeholder="Ketikkan lokasi atau pilih dari peta" class="w-full px-3 py-2 border text-black border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500" @keyup.enter="searchLocation" />
                    <button type="button" @click="searchLocation" class="px-4 py-2 bg-blue-500 data-gedung-text font-bold text-white rounded-r-lg hover:bg-blue-600">Cari</button>
                  </div>
                  <p v-if="searchError" class="text-red-500 text-sm mt-1">{{ searchError }}</p>
                </div>
                <div class="border border-gray-300 rounded-lg overflow-hidden h-48">
                  <div id="map" class="w-full h-full"></div>
                </div>
              </div>
              <div>
                <label class="block text-black data-gedung-text font-bold mb-1">Alamat</label>
                <input v-model="newGuesthouse.address" type="text" class="w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeAddGuesthouseModal" class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold data-gedung-text">Batal</button>
              <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center font-semibold data-gedung-text" :disabled="isSubmittingGuesthouse">
                <svg v-if="isSubmittingGuesthouse" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmittingGuesthouse ? 'Menyimpan...' : 'Selanjutnya' }}
              </button>
            </div>
          </form>

          <div v-if="formStep === 2" class="space-y-4">
            <div class="flex items-center justify-between mb-6">
              <h3 class="data-gedung-text text-2xl font-bold text-black">Kelola Ruang Mess</h3>
              <button type="button" @click="openAddNewRoomModal" class="px-6 py-2 data-gedung-text font-bold bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center shadow-md" :disabled="isSubmittingRoom">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Tambah Ruang Baru
              </button>
            </div>

            <div class="bg-white rounded-lg border border-gray-300 p-4">
              <h4 class="data-gedung-text font-bold text-lg text-black mb-4">Daftar Ruang ({{ newRooms.length }})</h4>
              <div v-if="newRooms.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p class="data-gedung-text text-gray-600 font-semibold mb-2">Belum ada ruang mess</p>
                <p class="data-gedung-text text-gray-500 text-sm">Klik tombol "Tambah Ruang Baru" untuk menambahkan ruang</p>
              </div>
              <div v-else class="space-y-3">
                <div v-for="(room, index) in newRooms" :key="index" class="border border-gray-500 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="flex items-center mb-2">
                        <h4 class="text-lg data-gedung-text font-bold text-black">{{ room.name }}</h4>
                        <div v-if="room.type.toLowerCase() === 'vip'" class="ml-2 bg-yellow-400 px-2 py-0.5 rounded-md text-sm font-bold text-white">VIP</div>
                        <div v-else-if="room.type.toLowerCase() === 'standard'" class="ml-2 bg-gray-400 px-2 py-0.5 rounded-md text-sm font-bold text-white">Standard</div>
                      </div>
                      <p class="text-sm text-black">Total slot: {{ room.total_slot }}</p>
                      <p class="text-sm text-black">Luas: {{ room.area_m2 }} m²</p>
                    </div>
                    <div class="flex space-x-2">
                      <button type="button" @click="selectRoomForEditInAdd(room, index)" class="bg-blue-500 data-gedung-text font-bold text-white px-3 py-1 rounded hover:bg-blue-600" :disabled="isSubmittingRoom">Edit</button>
                      <button type="button" @click="deleteAddRoom(index)" class="bg-red-500 data-gedung-text font-bold text-white px-3 py-1 rounded hover:bg-red-600" :disabled="isSubmittingRoom">Hapus</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="goBackToStep1" class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold data-gedung-text" :disabled="isSubmittingRoom">← Kembali</button>
              <button type="button" @click="submitRoomForm" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex font-semibold data-gedung-text items-center shadow-lg" :disabled="isSubmittingRoom || newRooms.length === 0">
                <svg v-if="isSubmittingRoom" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmittingRoom ? 'Menyimpan...' : '✅ Simpan Gedung & Semua Ruang (' + newRooms.length + ' Ruang)' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div v-if="showAddRoomModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center overflow-y-auto p-4" style="z-index: 10000">
        <div class="edit-room-form bg-white w-full sm:w-3/4 max-w-2xl rounded-lg shadow-lg relative max-h-[90vh] flex flex-col">
          <div class="flex justify-between items-center p-6 pb-4 sticky top-0 bg-white border-b border-gray-200 rounded-t-lg z-10 w-full">
            <h3 class="text-xl data-gedung-text text-black font-bold">{{ selectedAddRoomIndex !== null ? 'Edit Ruang' : 'Tambah Ruang Baru' }}</h3>
            <button @click="closeAddRoomModal" class="text-gray-700 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6 pt-4 pb-0">
            <form @submit.prevent="submitAddRoomModalForm" class="space-y-4 pb-4">
              <div class="mb-6 text-center">
                <div class="relative w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-2 cursor-pointer" @click="triggerRoomPhotoInput">
                  <div v-if="roomPhotoPreviews.length === 0" class="text-center">
                    <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div class="text-black data-gedung-text font-bold">Tambah Foto Ruang</div>
                  </div>
                  <div v-else class="flex overflow-x-auto p-2 w-full h-full">
                    <div v-for="(preview, index) in roomPhotoPreviews" :key="index" class="relative flex-shrink-0 w-32 h-32 mr-2">
                      <img :src="preview" class="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition opacity" @click.stop="openAddRoomSlideshow(index)" />
                      <button type="button" @click.stop="removeRoomPhoto(index)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div class="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer" @click.stop="triggerRoomPhotoInput">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                  <input id="roomPhotoInput" type="file" ref="roomPhotoInput" multiple accept="image/*" class="hidden" @change="handleRoomPhotoChange" />
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-black data-gedung-text font-bold mb-1">Nama Ruang</label>
                  <input v-model="newRoom.name" type="text" class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label class="block text-black data-gedung-text font-bold mb-1">Jenis Ruang</label>
                  <div class="flex gap-4">
                    <label class="flex items-center">
                      <input type="radio" v-model="newRoom.type" value="vip" class="mr-2 text-black" required />
                      <span class="flex items-center text-black"><img src="@/assets/vipclass.png" alt="VIP" class="h-5 mr-1" /></span>
                    </label>
                    <label class="flex items-center">
                      <input type="radio" v-model="newRoom.type" value="standard" class="mr-2" required />
                      <span class="flex items-center text-black"><img src="@/assets/standardclass.png" alt="Standard" class="h-5 mr-1" /></span>
                    </label>
                  </div>
                </div>
                <div>
                  <label class="block text-black data-gedung-text font-bold mb-1">Total Slot</label>
                  <input v-model="newRoom.total_slot" type="text" @input="validateNumberOnly($event, 'total_slot', 'room')" class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 10" required />
                </div>
                <div>
                  <label class="block text-black data-gedung-text font-bold mb-1">Luas Ruangan (m²)</label>
                  <input v-model="newRoom.area_m2" type="text" @input="validateNumberOnly($event, 'area_m2', 'room')" class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 50" required />
                </div>
                <div>
                  <label class="block text-black data-gedung-text font-bold mb-1">Fasilitas Ruang</label>
                  <div class="flex">
                    <input v-model="roomFacilityInput" type="text" class="flex-grow px-3 py-2 border text-black rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tambah Fasilitas Ruang..." />
                    <button type="button" @click="addRoomFacility" class="bg-blue-500 data-gedung-text font-bold text-white px-4 py-2 rounded-r-lg hover:bg-blue-600">+ Tambah</button>
                  </div>
                  <div class="flex flex-wrap gap-2 mt-2 mb-2">
                    <span v-for="(facility, index) in newRoom.facilitiesList" :key="index" class="bg-gray-300 text-black px-3 py-1 rounded-full text-sm flex items-center">
                      {{ facility }}
                      <button type="button" @click="removeRoomFacility(index)" class="ml-2 text-black hover:text-blue-800">×</button>
                    </span>
                  </div>
                </div>
                <div>
                  <label class="block text-black data-gedung-text font-bold mb-1">Kategori Penyewa & Harga Sewa</label>
                  <div class="space-y-3">
                    <div v-for="(pricing, index) in newRoom.pricing" :key="index" class="flex gap-2">
                      <div class="flex-grow">
                        <input v-model="pricing.retribution_type" type="text" class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Kategori Penyewa" required />
                      </div>
                      <div class="w-1/3">
                        <div class="relative">
                          <span class="absolute text-black font-bold data-gedung-text left-3 top-2">Rp</span>
                          <input :value="getFormattedPrice(pricing.price_per_day)" type="text" @input="formatPriceInput($event, 'price_per_day', 'room', index)" class="w-full px-3 py-2 pl-8 ml-1 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Harga/hari" required />
                        </div>
                      </div>
                      <button type="button" @click="removePricing(index)" class="w-10 h-10 bg-red-100 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button type="button" @click="addPricing" class="mt-3 w-full py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Kategori Harga Sewa
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div class="bg-white pt-4 pb-4 px-6 border-t border-gray-200 flex justify-end space-x-3 rounded-b-lg">
            <button type="button" @click="closeAddRoomModal" class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold data-gedung-text">Batal</button>
            <button type="submit" @click="submitAddRoomModalForm" class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center font-semibold data-gedung-text" :disabled="isSubmittingRoom">
              <svg v-if="isSubmittingRoom" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmittingRoom ? 'Menyimpan...' : selectedAddRoomIndex !== null ? 'Update Ruang' : 'Simpan Ruang' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div v-if="showEditGuesthouseModal" class="detail-modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="detail-modal-cardbox w-4/5 max-w-4xl rounded-2xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
          <button @click="closeEditGuesthouseModal" class="absolute top-4 right-4 text-gray-700 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 class="text-2xl text-black font-bold mb-6 data-gedung-text text-center">Edit Gedung Mess</h2>

          <div class="flex justify-center mb-6">
            <div class="w-1/2 flex items-center">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center data-gedung-text font-bold mr-2', editFormStep === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700']">1</div>
              <div class="flex-grow h-1" :class="editFormStep === 1 ? 'bg-blue-500' : 'bg-gray-300'"></div>
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center data-gedung-text font-bold ml-2', editFormStep === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700']">2</div>
            </div>
          </div>

          <form v-if="editFormStep === 1" @submit.prevent="proceedToEditStep2" class="space-y-4">
            <div class="mb-6 text-center">
              <div class="relative w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-2 cursor-pointer">
                <div v-if="editGuesthousePhotoPreviews.length === 0" class="text-center">
                  <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div class="text-black font-bold cursor-pointer" @click="triggerEditPhotoInput">Tambah Foto</div>
                </div>
                <div class="flex overflow-x-auto p-2 w-full h-full">
                  <div v-for="(preview, index) in editGuesthousePhotoPreviews" :key="index" class="relative flex-shrink-0 w-32 h-32 mr-2">
                    <img :src="preview" class="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity" @click="openEditGuesthouseSlideshow(index)" />
                    <button type="button" @click.stop="removeEditGuesthousePhoto(index)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div class="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer" @click="triggerEditPhotoInput">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <input type="file" ref="editPhotoInput" multiple accept="image/*" class="hidden" @change="handleEditGuesthousePhotoChange" />
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-black data-gedung-text font-bold mb-1">Nama Gedung</label>
                <input v-model="editGuesthouse.name" type="text" class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label class="block text-black data-gedung-text font-bold mb-1">Tentang Gedung</label>
                <textarea v-model="editGuesthouse.description" rows="4" class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" :class="{ 'border-red-500': descriptionError }" required @input="validateDescription"></textarea>
                <p v-if="descriptionError" class="text-red-500 text-sm mt-1">{{ descriptionError }}</p>
                <p v-else class="text-gray-500 text-sm mt-1">{{ editGuesthouse.description.length }} / minimum 10 karakter</p>
              </div>
              <div>
                <label class="block text-black data-gedung-text font-bold mb-1">Luas Bangunan (m²)</label>
                <input v-model="editGuesthouse.area_m2" type="text" @input="validateNumberOnly($event, 'area_m2', 'guesthouse')" class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 250" required />
              </div>
              <div>
                <label class="block text-black data-gedung-text font-bold mb-1">Contact Person</label>
                <input v-model="editGuesthouse.contact_person" type="text" @input="validateNumberOnly($event, 'contact_person', 'guesthouse')" class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 081234567890" required />
              </div>
              <div>
                <label class="block text-black data-gedung-text font-bold mb-1">Fasilitas Utama</label>
                <div class="flex">
                  <input v-model="editFacilityInput" type="text" class="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 text-black focus:ring-blue-500" placeholder="Tambah Fasilitas Utama..." @keyup.enter="addEditFacility" />
                  <button type="button" @click="addEditFacility" class="bg-blue-500 text-white data-gedung-text font-bold px-4 py-2 rounded-r-lg hover:bg-blue-600">+ Tambah Fasilitas</button>
                </div>
                <div class="flex flex-wrap gap-2 mt-2 mb-2">
                  <span v-for="(facility, index) in editGuesthouse.facilitiesList" :key="index" class="bg-gray-300 text-black px-3 py-1 rounded-full text-sm flex items-center">
                    {{ facility }}
                    <button type="button" @click="removeEditFacility(index)" class="ml-2 text-black hover:text-blue-800">×</button>
                  </span>
                </div>
                <p v-if="editGuesthouse.facilitiesList.length > 0 && editGuesthouse.facilitiesList.length < 2" class="text-red-500 text-sm mt-1">⚠️ Minimal harus menambahkan 2 fasilitas utama</p>
              </div>
              <div>
                <label class="block text-black data-gedung-text font-bold mb-1">Lokasi</label>
                <div class="mb-2">
                  <div class="flex">
                    <input v-model="editSearchQuery" type="text" placeholder="Ketikkan lokasi atau pilih dari peta" class="w-full px-3 py-2 border text-black border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500" @keyup.enter="searchEditLocation" />
                    <button type="button" @click="searchEditLocation" class="px-4 py-2 bg-blue-500 text-white data-gedung-text font-bold rounded-r-lg hover:bg-blue-600">Cari</button>
                  </div>
                  <p v-if="editSearchError" class="text-red-500 text-sm mt-1">{{ editSearchError }}</p>
                </div>
                <div class="border border-gray-300 rounded-lg overflow-hidden h-48">
                  <div id="editMap" class="w-full h-full"></div>
                </div>
              </div>
              <div>
                <label class="block text-black data-gedung-text font-bold mb-1">Alamat</label>
                <input v-model="editGuesthouse.address" type="text" class="w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="closeEditGuesthouseModal" class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold data-gedung-text">Batal</button>
              <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center font-semibold data-gedung-text">Selanjutnya</button>
            </div>
          </form>

          <div v-if="editFormStep === 2" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-xl data-gedung-text text-black font-bold">Kelola Ruang Mess</h3>
              <button @click="addRoomToGuesthouse" class="bg-blue-500 data-gedung-text text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Tambah Ruang</span>
              </button>
            </div>

            <div v-if="editRooms.length === 0" class="text-center py-8 border rounded-lg">
              <p class="text-gray-600">Belum ada ruang mess. Silakan tambahkan ruang baru.</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="room in editRooms" :key="room.id" class="border border-gray-500 p-4 rounded-lg">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center mb-2">
                      <h4 class="text-lg data-gedung-text font-bold text-black">{{ room.name }}</h4>
                      <div v-if="room.type.toLowerCase() === 'vip'" class="ml-2 bg-yellow-400 px-2 py-0.5 rounded-md text-sm font-bold text-white">VIP</div>
                      <div v-else-if="room.type.toLowerCase() === 'standard'" class="ml-2 bg-gray-400 px-2 py-0.5 rounded-md text-sm font-bold text-white">Standard</div>
                    </div>
                    <p class="text-sm text-black">Total slot: {{ room.total_slot }}</p>
                    <p class="text-sm text-black">Luas: {{ room.area_m2 }} m²</p>
                  </div>

                  <div class="flex space-x-2">
                    <button @click="selectRoomForEdit(room)" class="bg-blue-500 data-gedung-text font-bold text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                    <button @click="deleteRoom(room)" class="bg-red-500 data-gedung-text font-bold text-white px-3 py-1 rounded hover:bg-red-600" :disabled="isDeletingRoom">Hapus</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="goBackToEditStep1" class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold data-gedung-text">Kembali</button>
              <button type="button" @click="submitEditGuesthouseForm" class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex font-semibold data-gedung-text items-center" :disabled="isSubmittingEditGuesthouse">
                <svg v-if="isSubmittingEditGuesthouse" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmittingEditGuesthouse ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </div>

          <transition name="modal">
            <div v-if="selectedEditRoom" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-60 overflow-y-auto p-4" style="z-index: 10000">
              <div class="edit-room-form bg-white w-full sm:w-3/4 max-w-2xl rounded-lg shadow-lg relative max-h-[90vh] flex flex-col">
                <div class="flex justify-between items-center p-6 pb-4 sticky top-0 bg-white border-b border-gray-200 rounded-t-lg z-10 w-full">
                  <h3 class="text-xl data-gedung-text text-black font-bold">{{ selectedEditRoom.isNew ? 'Tambah Ruang Baru' : 'Edit Ruang' }}</h3>
                  <button @click="closeEditRoomForm" class="text-gray-700 hover:text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div class="flex-1 overflow-y-auto p-6 pt-4">
                  <form @submit.prevent="selectedEditRoom.isNew ? submitNewRoomForm() : submitEditRoomForm()" class="space-y-4">
                    <div class="mb-6 text-center">
                      <div class="relative w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-2 cursor-pointer" @click="triggerEditRoomPhotoInput">
                        <div v-if="editRoomPhotoPreviews.length === 0" class="text-center">
                          <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <div class="text-black font-bold">Tambah Foto Ruang</div>
                        </div>
                        <div v-else class="flex overflow-x-auto p-2 w-full h-full">
                          <div v-for="(preview, index) in editRoomPhotoPreviews" :key="index" class="relative flex-shrink-0 w-32 h-32 mr-2">
                            <img :src="preview" class="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity" @click.stop="openEditRoomSlideshow(index)" />
                            <button type="button" @click.stop="removeEditRoomPhoto(index)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div class="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer" @click.stop="triggerEditRoomPhotoInput">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
                        <input type="file" ref="editRoomPhotoInput" id="editRoomPhotoInput" multiple accept="image/*" class="hidden" @change="handleEditRoomPhotoChange" />
                      </div>
                    </div>

                    <div class="space-y-4">
                      <div>
                        <label class="block text-black data-gedung-text font-bold mb-1">Nama Ruang</label>
                        <input id="editRoomName" v-model="editRoom.name" type="text" class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                      </div>
                      <div>
                        <label class="block text-black data-gedung-text font-bold mb-1">Jenis Ruang</label>
                        <div class="flex gap-4">
                          <label class="flex items-center">
                            <input type="radio" v-model="editRoom.type" value="vip" class="mr-2 text-black" required />
                            <span class="flex items-center text-black"><img src="@/assets/vipclass.png" alt="VIP" class="h-5 mr-1" /></span>
                          </label>
                          <label class="flex items-center">
                            <input type="radio" v-model="editRoom.type" value="standard" class="mr-2" required />
                            <span class="flex items-center text-black"><img src="@/assets/standardclass.png" alt="Standard" class="h-5 mr-1" /></span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label class="block text-black data-gedung-text font-bold mb-1">Total Slot</label>
                        <input v-model="editRoom.total_slot" type="text" @input="validateNumberOnly($event, 'total_slot', 'room')" class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 10" required />
                      </div>
                      <div>
                        <label class="block text-black data-gedung-text font-bold mb-1">Luas Ruangan (m²)</label>
                        <input v-model="editRoom.area_m2" type="text" @input="validateNumberOnly($event, 'area_m2', 'room')" class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 50" required />
                      </div>
                      <div>
                        <label class="block text-black data-gedung-text font-bold mb-1">Fasilitas Ruang</label>
                        <div class="flex">
                          <input v-model="editRoomFacilityInput" type="text" class="flex-grow px-3 py-2 border text-black rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tambah Fasilitas Ruang..." @keyup.enter="addEditRoomFacility" />
                          <button type="button" @click="addEditRoomFacility" class="bg-blue-500 data-gedung-text font-bold text-white px-4 py-2 rounded-r-lg hover:bg-blue-600">+ Tambah</button>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-2 mb-2">
                          <span v-for="(facility, index) in editRoom.facilitiesList" :key="index" class="bg-gray-200 text-black px-3 py-1 rounded-full text-sm flex items-center">
                            {{ facility }}
                            <button type="button" @click="removeEditRoomFacility(index)" class="ml-2 text-black">×</button>
                          </span>
                        </div>
                      </div>
                      <div>
                        <label class="block text-black data-gedung-text font-bold mb-1">Kategori Penyewa & Harga Sewa</label>
                        <div class="space-y-3">
                          <div v-for="(pricing, index) in editRoom.pricing" :key="index" class="flex gap-2">
                            <div class="flex-grow">
                              <input v-model="pricing.retribution_type" type="text" class="w-full px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Kategori Penyewa" required />
                            </div>
                            <div class="w-1/3">
                              <div class="relative">
                                <span class="absolute text-black font-bold data-gedung-text left-3 top-2">Rp</span>
                                <input :value="getFormattedPrice(pricing.price_per_day)" type="text" @input="formatPriceInput($event, 'price_per_day', 'room', index)" class="w-full px-3 py-2 pl-8 ml-1 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Harga/hari" required />
                              </div>
                            </div>
                            <button type="button" @click="removeEditPricing(index)" class="w-10 h-10 bg-red-100 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-200">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <button type="button" @click="addEditPricing" class="mt-3 w-full py-2 bg-blue-100 font-bold data-gedung-text text-blue-700 rounded-lg hover:bg-blue-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                          Tambah Kategori Harga Sewa
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div class="p-6 pt-4 sticky bottom-0 bg-white border-t border-gray-200 rounded-b-lg z-10 w-full">
                  <div class="flex justify-end space-x-3 w-full">
                    <button type="button" @click="closeEditRoomForm" class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold data-gedung-text">Batal</button>
                    <button type="submit" @click="selectedEditRoom.isNew ? submitNewRoomForm() : submitEditRoomForm()" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center font-semibold data-gedung-text" :disabled="isSubmittingEditRoom">
                      <svg v-if="isSubmittingEditRoom" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ isSubmittingEditRoom ? 'Menyimpan...' : 'Simpan' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div v-if="showEditGuesthouseSlideshow" class="photo-slideshow fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black bg-opacity-75"></div>
        <div class="relative w-full h-full max-w-5xl max-h-screen p-4 flex flex-col">
          <button @click="showEditGuesthouseSlideshow = false" class="absolute top-4 right-4 z-30 bg-black bg-opacity-50 text-white hover:text-gray-200 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="flex-1 flex items-center justify-center mt-8 mb-12 overflow-hidden relative min-h-[300px]">
            <div v-if="isImageLoading" class="absolute flex flex-col items-center justify-center space-y-2 z-10">
              <svg class="animate-spin h-10 w-10 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span class="text-white text-sm font-semibold">Memuat foto...</span>
            </div>
            <img v-show="!isImageLoading" :src="editGuesthousePhotoPreviews[currentEditGuesthouseSlideIndex]" alt="Preview foto gedung mess" class="max-w-full max-h-full object-contain" @load="isImageLoading = false" />
          </div>
          <div class="flex justify-between items-center w-full px-4">
            <button @click="prevEditGuesthouseSlide" class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20 text-black" :disabled="currentEditGuesthouseSlideIndex === 0" :class="{ 'opacity-50 cursor-not-allowed': currentEditGuesthouseSlideIndex === 0 }">◀</button>
            <div class="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full z-20">{{ currentEditGuesthouseSlideIndex + 1 }} / {{ editGuesthousePhotoPreviews.length }}</div>
            <button @click="nextEditGuesthouseSlide" class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20 text-black" :disabled="currentEditGuesthouseSlideIndex === editGuesthousePhotoPreviews.length - 1" :class="{ 'opacity-50 cursor-not-allowed': currentEditGuesthouseSlideIndex === editGuesthousePhotoPreviews.length - 1, }">▶</button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div v-if="showEditRoomSlideshow" class="photo-slideshow fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black bg-opacity-75"></div>
        <div class="relative w-full h-full max-w-5xl max-h-screen p-4 flex flex-col">
          <button @click="showEditRoomSlideshow = false" class="absolute top-4 right-4 z-30 bg-black bg-opacity-50 text-white hover:text-gray-200 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="flex-1 flex items-center justify-center mt-8 mb-12 overflow-hidden relative min-h-[300px]">
            <div v-if="isImageLoading" class="absolute flex flex-col items-center justify-center space-y-2 z-10">
              <svg class="animate-spin h-10 w-10 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span class="text-white text-sm font-semibold">Memuat foto...</span>
            </div>
            <img v-show="!isImageLoading" :src="editRoomPhotoPreviews[currentEditRoomSlideIndex]" alt="Preview foto ruang mess" class="max-w-full max-h-full object-contain" @load="isImageLoading = false" />
          </div>
          <div class="flex justify-between items-center w-full px-4">
            <button @click="prevEditRoomSlide" class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20 text-black" :disabled="currentEditRoomSlideIndex === 0" :class="{ 'opacity-50 cursor-not-allowed': currentEditRoomSlideIndex === 0 }">◀</button>
            <div class="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full z-20">{{ currentEditRoomSlideIndex + 1 }} / {{ editRoomPhotoPreviews.length }}</div>
            <button @click="nextEditRoomSlide" class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20" :disabled="currentEditRoomSlideIndex === editRoomPhotoPreviews.length - 1" :class="{ 'opacity-50 cursor-not-allowed': currentEditRoomSlideIndex === editRoomPhotoPreviews.length - 1, }">▶</button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div v-if="showSlideshow" class="photo-slideshow fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black bg-opacity-75"></div>
        <div class="relative w-full h-full max-w-5xl max-h-screen p-4 flex flex-col">
          <button @click="showSlideshow = false" class="absolute top-4 right-4 z-30 bg-black bg-opacity-50 text-white hover:text-gray-200 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="flex-1 flex items-center justify-center mt-8 mb-12 overflow-hidden relative min-h-[300px]">
            <div v-if="isImageLoading" class="absolute flex flex-col items-center justify-center space-y-2 z-10">
              <svg class="animate-spin h-10 w-10 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span class="text-white text-sm font-semibold">Memuat foto...</span>
            </div>
            <img v-show="!isImageLoading" :src="selectedGuesthouse?.guesthouse_media[currentSlideIndex]?.url" :alt="selectedGuesthouse?.name" class="max-w-full max-h-full object-contain" @load="isImageLoading = false" />
          </div>
          <div class="flex justify-between items-center w-full px-4">
            <button @click="prevSlide" class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20 text-black" :disabled="currentSlideIndex === 0" :class="{ 'opacity-50 cursor-not-allowed': currentSlideIndex === 0 }">◀</button>
            <div class="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full z-20">{{ currentSlideIndex + 1 }} / {{ selectedGuesthouse?.guesthouse_media.length }}</div>
            <button @click="nextSlide" class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20 text-black" :disabled="currentSlideIndex === selectedGuesthouse?.guesthouse_media.length - 1" :class="{ 'opacity-50 cursor-not-allowed': currentSlideIndex === selectedGuesthouse?.guesthouse_media.length - 1, }">▶</button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div v-if="showRoomSlideshow" class="photo-slideshow fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black bg-opacity-75"></div>
        <div class="relative w-full h-full max-w-5xl max-h-screen p-4 flex flex-col">
          <button @click="showRoomSlideshow = false" class="absolute top-4 right-4 z-30 bg-black bg-opacity-50 text-white hover:text-gray-200 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="flex-1 flex items-center justify-center mt-8 mb-12 overflow-hidden relative min-h-[300px]">
            <div v-if="isImageLoading" class="absolute flex flex-col items-center justify-center space-y-2 z-10">
              <svg class="animate-spin h-10 w-10 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span class="text-white text-sm font-semibold">Memuat foto...</span>
            </div>
            <img v-show="!isImageLoading" :src="selectedRoom?.media[currentRoomSlideIndex]?.url" :alt="selectedRoom?.name" class="max-w-full max-h-full object-contain" @load="isImageLoading = false" />
          </div>
          <div class="flex justify-between items-center w-full px-4">
            <button @click="prevRoomSlide" class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20 text-black" :disabled="currentRoomSlideIndex === 0" :class="{ 'opacity-50 cursor-not-allowed': currentRoomSlideIndex === 0 }">◀</button>
            <div class="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full z-20">{{ currentRoomSlideIndex + 1 }} / {{ selectedRoom?.media.length }}</div>
            <button @click="nextRoomSlide" class="navigation-button bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-3 text-xl z-20 text-black" :disabled="currentRoomSlideIndex === selectedRoom?.media.length - 1" :class="{ 'opacity-50 cursor-not-allowed': currentRoomSlideIndex === selectedRoom?.media.length - 1, }">▶</button>
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
  name: 'DataRuangMessView',
  components: { Navigation },
  inject: ['showToast'],

  watch: {
    currentReviewSlideIndex() { this.isImageLoading = true },
    currentAddGuesthouseSlideIndex() { this.isImageLoading = true },
    currentAddRoomSlideIndex() { this.isImageLoading = true },
    currentEditRoomSlideIndex() { this.isImageLoading = true },
    currentSlideIndex() { this.isImageLoading = true },
    currentRoomSlideIndex() { this.isImageLoading = true },
    currentEditGuesthouseSlideIndex() { this.isImageLoading = true },

    showReviewSlideshow(val) { if (val) this.isImageLoading = true },
    showAddGuesthouseSlideshow(val) { if (val) this.isImageLoading = true },
    showAddRoomSlideshow(val) { if (val) this.isImageLoading = true },
    showEditRoomSlideshow(val) { if (val) this.isImageLoading = true },
    showSlideshow(val) { if (val) this.isImageLoading = true },
    showRoomSlideshow(val) { if (val) this.isImageLoading = true },
    showEditGuesthouseSlideshow(val) { if (val) this.isImageLoading = true },

    formStep(newVal, oldVal) {
      if (newVal === 1 && oldVal === 2) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.reinitializeMap()
          }, 400)
        })
      }
    },

    showAddGuesthouseModal(newVal) {
      if (newVal && this.formStep === 1) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.initMap()
          }, 400)
        })
      }
    },

    editFormStep(newVal, oldVal) {
      if (newVal === 1 && oldVal === 2) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.reinitializeEditMap()
          }, 400)
        })
      }
    },

    showEditGuesthouseModal(newVal) {
      if (newVal && this.editFormStep === 1) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.initEditMap()
          }, 400)
        })
      }
    },
  },

  data() {
    return {
      descriptionError: '',
      guesthouses: [],
      selectedGuesthouse: null,
      rooms: [],
      selectedRoom: null,
      reviews: [],
      admins: {},
      selectedReview: null,
      createdGuesthouseId: null,
      showEditGuesthouseModal: false,
      editFormStep: 1,
      editGuesthouseId: null,
      isSubmittingEditGuesthouse: false,
      isSubmittingEditRoom: false,
      isDeletingRoom: false,
      deletingRoomId: null,
      showDeleteRoomModal: false,
      roomToDelete: null,
      showDeleteGuesthouseModal: false,
      guesthouseToDelete: null,
      isDeletingGuesthouse: false,
      deletingGuesthouseId: null,
      hasUnsavedChanges: false,
      showCancelConfirmModal: false,
      pendingDeletedRooms: [],
      pendingEditedRooms: [],
      pendingNewRooms: [],
      originalEditRooms: [],
      map: null,
      marker: null,
      searchQuery: '',
      searchError: null,
      editMap: null,
      editMarker: null,
      editSearchError: null,
      isLoading: true,
      isLoadingDetail: false,
      isLoadingRooms: false,
      isLoadingReviews: false,
      isLoadingAdmins: false,
      isSubmittingGuesthouse: false,
      isSubmittingRoom: false,
      isImageLoading: false,
      showModal: false,
      showAddGuesthouseModal: false,
      showAddGuesthouseSlideshow: false,
      showAddRoomSlideshow: false,
      currentAddGuesthouseSlideIndex: 0,
      currentAddRoomSlideIndex: 0,
      showEditGuesthouseSlideshow: false,
      currentEditGuesthouseSlideIndex: 0,
      showEditRoomSlideshow: false,
      currentEditRoomSlideIndex: 0,
      formStep: 1,
      showSlideshow: false,
      showRoomSlideshow: false,
      showReviewSlideshow: false,
      currentSlideIndex: 0,
      currentRoomSlideIndex: 0,
      currentReviewSlideIndex: 0,
      isHoveringPhotoButton: false,
      newGuesthouse: {
        name: '',
        address: '',
        description: '',
        facilities: '',
        facilitiesList: [],
        area_m2: '',
        contact_person: '',
        latitude: '',
        longitude: '',
      },
      guesthousePhotos: [],
      guesthousePhotoPreviews: [],
      newRooms: [],
      currentRoomIndex: null,
      showAddRoomModal: false,
      selectedAddRoomIndex: null,
      newRoom: {
        name: '',
        type: 'standard',
        facilities: '',
        facilitiesList: [],
        total_slot: 1,
        area_m2: '',
        pricing: [
          {
            retribution_type: '',
            price_per_day: '',
            is_available: true,
          },
        ],
        media: [],
      },
      roomPhotos: [],
      roomPhotoPreviews: [],
      facilityInput: '',
      roomFacilityInput: '',
      activeReplyId: null,
      replyText: '',
      isSubmittingReply: false,
      isConfirmingReplyDelete: null,
      isDeletingReply: false,
      activeEditReplyId: null,
      editReplyText: '',
      isUpdatingReply: false,
      editGuesthouse: {
        id: null,
        name: '',
        address: '',
        description: '',
        facilities: '',
        facilitiesList: [],
        area_m2: '',
        contact_person: '',
        latitude: '',
        longitude: '',
        media: [],
      },
      editGuesthousePhotos: [],
      editGuesthousePhotoPreviews: [],
      deletedGuesthouseMedia: [],
      editRooms: [],
      editRoom: {
        id: null,
        name: '',
        type: 'standard',
        facilitiesList: [],
        total_slot: 1,
        area_m2: '',
        pricing: [],
        media: [],
      },
      editRoomPhotos: [],
      editRoomPhotoPreviews: [],
      deletedRoomMedia: [],
      editRoomFacilityInput: '',
      selectedEditRoom: null,
    }
  },
  computed: {
    facilitiesList() {
      if (!this.selectedGuesthouse || !this.selectedGuesthouse.facilities) return []
      return this.selectedGuesthouse.facilities.split(';').map((item) => item.trim())
    },
  },
  methods: {
    validateDescription() {
      const description = this.showAddGuesthouseModal ? this.newGuesthouse.description : this.editGuesthouse.description
      if (description.length < 10) {
        this.descriptionError = 'Tentang gedung harus minimal 10 karakter'
      } else {
        this.descriptionError = ''
      }
    },
    validateNumberOnly(event, field, type, index = null) {
      let value = event.target.value
      value = value.replace(/[^0-9]/g, '')
      if (field !== 'contact_person') {
        if (value.length > 1 && value.startsWith('0')) {
          value = value.replace(/^0+/, '')
        }
      }
      if (type === 'guesthouse') {
        if (this.showAddGuesthouseModal) this.newGuesthouse[field] = value
        else if (this.showEditGuesthouseModal) this.editGuesthouse[field] = value
      } else if (type === 'room') {
        if (this.showAddGuesthouseModal || this.showAddRoomModal) this.newRoom[field] = value
        else if (this.showEditGuesthouseModal) this.editRoom[field] = value
      } else if (type === 'pricing' && index !== null) {
        if (this.showAddGuesthouseModal || this.showAddRoomModal) this.newRoom.pricing[index][field] = value
        else if (this.showEditGuesthouseModal) this.editRoom.pricing[index][field] = value
      }
      event.target.value = value
    },
    formatPriceInput(event, field, type, index = null) {
      let value = event.target.value
      let numericValue = value.replace(/[^0-9]/g, '')
      if (numericValue.length > 1 && numericValue.startsWith('0')) {
        numericValue = numericValue.replace(/^0+/, '')
      }
      if (type === 'room' && index !== null) {
        if (this.showAddGuesthouseModal || this.showAddRoomModal) this.newRoom.pricing[index][field] = numericValue
        else if (this.showEditGuesthouseModal && this.selectedEditRoom) this.selectedEditRoom.pricing[index][field] = numericValue
      }
      event.target.value = numericValue ? new Intl.NumberFormat('id-ID').format(numericValue) : ''
    },
    getFormattedPrice(price) {
      if (!price) return ''
      const numericValue = price.toString().replace(/[^0-9]/g, '')
      return numericValue ? new Intl.NumberFormat('id-ID').format(numericValue) : ''
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID').format(value)
    },
    async fetchGuesthouses() {
      this.isLoading = true
      const token = localStorage.getItem('authToken')
      if (!token) {
        this.showToast('warning', 'Anda harus login terlebih dahulu!')
        this.isLoading = false
        return
      }
      try {
        const response = await apiService.getGuesthouses(token)
        if (response.data.status) this.guesthouses = response.data.data
        else this.showToast('error', 'Gagal mengambil data ruang mess.')
      } catch (error) {
        console.error('Error fetching guesthouses:', error)
        this.showToast('error', 'Terjadi kesalahan saat mengambil data.')
      } finally {
        this.isLoading = false
      }
    },
    openAddGuesthouseModal() {
      this.showAddGuesthouseModal = true
      this.resetForms()
    },
    openAddGuesthouseSlideshow(startIndex = 0) {
      this.currentAddGuesthouseSlideIndex = startIndex
      this.showAddGuesthouseSlideshow = true
    },
    openAddRoomSlideshow(startIndex = 0) {
      this.currentAddRoomSlideIndex = startIndex
      this.showAddRoomSlideshow = true
    },
    openEditGuesthouseSlideshow(startIndex = 0) {
      this.currentEditGuesthouseSlideIndex = startIndex
      this.showEditGuesthouseSlideshow = true
    },
    nextEditGuesthouseSlide() {
      if (this.currentEditGuesthouseSlideIndex < this.editGuesthousePhotoPreviews.length - 1) this.currentEditGuesthouseSlideIndex++
    },
    prevEditGuesthouseSlide() {
      if (this.currentEditGuesthouseSlideIndex > 0) this.currentEditGuesthouseSlideIndex--
    },
    nextAddGuesthouseSlide() {
      if (this.currentAddGuesthouseSlideIndex < this.guesthousePhotoPreviews.length - 1) this.currentAddGuesthouseSlideIndex++
    },
    prevAddGuesthouseSlide() {
      if (this.currentAddGuesthouseSlideIndex > 0) this.currentAddGuesthouseSlideIndex--
    },
    nextAddRoomSlide() {
      if (this.currentAddRoomSlideIndex < this.roomPhotoPreviews.length - 1) this.currentAddRoomSlideIndex++
    },
    prevAddRoomSlide() {
      if (this.currentAddRoomSlideIndex > 0) this.currentAddRoomSlideIndex--
    },
    closeAddGuesthouseModal() {
      this.showAddGuesthouseModal = false
      this.resetForms()
    },
    openEditRoomSlideshow(startIndex = 0) {
      this.currentEditRoomSlideIndex = startIndex
      this.showEditRoomSlideshow = true
    },
    nextEditRoomSlide() {
      if (this.currentEditRoomSlideIndex < this.editRoomPhotoPreviews.length - 1) this.currentEditRoomSlideIndex++
    },
    prevEditRoomSlide() {
      if (this.currentEditRoomSlideIndex > 0) this.currentEditRoomSlideIndex--
    },
    reinitializeEditMap() {
      const editMapContainer = document.getElementById('editMap')
      if (!editMapContainer) {
        setTimeout(() => this.reinitializeEditMap(), 200)
        return
      }
      if (this.editMap) {
        try {
          this.editMap.remove()
          this.editMap = null
        } catch (error) {
          console.warn(error)
        }
      }
      this.editMarker = null
      editMapContainer.innerHTML = ''
      this.initEditMap()
    },
    goBackToStep1() {
      this.formStep = 1
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.map) {
            try { this.map.remove(); this.map = null; } catch (e) { console.warn(e); }
          }
          this.marker = null
          const mapContainer = document.getElementById('map')
          if (mapContainer) mapContainer.innerHTML = ''
          this.initMap()
        }, 100)
      })
    },
    triggerPhotoInput() { this.$refs.photoInput.click() },
    handleGuesthousePhotoChange(event) {
      const files = event.target.files
      if (!files.length) return
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        this.guesthousePhotos.push(file)
        const reader = new FileReader()
        reader.onload = (e) => { this.guesthousePhotoPreviews.push(e.target.result) }
        reader.readAsDataURL(file)
      }
    },
    removeGuesthousePhoto(index) {
      this.guesthousePhotos.splice(index, 1)
      this.guesthousePhotoPreviews.splice(index, 1)
    },
    triggerRoomPhotoInput() { this.$refs.roomPhotoInput.click() },
    handleRoomPhotoChange(event) {
      const files = event.target.files
      if (!files || !files.length) return
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        this.roomPhotos.push(file)
        this.newRoom.media.push({ file, name: file.name, size: file.size, type: file.type, lastModified: file.lastModified, preview: null })
        const reader = new FileReader()
        reader.onload = (e) => { this.roomPhotoPreviews.push(e.target.result) }
        reader.readAsDataURL(file)
      }
    },
    removeRoomPhoto(index) {
      this.roomPhotos.splice(index, 1)
      this.roomPhotoPreviews.splice(index, 1)
      this.newRoom.media.splice(index, 1)
    },
    addFacility() {
      const facility = this.facilityInput.trim()
      if (facility) { this.newGuesthouse.facilitiesList.push(facility); this.facilityInput = ''; }
    },
    removeFacility(index) { this.newGuesthouse.facilitiesList.splice(index, 1) },
    addRoomFacility() {
      const facility = this.roomFacilityInput.trim()
      if (facility) { this.newRoom.facilitiesList.push(facility); this.roomFacilityInput = ''; }
    },
    removeRoomFacility(index) { this.newRoom.facilitiesList.splice(index, 1) },
    addQuickRoomFacility(facility) {
      if (!this.newRoom.facilitiesList.includes(facility)) this.newRoom.facilitiesList.push(facility)
    },
    addPricing() {
      this.newRoom.pricing.push({ retribution_type: '', price_per_day: 0, is_available: true })
    },
    removePricing(index) {
      if (this.newRoom.pricing.length > 1) this.newRoom.pricing.splice(index, 1)
      else this.showToast('warning', 'Minimal harus ada satu kategori harga sewa')
    },
    resetRoomForm() {
      this.currentRoomIndex = null
      this.selectedAddRoomIndex = null
      this.newRoom = { name: '', type: 'standard', facilities: '', facilitiesList: [], total_slot: 1, area_m2: '', pricing: [{ retribution_type: '', price_per_day: '', is_available: true }], media: [] }
      this.roomPhotos = []
      this.roomPhotoPreviews = []
      this.roomFacilityInput = ''
    },
    deleteAddRoom(index) {
      if (confirm('Apakah Anda yakin ingin menghapus ruang ini?')) {
        this.newRooms.splice(index, 1)
        this.showToast('success', 'Ruang berhasil dihapus!')
      }
    },
    openAddNewRoomModal() {
      this.selectedAddRoomIndex = null
      this.resetRoomForm()
      this.showAddRoomModal = true
    },
    selectRoomForEditInAdd(room, index) {
      this.selectedAddRoomIndex = index
      this.newRoom = JSON.parse(JSON.stringify(room))
      this.roomPhotos = room.photos ? [...room.photos] : []
      this.roomPhotoPreviews = room.photoPreviews ? [...room.photoPreviews] : []
      this.showAddRoomModal = true
    },
    closeAddRoomModal() {
      this.showAddRoomModal = false
      this.selectedAddRoomIndex = null
      this.resetRoomForm()
    },
    submitAddRoomModalForm() {
      if (!this.newRoom.name.trim()) { this.showToast('warning', 'Nama ruang harus diisi'); return; }
      if (this.newRoom.facilitiesList.length === 0) { this.showToast('warning', 'Silakan tambahkan minimal satu fasilitas ruang'); return; }
      if (!this.newRoom.total_slot || parseInt(this.newRoom.total_slot) <= 0) { this.showToast('warning', 'Silakan isi total slot dengan angka yang valid'); return; }
      if (!this.newRoom.area_m2 || parseInt(this.newRoom.area_m2) <= 0) { this.showToast('warning', 'Silakan isi luas ruangan dengan angka yang valid'); return; }
      if (this.newRoom.pricing.some((p) => !p.retribution_type.trim() || !p.price_per_day || parseInt(p.price_per_day) <= 0)) { this.showToast('warning', 'Silakan lengkapi semua kategori dan harga sewa'); return; }

      const roomData = { ...JSON.parse(JSON.stringify(this.newRoom)), photos: [...this.roomPhotos], photoPreviews: [...this.roomPhotoPreviews] }
      if (this.selectedAddRoomIndex !== null) {
        this.newRooms[this.selectedAddRoomIndex] = roomData
        this.showToast('success', 'Ruang berhasil diperbarui!')
      } else {
        this.newRooms.push(roomData)
        this.showToast('success', 'Ruang berhasil ditambahkan!')
      }
      this.closeAddRoomModal()
    },
    initMap() {
      if (!window.L) {
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'
        script.integrity = 'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=='
        script.crossOrigin = ''
        document.head.appendChild(script)

        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'
        link.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=='
        link.crossOrigin = ''
        document.head.appendChild(link)

        script.onload = () => { this.createMap() }
      } else {
        this.createMap()
      }
    },
    createMap() {
      if (!document.getElementById('map')) {
        setTimeout(() => this.createMap(), 200)
        return
      }
      const defaultLat = -6.2088, defaultLng = 106.8456
      if (this.map) { this.map.remove(); this.map = null; }
      try {
        this.map = L.map('map').setView([defaultLat, defaultLng], 13)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(this.map)
        if (this.newGuesthouse.latitude && this.newGuesthouse.longitude) {
          const lat = parseFloat(this.newGuesthouse.latitude), lng = parseFloat(this.newGuesthouse.longitude)
          this.marker = L.marker([lat, lng]).addTo(this.map)
          this.map.setView([lat, lng], 15)
        }
        this.map.on('click', (e) => {
          const { lat, lng } = e.latlng
          if (this.marker) this.marker.setLatLng([lat, lng])
          else this.marker = L.marker([lat, lng]).addTo(this.map)
          this.newGuesthouse.latitude = lat.toFixed(10)
          this.newGuesthouse.longitude = lng.toFixed(10)
        })
        setTimeout(() => { if (this.map) this.map.invalidateSize() }, 300)
      } catch (error) { console.error(error) }
    },
    async searchLocation() {
      if (!this.searchQuery.trim()) { this.searchError = 'Silakan masukkan nama lokasi'; return; }
      this.searchError = null
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: { q: this.searchQuery, format: 'json', limit: 1, addressdetails: 1 },
          headers: { 'Accept-Language': 'id' }
        })
        if (response.data && response.data.length > 0) {
          const result = response.data[0], lat = parseFloat(result.lat), lng = parseFloat(result.lon)
          this.map.setView([lat, lng], 15)
          if (this.marker) this.marker.setLatLng([lat, lng])
          else this.marker = L.marker([lat, lng]).addTo(this.map)
          this.newGuesthouse.latitude = lat.toFixed(10)
          this.newGuesthouse.longitude = lng.toFixed(10)
          if (!this.newGuesthouse.address && result.display_name) this.newGuesthouse.address = result.display_name
        } else {
          this.searchError = 'Lokasi tidak ditemukan'
        }
      } catch (error) { this.searchError = 'Terjadi kesalahan saat mencari lokasi.' }
    },
    async submitGuesthouseForm() {
      if (this.newGuesthouse.description.length < 10) { this.showToast('warning', 'Tentang gedung harus minimal 10 karakter'); return; }
      if (!this.newGuesthouse.address || this.newGuesthouse.address.trim().length < 5) { this.showToast('warning', 'Alamat harus minimal 5 karakter'); return; }
      if (this.newGuesthouse.facilitiesList.length < 2) { this.showToast('warning', 'Silakan tambahkan minimal 2 fasilitas utama'); return; }
      if (this.guesthousePhotos.length === 0) { this.showToast('warning', 'Silakan upload minimal satu foto gedung'); return; }
      if (!this.newGuesthouse.area_m2 || this.newGuesthouse.area_m2 === '0') { this.showToast('warning', 'Silakan isi luas bangunan dengan angka yang valid'); return; }
      if (!this.newGuesthouse.contact_person) { this.showToast('warning', 'Silakan isi contact person dengan nomor telepon yang valid'); return; }
      if (!this.newGuesthouse.latitude || !this.newGuesthouse.longitude) { this.showToast('warning', 'Silakan pilih lokasi pada peta'); return; }
      this.formStep = 2
    },
    async submitRoomForm() {
      if (this.newRooms.length === 0) { this.showToast('warning', 'Silakan tambahkan minimal satu ruang mess'); return; }
      this.isSubmittingRoom = true
      try {
        const guesthouseFormData = new FormData()
        guesthouseFormData.append('name', this.newGuesthouse.name)
        guesthouseFormData.append('description', this.newGuesthouse.description)
        guesthouseFormData.append('facilities', this.newGuesthouse.facilitiesList.join('; '))
        guesthouseFormData.append('area_m2', guesthouseFormData.append('area_m2', parseInt(this.newGuesthouse.area_m2)))
        guesthouseFormData.append('address', this.newGuesthouse.address)
        guesthouseFormData.append('latitude', parseFloat(this.newGuesthouse.latitude))
        guesthouseFormData.append('longitude', parseFloat(this.newGuesthouse.longitude))
        guesthouseFormData.append('contact_person', this.newGuesthouse.contact_person)

        this.guesthousePhotos.forEach((photo) => { guesthouseFormData.append('guesthouse_media', photo) })
        const guesthouseResponse = await apiService.createGuesthouse(guesthouseFormData)
        if (!guesthouseResponse.data.status) throw new Error(guesthouseResponse.data.message || 'Failed to create guesthouse')

        const createdGuesthouseId = guesthouseResponse.data.data.id
        let successCount = 0, failCount = 0

        for (let i = 0; i < this.newRooms.length; i++) {
          try {
            const room = this.newRooms[i], roomFormData = new FormData()
            roomFormData.append('name', room.name)
            roomFormData.append('type', room.type)
            roomFormData.append('facilities', room.facilitiesList.join('; '))
            roomFormData.append('total_slot', parseInt(room.total_slot))
            roomFormData.append('area_m2', parseInt(room.area_m2))
            const pricingData = room.pricing.map((p) => ({ retribution_type: p.retribution_type, price_per_day: parseInt(p.price_per_day), is_available: p.is_available !== undefined ? p.is_available : true }))
            roomFormData.append('room_pricing', JSON.stringify(pricingData))
            if (room.photos && room.photos.length > 0) { room.photos.forEach((photo) => { roomFormData.append('room_media', photo) }) }

            const roomResponse = await apiService.createGuesthouseRoom(createdGuesthouseId, roomFormData)
            if (roomResponse.data.status) successCount++
            else failCount++
          } catch (error) { failCount++ }
        }
        if (successCount > 0 && failCount === 0) { this.closeAddGuesthouseModal(); this.fetchGuesthouses(); this.showToast('success', `Gedung mess dan ${successCount} ruang berhasil ditambahkan!`); }
        else if (successCount > 0 && failCount > 0) { this.closeAddGuesthouseModal(); this.fetchGuesthouses(); this.showToast('warning', `Gedung mess dan ${successCount} ruang berhasil, ${failCount} gagal.`); }
        else { throw new Error('Semua ruang gagal ditambahkan') }
      } catch (error) {
        this.showToast('error', `Gagal: ${error.message}`)
      } finally { this.isSubmittingRoom = false }
    },
    async fetchRoomData(guesthouseId) {
      this.isLoadingRooms = true
      this.rooms = []
      const token = localStorage.getItem('authToken')
      if (!token) { this.isLoadingRooms = false; return; }
      try {
        try {
          const response = await apiService.getGuesthouseRooms(guesthouseId, token)
          if (response.data.status && Array.isArray(response.data.data)) this.rooms = response.data.data
          else await this.fetchRoomsSequentially(guesthouseId)
        } catch (error) { await this.fetchRoomsSequentially(guesthouseId) }
        if (this.rooms.length > 0) await this.fetchReviews(guesthouseId)
      } catch (error) { console.error(error) }
      finally { this.isLoadingRooms = false }
    },
    async fetchRoomsSequentially(guesthouseId) {
      const token = localStorage.getItem('authToken')
      if (!token) return
      try {
        const roomsData = []
        let roomId = 1, consecutiveErrors = 0, maxConsecutiveErrors = 3
        while (consecutiveErrors < maxConsecutiveErrors) {
          try {
            const response = await apiService.getGuesthouseRoom(guesthouseId, roomId, token)
            if (response.data.status) {
              const roomData = response.data.data
              if (!roomData.guesthouse_id || roomData.guesthouse_id == guesthouseId) { roomsData.push(roomData); consecutiveErrors = 0; }
              else consecutiveErrors++
            }
          } catch (error) { if (error.response && error.response.status === 404) consecutiveErrors++ }
          roomId++
        }
        this.rooms = roomsData
      } catch (error) { console.error(error) }
    },
    async fetchGuesthouseDetailData(id) {
      const token = localStorage.getItem('authToken')
      if (!token) { this.showToast('warning', 'Anda harus login!'); this.showModal = false; this.isLoadingDetail = false; return; }
      try {
        const response = await apiService.getGuesthouseDetail(id, token)
        if (response.data.status) { this.selectedGuesthouse = response.data.data; await this.fetchRoomData(id); }
        else { this.showToast('error', 'Gagal detail.'); this.showModal = false; }
      } catch (error) { this.showToast('error', 'Kesalahan.'); this.showModal = false; }
      finally { this.isLoadingDetail = false }
    },
    async showGuesthouseDetail(id) {
      this.selectedGuesthouse = null; this.rooms = []; this.reviews = []; this.isLoadingDetail = true; this.showModal = true
      this.fetchGuesthouseDetailData(id)
    },
    async fetchReviews(guesthouseId) {
      this.isLoadingReviews = true
      this.reviews = []
      const token = localStorage.getItem('authToken')
      if (!token) { this.isLoadingReviews = false; return; }
      try {
        const allReviews = []
        for (const room of this.rooms) {
          if (room.guesthouse_id && parseInt(room.guesthouse_id) !== parseInt(guesthouseId)) continue
          try {
            const response = await apiService.getReviewsForGuesthouseRoom(guesthouseId, room.id, token)
            if (response.data.status && Array.isArray(response.data.data)) {
              const roomReviews = response.data.data.map((review) => {
                const normalizedReview = { ...review, roomId: room.id, roomName: room.name, guesthouseId }
                if (review.review_reply) {
                  normalizedReview.review_reply = { id: review.review_reply.id, adminId: review.review_reply.admin_id || review.review_reply.adminId, comment: review.review_reply.comment, createdAt: review.review_reply.created_at || review.review_reply.createdAt, updatedAt: review.review_reply.updated_at || review.review_reply.updatedAt }
                }
                return normalizedReview
              })
              allReviews.push(...roomReviews)
            }
          } catch (error) { console.error(error) }
        }
        if (allReviews.length > 0) this.reviews = await this.processReviewsWithAdminData(allReviews)
      } catch (error) { console.error(error) }
      finally { this.isLoadingReviews = false }
    },
    async fetchAdminData(adminId) {
      if (this.admins[adminId]) return this.admins[adminId]
      const token = localStorage.getItem('authToken')
      if (!token) return null
      try {
        const response = await apiService.getAdmin(adminId, token)
        if (response.data.status) { this.admins[adminId] = response.data.data; return response.data.data; }
        return null
      } catch (error) { return null }
    },
    async processReviewsWithAdminData(reviews) {
      if (!reviews || reviews.length === 0) return []
      const adminIds = reviews.filter((review) => review.review_reply).map((review) => review.review_reply.adminId).filter((id, index, self) => self.indexOf(id) === index)
      this.isLoadingAdmins = true
      await Promise.all(adminIds.map((adminId) => this.fetchAdminData(adminId)))
      this.isLoadingAdmins = false
      return reviews
    },
    getAdminName(adminId) { return this.admins[adminId]?.fullname || 'Admin' },
    formatReviewDate(dateString) {
      if (!dateString) return 'Tanggal tidak tersedia'
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Tanggal tidak valid'
      return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    toggleReplyForm(reviewId) {
      if (this.activeReplyId === reviewId) { this.activeReplyId = null; this.replyText = ''; }
      else { this.activeReplyId = reviewId; this.replyText = ''; }
    },
    async submitReply(rentId, reviewId) {
      if (!this.replyText.trim()) { this.showToast('warning', 'Masukkan balasan'); return; }
      this.isSubmittingReply = true
      const token = localStorage.getItem('authToken')
      if (!token) { this.showToast('warning', 'Login dahulu'); this.isSubmittingReply = false; return; }
      try {
        const response = await apiService.createReviewReply(rentId, reviewId, this.replyText)
        if (response.data.status) {
          const replyData = response.data.data
          const normalizedReply = { id: replyData.id, adminId: replyData.admin_id || replyData.adminId, comment: replyData.comment, createdAt: replyData.created_at || replyData.createdAt, updatedAt: replyData.updated_at || replyData.updatedAt }
          await this.fetchAdminData(normalizedReply.adminId)
          const index = this.reviews.findIndex((r) => r.id === reviewId)
          if (index !== -1) this.reviews.splice(index, 1, { ...this.reviews[index], review_reply: normalizedReply })
          this.activeReplyId = null; this.replyText = ''; this.showToast('success', 'Balasan terkirim!');
        }
      } catch (error) { this.showToast('error', 'Gagal kirim'); }
      finally { this.isSubmittingReply = false }
    },
    showEditReplyForm(review) { this.activeEditReplyId = review.id; this.editReplyText = review.review_reply.comment; },
    cancelEditReply() { this.activeEditReplyId = null; this.editReplyText = ''; },
    async updateReply(rentId, reviewId, replyId) {
      if (!this.editReplyText.trim()) { this.showToast('warning', 'Masukkan balasan'); return; }
      this.isUpdatingReply = true
      const token = localStorage.getItem('authToken')
      if (!token) { this.showToast('warning', 'Login dahulu'); this.isUpdatingReply = false; return; }
      try {
        const response = await apiService.updateReviewReply(rentId, reviewId, replyId, this.editReplyText)
        if (response.data.status) {
          const updated = response.data.data
          const normalized = { id: updated.id || replyId, adminId: updated.admin_id || updated.adminId || this.reviews.find(r=>r.id===reviewId)?.review_reply?.adminId, comment: updated.comment || this.editReplyText, createdAt: updated.created_at || updated.createdAt, updatedAt: updated.updated_at || new Date().toISOString() }
          const index = this.reviews.findIndex(r=>r.id===reviewId)
          if (index !== -1) this.reviews.splice(index, 1, { ...this.reviews[index], review_reply: normalized })
          this.cancelEditReply(); this.showToast('success', 'Diperbarui!');
        }
      } catch (e) { this.showToast('error', 'Gagal'); }
      finally { this.isUpdatingReply = false }
    },
    confirmDeleteReply(reviewId) { this.isConfirmingReplyDelete = reviewId },
    cancelDeleteReply() { this.isConfirmingReplyDelete = null },
    async deleteReply(rentId, reviewId) {
      const token = localStorage.getItem('authToken')
      if (!token) { this.showToast('warning', 'Login dahulu'); return; }
      const review = this.reviews.find(r=>r.id===reviewId)
      if (!review || !review.review_reply) { this.showToast('warning', 'Tidak ditemukan'); this.isConfirmingReplyDelete = null; return; }
      this.isDeletingReply = true
      try {
        const response = await apiService.deleteReviewReply(rentId, reviewId, review.review_reply.id)
        if (response.data.status) {
          const idx = this.reviews.findIndex(r=>r.id===reviewId)
          if (idx !== -1) { const upd = { ...this.reviews[idx] }; delete upd.review_reply; this.reviews.splice(idx, 1, upd); }
          this.showToast('success', 'Dihapus!')
        }
      } catch (e) { this.showToast('error', 'Gagal'); }
      finally { this.isDeletingReply = false; this.isConfirmingReplyDelete = null; }
    },
    openEditGuesthouseModal(guesthouse) { this.editGuesthouseId = guesthouse.id; this.showEditGuesthouseModal = true; this.editFormStep = 1; this.loadGuesthouseForEdit(guesthouse.id); },
    goBackToEditStep1() { this.editFormStep = 1; this.$nextTick(() => { setTimeout(() => { if (this.editMap) this.editMap.invalidateSize(); else this.initEditMap(); }, 300); }); },
    proceedToEditStep2() {
      if (this.editGuesthouse.facilitiesList.length < 2) { this.showToast('warning', 'Minimal 2 fasilitas'); return; }
      if (this.editGuesthousePhotoPreviews.length === 0) { this.showToast('warning', 'Upload minimal 1 foto'); return; }
      if (!this.editGuesthouse.latitude || !this.editGuesthouse.longitude) { this.showToast('warning', 'Pilih lokasi di peta'); return; }
      this.editFormStep = 2
    },
    async loadGuesthouseForEdit(guesthouseId) {
      const token = localStorage.getItem('authToken')
      if (!token) { this.showToast('warning', 'Login dahulu'); this.showEditGuesthouseModal = false; return; }
      try {
        const response = await apiService.getGuesthouseDetail(guesthouseId, token)
        if (response.data.status) {
          const g = response.data.data
          this.editGuesthouse = { id: g.id, name: g.name, address: g.address, description: g.description, facilitiesList: g.facilities ? g.facilities.split(';').map(i=>item.trim()) : [], area_m2: g.area_m2, contact_person: g.contact_person, latitude: g.latitude, longitude: g.longitude, media: g.guesthouse_media || [] }
          this.editGuesthousePhotoPreviews = (g.guesthouse_media || []).map(m=>media.url)
          this.deletedGuesthouseMedia = []
          await this.loadRoomsForEdit(guesthouseId)
          this.originalEditRooms = JSON.parse(JSON.stringify(this.editRooms))
          this.hasUnsavedChanges = false; this.pendingDeletedRooms = []; this.pendingEditedRooms = []; this.pendingNewRooms = []
          this.$nextTick(() => { this.setEditMapLocation(g.latitude, g.longitude) })
        }
      } catch (e) { this.showEditGuesthouseModal = false }
    },
    async loadRoomsForEdit(guesthouseId) {
      const token = localStorage.getItem('authToken')
      if (!token) return
      try {
        const response = await apiService.getGuesthouseRooms(guesthouseId, token)
        if (response.data.status && Array.isArray(response.data.data)) this.editRooms = response.data.data
        else await this.loadRoomsSequentiallyForEdit(guesthouseId)
      } catch (e) { await this.loadRoomsSequentiallyForEdit(guesthouseId) }
    },
    async loadRoomsSequentiallyForEdit(guesthouseId) {
      const token = localStorage.getItem('authToken')
      if (!token) return
      try {
        const roomsData = []
        let roomId = 1, consecutiveErrors = 0, maxConsecutiveErrors = 3
        while (consecutiveErrors < maxConsecutiveErrors) {
          try {
            const response = await apiService.getGuesthouseRooms(guesthouseId, token)
            if (response.data.status) {
              const r = response.data.data
              if (!r.guesthouse_id || parseInt(r.guesthouse_id) == parseInt(guesthouseId)) { roomsData.push(r); consecutiveErrors = 0; }
              else consecutiveErrors++
            }
          } catch (e) { if (e.response && e.response.status === 404) consecutiveErrors++ }
          roomId++
        }
        this.editRooms = roomsData
      } catch (e) { console.error(e) }
    },
    selectRoomForEdit(room) {
      this.selectedEditRoom = { ...room }
      this.editRoom = { id: room.id, name: room.name, type: room.type, facilitiesList: room.facilities ? room.facilities.split(';').map(i=>item.trim()) : [], total_slot: room.total_slot, area_m2: room.area_m2, pricing: JSON.parse(JSON.stringify(room.pricing || [])), media: room.media || [] }
      this.editRoomPhotoPreviews = (room.media || []).map(m=>media.url)
      this.editRoomPhotos = []; this.deletedRoomMedia = []
      this.ensureModalVisibility()
    },
    closeEditRoomForm() {
      this.selectedEditRoom = null
      this.editRoom = { id: null, name: '', type: 'standard', facilitiesList: [], total_slot: 1, area_m2: '', pricing: [], media: [] }
      this.editRoomPhotos = []; this.editRoomPhotoPreviews = []; this.deletedRoomMedia = []
    },
    closeEditGuesthouseModal() {
      if (this.hasUnsavedChanges) { this.showCancelConfirmModal = true; return; }
      this.performCloseEditModal()
    },
    confirmCancelChanges() { this.showCancelConfirmModal = false; this.performCloseEditModal(); },
    performCloseEditModal() {
      if (this.hasUnsavedChanges) this.editRooms = JSON.parse(JSON.stringify(this.originalEditRooms))
      this.showEditGuesthouseModal = false
      this.editGuesthouseId = null
      this.editGuesthouse = { id: null, name: '', address: '', description: '', facilities: '', facilitiesList: [], area_m2: '', contact_person: '', latitude: '', longitude: '', media: [] }
      this.editGuesthousePhotos = []; this.editGuesthousePhotoPreviews = []; this.deletedGuesthouseMedia = []; this.editRooms = []; this.originalEditRooms = []; this.closeEditRoomForm();
      this.hasUnsavedChanges = false; this.pendingDeletedRooms = []; this.pendingEditedRooms = []; this.pendingNewRooms = []
      if (this.editMarker) { this.editMarker.remove(); this.editMarker = null; }
      if (this.editMap) { this.editMap.remove(); this.editMap = null; }
    },
    ensureModalVisibility() {
      document.body.style.overflow = ''
      this.$nextTick(() => {
        const firstInput = document.getElementById('editRoomName')
        if (firstInput) setTimeout(() => { firstInput.focus() }, 100)
        const modalContent = document.querySelector('.max-h-\\[90vh\\]')
        if (modalContent) modalContent.scrollTop = 0
      })
    },
    initEditMap() {
      if (!window.L) {
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'
        script.integrity = 'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=='
        script.crossOrigin = ''
        document.head.appendChild(script)

        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'
        link.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=='
        link.crossOrigin = ''
        document.head.appendChild(link)
        script.onload = () => { this.createEditMap() }
      } else { this.createEditMap() }
    },
    createEditMap() {
      if (!document.getElementById('editMap')) { setTimeout(() => this.createEditMap(), 200); return; }
      const defaultLat = -6.2088, defaultLng = 106.8456
      if (this.editMap) { this.editMap.remove(); this.editMap = null; }
      try {
        const lat = parseFloat(this.editGuesthouse.latitude) || defaultLat
        const lng = parseFloat(this.editGuesthouse.longitude) || defaultLng
        this.editMap = L.map('editMap').setView([lat, lng], 13)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(this.editMap)
        this.editMarker = L.marker([lat, lng]).addTo(this.editMap)
        this.editMap.on('click', (e) => {
          const { lat, lng } = e.latlng
          if (this.editMarker) this.editMarker.setLatLng([lat, lng])
          else this.editMarker = L.marker([lat, lng]).addTo(this.editMap)
          this.editGuesthouse.latitude = lat.toFixed(10)
          this.editGuesthouse.longitude = lng.toFixed(10)
        })
        setTimeout(() => { if (this.editMap) this.editMap.invalidateSize() }, 300)
      } catch (e) { console.error(e) }
    },
    setEditMapLocation(latitude, longitude) {
      if (!this.editMap) return
      if (latitude && longitude) {
        const lat = parseFloat(latitude), lng = parseFloat(longitude)
        this.editMap.setView([lat, lng], 15)
        if (this.editMarker) this.editMarker.setLatLng([lat, lng])
        else this.editMarker = L.marker([lat, lng]).addTo(this.editMap)
      }
      this.editMap.invalidateSize()
    },
    async searchEditLocation() {
      if (!this.editSearchQuery.trim()) { this.editSearchError = 'Masukkan nama lokasi'; return; }
      this.editSearchError = null
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, { params: { q: this.editSearchQuery, format: 'json', limit: 1, addressdetails: 1 }, headers: { 'Accept-Language': 'id' } })
        if (response.data && response.data.length > 0) {
          const res = response.data[0], lat = parseFloat(res.lat), lng = parseFloat(res.lon)
          this.editMap.setView([lat, lng], 15)
          if (this.editMarker) this.editMarker.setLatLng([lat, lng])
          else this.editMarker = L.marker([lat, lng]).addTo(this.editMap)
          this.editGuesthouse.latitude = lat.toFixed(10)
          this.editGuesthouse.longitude = lng.toFixed(10)
          if (!this.editGuesthouse.address && res.display_name) this.editGuesthouse.address = res.display_name
        } else { this.editSearchError = 'Tidak ditemukan'; }
      } catch (e) { this.editSearchError = 'Kesalahan'; }
    },
    triggerEditPhotoInput() { this.$refs.editPhotoInput.click() },
    handleEditGuesthousePhotoChange(event) {
      const files = event.target.files
      if (!files.length) return
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        this.editGuesthousePhotos.push(file)
        const reader = new FileReader()
        reader.onload = (e) => { this.editGuesthousePhotoPreviews.push(e.target.result) }
        reader.readAsDataURL(file)
      }
    },
    removeEditGuesthousePhoto(index) {
      const existingLen = this.editGuesthouse.media.length
      if (index < existingLen) {
        this.deletedGuesthouseMedia.push(this.editGuesthouse.media[index])
        this.editGuesthouse.media.splice(index, 1)
        this.editGuesthousePhotoPreviews.splice(index, 1)
      } else {
        this.editGuesthousePhotos.splice(index - existingLen, 1)
        this.editGuesthousePhotoPreviews.splice(index, 1)
      }
    },
    triggerEditRoomPhotoInput() { this.$refs.editRoomPhotoInput.click() },
    handleEditRoomPhotoChange(event) {
      const files = event.target.files
      if (!files.length) return
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        this.editRoomPhotos.push(file)
        const reader = new FileReader()
        reader.onload = (e) => { this.editRoomPhotoPreviews.push(e.target.result) }
        reader.readAsDataURL(file)
      }
      event.target.value = ''
    },
    removeEditRoomPhoto(index) {
      const existingLen = this.editRoom.media.length
      if (index < existingLen) {
        this.deletedRoomMedia.push(this.editRoom.media[index])
        this.editRoom.media.splice(index, 1)
        this.editRoomPhotoPreviews.splice(index, 1)
      } else {
        this.editRoomPhotos.splice(index - existingLen, 1)
        this.editRoomPhotoPreviews.splice(index, 1)
      }
    },
    addEditFacility() {
      const facility = this.editFacilityInput.trim()
      if (facility) { this.editGuesthouse.facilitiesList.push(facility); this.editFacilityInput = ''; }
    },
    removeEditFacility(index) { this.editGuesthouse.facilitiesList.splice(index, 1) },
    addEditRoomFacility() {
      const facility = this.editRoomFacilityInput.trim()
      if (facility) { this.editRoom.facilitiesList.push(facility); this.editRoomFacilityInput = ''; }
    },
    removeEditRoomFacility(index) { this.editRoom.facilitiesList.splice(index, 1) },
    addEditPricing() { this.editRoom.pricing.push({ id: 0, retribution_type: '', price_per_day: 0, is_available: true }) },
    removeEditPricing(index) {
      if (this.editRoom.pricing.length > 1) this.editRoom.pricing.splice(index, 1)
      else this.showToast('warning', 'Minimal 1 kategori harga')
    },
    async submitEditGuesthouseForm() {
      if (this.editGuesthouse.description.length < 10) { this.showToast('warning', 'Minimal 10 karakter'); return; }
      if (!this.editGuesthouse.address || this.editGuesthouse.address.trim().length < 5) { this.showToast('warning', 'Minimal 5 karakter'); return; }
      if (this.editGuesthouse.facilitiesList.length < 2) { this.showToast('warning', 'Minimal 2 fasilitas'); return; }
      if (this.editGuesthousePhotoPreviews.length === 0) { this.showToast('warning', 'Upload minimal 1 foto'); return; }
      if (!this.editGuesthouse.area_m2 || this.editGuesthouse.area_m2 === '0') { this.showToast('warning', 'Isi luas bangunan dengan benar'); return; }
      if (!this.editGuesthouse.contact_person) { this.showToast('warning', 'Isi contact person dengan benar'); return; }
      if (!this.editGuesthouse.latitude || !this.editGuesthouse.longitude) { this.showToast('warning', 'Pilih lokasi pada peta'); return; }

      this.isSubmittingEditGuesthouse = true
      try {
        const token = localStorage.getItem('authToken')
        if (!token) throw new Error('Token tidak ditemukan')
        const formData = new FormData()
        formData.append('name', this.editGuesthouse.name)
        formData.append('description', this.editGuesthouse.description)
        formData.append('facilities', this.editGuesthouse.facilitiesList.join('; '))
        formData.append('area_m2', this.editGuesthouse.area_m2)
        formData.append('address', this.editGuesthouse.address)
        formData.append('latitude', this.editGuesthouse.latitude)
        formData.append('longitude', this.editGuesthouse.longitude)
        formData.append('contact_person', this.editGuesthouse.contact_person)

        this.editGuesthousePhotos.forEach((photo) => { formData.append('guesthouse_media', photo) })
        if (this.deletedGuesthouseMedia.length > 0) formData.append('deleted_media', JSON.stringify(this.deletedGuesthouseMedia))

        const response = await apiService.updateGuesthouse(this.editGuesthouseId, formData, token)
        if (!response.data.status) throw new Error(response.data.message || 'Gagal update')

        for (const roomId of this.pendingDeletedRooms) { try { await apiService.deleteGuesthouseRoom(this.editGuesthouseId, roomId, token) } catch (e) {} }
        for (const newRoom of this.pendingNewRooms) {
          try {
            const formattedPricing = newRoom.pricing.map(p => ({ id: 0, retribution_type: p.retribution_type, price_per_day: Number(p.price_per_day), is_available: true }))
            const roomFormData = new FormData()
            roomFormData.append('name', newRoom.name)
            roomFormData.append('type', newRoom.type)
            roomFormData.append('facilities', newRoom.facilitiesList.join('; '))
            roomFormData.append('total_slot', newRoom.total_slot)
            roomFormData.append('area_m2', newRoom.area_m2)
            roomFormData.append('room_pricing', JSON.stringify(formattedPricing))
            await apiService.createGuesthouseRoom(this.editGuesthouseId, roomFormData)
          } catch (e) {}
        }
        for (const roomId of this.pendingEditedRooms) {
          try {
            const room = this.editRooms.find(r => r.id === roomId)
            if (!room) continue
            const formattedPricing = room.pricing.map(p => ({ id: p.id ? Number(p.id) : 0, retribution_type: p.retribution_type, price_per_day: Number(p.price_per_day), is_available: true }))
            const roomFormData = new FormData()
            roomFormData.append('name', room.name)
            roomFormData.append('type', room.type)
            roomFormData.append('facilities', room.facilitiesList.join('; '))
            roomFormData.append('total_slot', room.total_slot)
            roomFormData.append('area_m2', room.area_m2)
            roomFormData.append('room_pricing', JSON.stringify(formattedPricing))
            await apiService.updateGuesthouseRoom(this.editGuesthouseId, roomId, roomFormData, token)
          } catch (e) {}
        }
        this.performCloseEditModal()
        this.fetchGuesthouses()
        this.showToast('success', 'Semua perubahan disimpan!')
      } catch (error) { this.showToast('error', `Gagal: ${error.message}`) }
      finally { this.isSubmittingEditGuesthouse = false }
    },
    addRoomToGuesthouse() {
      this.editRoom = { id: null, name: '', type: 'standard', facilitiesList: [], total_slot: 1, area_m2: '', pricing: [{ id: 0, retribution_type: '', price_per_day: '', is_available: true }], media: [] }
      this.editRoomPhotos = []; this.editRoomPhotoPreviews = []; this.deletedRoomMedia = []
      this.selectedEditRoom = { isNew: true }
      this.ensureModalVisibility()
    },
    async submitEditRoomForm() {
      if (this.editRoom.facilitiesList.length === 0) { this.showToast('warning', 'Tambahkan minimal satu fasilitas'); return; }
      if (this.editRoom.pricing.some(p => !p.retribution_type.trim() || !p.price_per_day)) { this.showToast('warning', 'Lengkapi kategori dan harga'); return; }
      const idx = this.editRooms.findIndex(r => r.id === this.editRoom.id)
      if (idx !== -1) this.editRooms[idx] = { ...this.editRoom }
      if (!this.pendingEditedRooms.includes(this.editRoom.id)) this.pendingEditedRooms.push(this.editRoom.id)
      this.hasUnsavedChanges = true; this.closeEditRoomForm();
    },
    async submitNewRoomForm() {
      if (this.editRoom.facilitiesList.length === 0) { this.showToast('warning', 'Tambahkan minimal satu fasilitas'); return; }
      if (this.editRoom.pricing.some(p => !p.retribution_type.trim() || !p.price_per_day)) { this.showToast('warning', 'Lengkapi kategori dan harga'); return; }
      const tempId = -Date.now()
      const newRoom = { ...this.editRoom, id: tempId, isNew: true }
      this.editRooms.push(newRoom)
      this.pendingNewRooms.push(newRoom)
      this.hasUnsavedChanges = true; this.closeEditRoomForm();
    },
    deleteRoom(room) { this.roomToDelete = room; this.showDeleteRoomModal = true; },
    closeDeleteRoomModal() { this.showDeleteRoomModal = false; this.roomToDelete = null; },
    async confirmDeleteRoom() {
      if (!this.roomToDelete) return
      if (!this.pendingDeletedRooms.includes(this.roomToDelete.id)) this.pendingDeletedRooms.push(this.roomToDelete.id)
      this.editRooms = this.editRooms.filter(r => r.id !== this.roomToDelete.id)
      if (this.editRoom.id === this.roomToDelete.id) this.closeEditRoomForm()
      this.hasUnsavedChanges = true; this.closeDeleteRoomModal();
    },
    openDeleteGuesthouseModal(guesthouse) { this.guesthouseToDelete = guesthouse; this.showDeleteGuesthouseModal = true; },
    closeDeleteGuesthouseModal() { this.showDeleteGuesthouseModal = false; this.guesthouseToDelete = null; },
    async confirmDeleteGuesthouse() {
      if (!this.guesthouseToDelete) return
      this.isDeletingGuesthouse = true; this.deletingGuesthouseId = this.guesthouseToDelete.id
      const token = localStorage.getItem('authToken')
      if (!token) { this.showToast('warning', 'Login dahulu'); this.isDeletingGuesthouse = false; return; }
      try {
        const response = await apiService.deleteGuesthouse(this.guesthouseToDelete.id, token)
        if (response.data.status) { this.guesthouses = this.guesthouses.filter(g=>g.id !== this.guesthouseToDelete.id); this.closeDeleteGuesthouseModal(); }
      } catch (e) {} finally { this.isDeletingGuesthouse = false; this.deletingGuesthouseId = null; }
    },
    openReviewPhotoSlideshow(review, startIndex = 0) { this.selectedReview = review; this.currentReviewSlideIndex = startIndex; this.showReviewSlideshow = true; },
    nextReviewSlide() { if (this.currentReviewSlideIndex < this.selectedReview?.review_media.length - 1) this.currentReviewSlideIndex++; },
    prevReviewSlide() { if (this.currentReviewSlideIndex > 0) this.currentReviewSlideIndex--; },
    handlePhotoButtonHover(isHovering) { this.isHoveringPhotoButton = isHovering },
    openPhotoSlideshow() { this.currentSlideIndex = 0; this.showSlideshow = true; },
    openRoomPhotoSlideshow(room, startIndex = 0) { this.selectedRoom = room; this.currentRoomSlideIndex = startIndex; this.showRoomSlideshow = true; },
    nextSlide() { if (this.currentSlideIndex < this.selectedGuesthouse?.guesthouse_media.length - 1) this.currentSlideIndex++; },
    prevSlide() { if (this.currentSlideIndex > 0) this.currentSlideIndex--; },
    nextRoomSlide() { if (this.currentRoomSlideIndex < this.selectedRoom?.media.length - 1) this.currentRoomSlideIndex++; },
    prevRoomSlide() { if (this.currentRoomSlideIndex > 0) this.currentRoomSlideIndex--; },
    getMapsUrl(latitude, longitude) {
      if (!latitude || !longitude) return '#'
      return `https://www.google.com/maps?q=${latitude},${longitude}`
    },
  },
  mounted() {
    this.fetchGuesthouses()
  },
}
</script>

<style scoped>
/* style scoped bawaan Anda */
</style>

<style scoped>
.data-gedung-text,
.nama-gedung,
.foto-text,
.action-button {
  font-family: 'Poppins', sans-serif;
}

.detail-modal-cardbox {
  background-color: #e8f9ff;
  max-height: 90vh;
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

.photo-slideshow {
  background-color: rgba(0, 0, 0, 0.2);
}

.navigation-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.navigation-button:focus {
  outline: none;
}

/* Efek hover untuk tombol Tambah Gedung Mess */
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

.modal-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
}

/* For sticky headers/footers in modals */
.modal-sticky-header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.modal-sticky-footer {
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 10;
  padding-top: 0.5rem;
  border-top: 1px solid #f3f4f6;
}

/* For small screens */
@media (max-height: 640px) {
  .modal-content {
    max-height: 85vh;
  }
}

.edit-room-form {
  height: 90%;
}

.photo-slideshow {
  background-color: rgba(0, 0, 0, 0.2);
}

.navigation-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.navigation-button:focus {
  outline: none;
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

.edit-room-form {
  /* Memastikan modal memiliki tinggi yang optimal */
  min-height: 600px;
}

/* Untuk photo slideshow yang konsisten */
.photo-slideshow {
  background-color: rgba(0, 0, 0, 0.2);
}

.navigation-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.navigation-button:focus {
  outline: none;
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

/* Better sticky positioning */
.sticky {
  position: -webkit-sticky;
  position: sticky;
}
</style>
