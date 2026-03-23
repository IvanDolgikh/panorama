import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@styles/index.scss'
import 'primeicons/primeicons.css'
import 'swiper/swiper-bundle.css'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { createYmaps } from 'vue-yandex-maps';
import { all as locales } from 'primelocale'

const app = createApp(App);

app.use(PrimeVue, {
    locale: locales.ru,
    theme: {
        preset: Aura
    }
});

app.use(createYmaps({
    apikey: 'a1cafbc6-0f59-403f-82b1-442e744a62e3',
}));

app.use(router)

app.mount('#app')

