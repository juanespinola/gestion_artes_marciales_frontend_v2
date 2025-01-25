import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
// const MyPreset = definePreset(Aura, {
//     components: {
//         table: {
//             colorScheme: {
//                 light: {
//                     background: '#FFFFFF',
//                 },
//                 dark: {
//                     background: '#24303F',
//                 },
//             }
//         }
//     }
// })


app.use(pinia)
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '.dark',
            cssLayer: false
        }
    }
})

app.mount('#app')
