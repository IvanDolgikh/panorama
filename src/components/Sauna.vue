<template>
    <section class="sauna">
        <div class="sauna__container">
            <h2 class="sauna__title">Баня "Лука"</h2>
            <div class="sauna__info">
                <p class="sauna__text">Возвышенная баня, выполненная в&nbsp;темных оттенках в&nbsp;современно-деревенском стиле с&nbsp;широким изобилием полезных трав внутри.</p>
                <ul class="sauna__list-marks">
                    <li>длительность: 2&nbsp;часа</li>
                    <li>вместимость: до&nbsp;4&nbsp;человек</li>
                    <li>стоимость: 5 000р</li>
                </ul>
            </div>

            <div class="sauna__controls">
                <button
                    class="sauna__control sauna__control--prev"
                    @click="swiperPrev"
                >
                    <span class="pi pi-arrow-left"></span>
                </button>
                <button
                    class="sauna__control sauna__control--next"
                    @click="swiperNext"
                >
                    <span class="pi pi-arrow-right"></span>
                </button>
            </div>
        </div>

        <!-- Слайдер с особым позиционированием -->
        <div class="sauna__slider-wrapper">
            <Swiper
                ref="swiper"
                :modules="[modules]"
                :slides-per-view="'auto'"
                :space-between="20"
                :free-mode="true"
                :navigation="{
                    nextEl: '.sauna__control--next',
                    prevEl: '.sauna__control--prev'
                }"
                :scrollbar="{ draggable: true }"
                :loop="true"
                class="sauna__swiper"
            >
                <SwiperSlide
                    v-for="(image, index) in images"
                    :key="index"
                    class="sauna__slide"
                >
                    <img
                        :src="image"
                        :alt="`Фото ${index + 1}`"
                        class="sauna__image"
                    >
                </SwiperSlide>
            </Swiper>
        </div>
    </section>
</template>


<script setup>
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { ref } from 'vue'


// Модули Swiper
const modules = [Navigation, Pagination, Scrollbar, A11y]

const imageModules = import.meta.glob('@other-images/sauna/*.{jpg,png,webp}', {
    eager: true,
    as: 'url'
})

// const sortedImages = ref(
//     Object.entries(imageModules)
//         .sort(([a], [b]) => a.localeCompare(b))
//         .map(([, path]) => path)
// )

const images = ref(Object.values(imageModules))

// Методы для управления слайдером
const swiperPrev = () => {
    swiper.value?.swiper.slidePrev()
}

const swiperNext = () => {
    swiper.value?.swiper.slideNext()
}
</script>

<style
    lang="scss"
    scoped
>
.sauna {
    &__container {
        max-width: $vp-1200;
        margin: 0 auto 40px auto;
        padding: 0 50px;
    }

    &__title {
        font-size: 34px;
        font-weight: 600;
        margin-bottom: 24px;
    }

    &__text {
        font-size: 20px;
        margin-bottom: 30px;
    }

    &__info {
        max-width: 50%;
    }

    &__list-marks {
        display: flex;
        column-gap: 20px;

        li {
            background-color: $color-accent;
            color: $color-light-text;
            font-weight: 300;
            border-radius: 14px;
            padding: 8px 16px;
        }
    }

    // Новый контейнер для слайдера
    &__slider-wrapper {
        width: 100%;
        overflow: hidden;
        position: relative;
        margin-bottom: 80px;
    }

    &__swiper {
        width: 100%;
        height: 500px;

        // Сдвигаем слайдер вправо, чтобы первый слайд начинался с отступа контейнера
        margin-left: calc(50% - min(50%, #{$vp-1200 / 2}) + 50px);

        // Компенсация для разных размеров экрана
        @media (max-width: $vp-1200) {
            margin-left: 50px; // На маленьких экранах просто отступ слева
        }
    }

    &__slide {
        width: 350px;
        height: 450px;
        border-radius: 20px; // 👈 Скругление на слайде
        overflow: hidden; // 👈 Обрезаем все, что выходит за пределы
    }

    &__controls {
        display: flex;
        column-gap: 10px;
        width: fit-content;
        margin-left: auto;
        margin-right: 100px;
    }

    &__control {
        display: block;
        border: none;
        background-color: $color-accent;
        border-radius: 50%;
        width: 42px;
        height: 42px;
        cursor: pointer;

        span {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            color: $color-light-text;
        }
    }

    &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;

        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.05);
        }
    }
}
</style>