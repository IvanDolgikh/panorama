import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@styles/index.scss'
import 'primeicons/primeicons.css'
import 'swiper/swiper-bundle.css'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Aura from '@primeuix/themes/aura';
import { createYmaps } from 'vue-yandex-maps';
import { all as locales } from 'primelocale'

const pinia = createPinia()

const app = createApp(App);

app.use(pinia)

app.use(PrimeVue, {
    locale: locales.ru,
    theme: {
        preset: Aura
    }
});

app.directive('tooltip', Tooltip);

app.use(ConfirmationService);

app.use(ToastService);

app.use(createYmaps({
    apikey: import.meta.env.VITE_YMAPS_KEY,
}));

app.use(router)

app.mount('#app')

