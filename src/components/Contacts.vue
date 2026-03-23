<template>
    <section
        class="contacts"
        id="contacts"
    >
        <div class="contacts__container">

            <div class="contacts__map">
                <div class="contacts__map-wrapper">

                    <yandex-map
                        v-model="map"
                        :settings="{
                            location: {
                                center: [66.295877, 57.142475],
                                zoom: 9,
                            },
                        }"
                    >
                        <yandex-map-default-scheme-layer />
                        <yandex-map-default-features-layer />
                        <yandex-map-default-marker :settings="{
                            coordinates: [66.295877, 57.142475],
                            preset: 'islands#redIcon'
                        }" />
                    </yandex-map>
                </div>
            </div>

            <div class="contacts__info">
                <h2 class="contacts__title">Контакты</h2>
                <a
                    class="contacts__phone-link"
                    href="tel:+79229543200"
                >+7 (922) 954-32-00</a>

                <a
                    class="contacts__email-link"
                    href="mailto:panorama-tmn@mail.ru"
                >panorama-tmn@mail.ru</a>

                <p class="contacts__address">Мы&nbsp;находимся в&nbsp;30&nbsp;минутах от&nbsp;Тюмени по&nbsp;адресу: г. Тюмень, село Созоново, ул. Береговая, д.&nbsp;2</p>

                <div class="contacts__social">
                    <a
                        class="contacts__social-link"
                        href="https://t.me/panorama_guest"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <span class="pi pi-telegram"></span>
                    </a>

                    <a
                        class="contacts__social-link"
                        href="https://t.me/panorama_guest"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <span class="pi pi-instagram"></span>
                    </a>
                </div>
            </div>
        </div>
    </section>

</template>

<script setup>
import { shallowRef } from 'vue';
import {
    YandexMap,
    YandexMapDefaultSchemeLayer,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultMarker,
} from 'vue-yandex-maps';

const map = shallowRef(null);
</script>

<style lang="scss">
.contacts {

    &__container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 70px;
        margin: 0 auto 50px auto;
        font-weight: 300;
    }

    &__map {
        min-width: 0;
    }

    &__map-wrapper {
        height: 500px;
    }

    &__info {
        align-content: center;
        margin-bottom: 20px;
    }

    &__title {
        font-weight: 300;
        font-size: 34px;
        margin-bottom: 30px;
    }

    &__phone-link,
    &__email-link {
        display: block;
    }

    &__email-link {
        margin-bottom: 30px
    }

    &__address {
        margin-bottom: 30px;
    }


    &__social {
        display: flex;
        width: fit-content;
        column-gap: 12px;

    }

    &__social-link {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        background-color: transparent;
        padding: 0;

        span {
            font-size: 24px;
            color: $color-accent;
        }
    }
}
</style>