import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 2. Buat instance Pinia
const pinia = createPinia()

// 3. Gunakan plugin dan router
app.use(pinia) // Berikan instance pinia ke aplikasi
app.use(router)

// 4. Mount aplikasi
app.mount('#app')