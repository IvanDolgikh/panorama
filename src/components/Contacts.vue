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
import { ref } from 'vue';
import {
    YandexMap,
    YandexMapDefaultSchemeLayer,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultMarker,
} from 'vue-yandex-maps';

const map = ref(null);
</script>

<style lang="scss">
.contacts {
    &__container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 70px;
        max-width: $vp-1440;
        margin: 0 auto 50px auto;
        padding: 0 50px;
        font-weight: 300;
    }

    &__map {
        min-width: 0;
    }

    &__map-wrapper {
        height: 500px;
        border-radius: 20px;
        overflow: hidden;
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
        font-size: 20px;
        color: $color-base-text;
        text-decoration: none;
        transition: color 0.3s;

        &:hover {
            color: $color-accent;
        }
    }

    &__phone-link {
        margin-bottom: 16px;
        font-weight: 500;
    }

    &__email-link {
        margin-bottom: 30px;
    }

    &__address {
        margin-bottom: 30px;
        font-size: 18px;
        line-height: 1.5;
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
        transition: transform 0.3s;

        &:hover {
            transform: scale(1.1);
        }

        span {
            font-size: 28px;
            color: $color-accent;
        }
    }
}

@media (max-width: $vp-1024) {
    .contacts {
        &__container {
            column-gap: 40px;
            padding: 0 30px;
            margin: 0 auto 40px auto;
        }

        &__map-wrapper {
            height: 400px;
            border-radius: 16px;
        }

        &__title {
            font-size: 30px;
            margin-bottom: 24px;
        }

        &__phone-link,
        &__email-link {
            font-size: 18px;
        }

        &__address {
            font-size: 16px;
            margin-bottom: 24px;
        }

        &__social-link span {
            font-size: 24px;
        }
    }
}

@media (max-width: $vp-768) {
    .contacts {
        &__container {
            grid-template-columns: 1fr;
            row-gap: 30px;
            padding: 0 16px;
            margin: 0 auto 30px auto;
        }

        &__map-wrapper {
            height: 300px;
            border-radius: 14px;
        }

        &__info {
            margin: 0;
            text-align: center;
        }

        &__title {
            font-size: 26px;
            margin-bottom: 20px;
        }

        &__phone-link,
        &__email-link {
            font-size: 18px;
        }

        &__address {
            font-size: 15px;
            margin-bottom: 20px;
            text-align: center;
        }

        &__social {
            margin: 0 auto;
        }

        &__social-link span {
            font-size: 28px;
        }
    }
}
</style>