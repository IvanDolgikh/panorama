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
                    @click="swiperInstance?.slidePrev()"
                >
                    <span class="pi pi-arrow-left"></span>
                </button>
                <button
                    class="sauna__control sauna__control--next"
                    @click="swiperInstance?.slideNext()"
                >
                    <span class="pi pi-arrow-right"></span>
                </button>
            </div>
        </div>

        <div class="sauna__slider-wrapper">
            <Swiper
                :modules="modules"
                :slides-per-view="'auto'"
                :space-between="20"
                :free-mode="true"
                :scrollbar="{ draggable: true }"
                :loop="true"
                class="sauna__swiper"
                @swiper="onSwiperInit"
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

const modules = [Navigation, Pagination, Scrollbar, A11y]

const imageModules = import.meta.glob('@other-images/sauna/*.{jpg,png,webp}', {
    eager: true,
    as: 'url'
})

const images = ref(Object.values(imageModules))

const swiperInstance = ref(null)

const onSwiperInit = (swiper) => {
    swiperInstance.value = swiper
}
</script>

<style lang="scss">
.sauna {
    &__container {
        max-width: $vp-1440;
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
        margin-bottom: 20px;
    }

    &__list-marks {
        display: flex;
        column-gap: 20px;
        flex-wrap: wrap;
        row-gap: 12px;

        li {
            background-color: $color-accent;
            color: $color-light-text;
            font-weight: 300;
            border-radius: 14px;
            padding: 8px 16px;
        }
    }

    &__slider-wrapper {
        width: 100%;
        overflow: hidden;
        position: relative;
        margin-bottom: 80px;
    }

    &__swiper {
        width: 100%;
        height: 500px;
        margin-left: calc(50% - min(50%, #{$vp-1440 / 2}) + 50px);
    }

    &__slide {
        width: 350px;
        height: 450px;
        border-radius: 20px;
        overflow: hidden;
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
        transition: transform 0.2s, background-color 0.3s;

        &:hover {
            background-color: darken($color-accent, 10%);
        }

        &:active {
            transform: scale(0.95);
        }

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
        aspect-ratio: 16 / 9;
        content-visibility: auto;
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.05);
        }
    }
}

@media (max-width: $vp-1024) {
    .sauna {
        &__container {
            padding: 0 30px;
            margin: 0 auto 30px auto;
        }

        &__title {
            font-size: 30px;
            margin-bottom: 20px;
        }

        &__text {
            font-size: 18px;
            margin-bottom: 24px;
        }

        &__info {
            max-width: 70%;
        }

        &__list-marks {
            column-gap: 16px;

            li {
                font-size: 14px;
                padding: 6px 14px;
            }
        }

        &__swiper {
            height: 400px;
            margin-left: 30px;
        }

        &__slide {
            width: 280px;
            height: 360px;
            border-radius: 16px;
        }

        &__controls {
            margin-right: 30px;
        }

        &__control {
            width: 38px;
            height: 38px;

            span {
                font-size: 12px;
            }
        }

        &__slider-wrapper {
            margin-bottom: 60px;
        }
    }
}

@media (max-width: $vp-768) {
    .sauna {
        &__container {
            padding: 0 16px;
            margin: 0 auto 24px auto;
        }

        &__title {
            font-size: 24px;
            margin-bottom: 16px;
            text-align: center;
        }

        &__text {
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.5;
            text-align: center;
        }

        &__info {
            max-width: 100%;
        }

        &__list-marks {
            justify-content: center;
            column-gap: 12px;

            li {
                font-size: 12px;
                padding: 6px 12px;
                border-radius: 10px;
            }
        }

        &__swiper {
            height: 300px;
            margin-left: 16px;
        }

        &__slide {
            width: 220px;
            height: 280px;
            border-radius: 14px;
        }

        &__controls {
            margin-right: 16px;
        }

        &__control {
            width: 34px;
            height: 34px;

            span {
                font-size: 11px;
            }
        }

        &__slider-wrapper {
            margin-bottom: 40px;
        }

        &__image {
            &:hover {
                transform: none;
            }
        }
    }
}
</style>