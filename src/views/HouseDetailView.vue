<template>
    <section class="house-detail">
        <div
            class="house-detail__container"
            v-if="house"
        >

            <div class="house-detail__title-container">
                <h1 class="house-detail__title">{{ house.title }}</h1>
                <p class="house-detail__description">{{ house.description }}</p>
                <p class="house-detail__time">Заезд 15:00<br>Выезд в 12:00</p>

            </div>


            <div class="house-detail__slider-wrapper">
                <button
                    class="house-detail__control house-detail__control--prev"
                    @click="swiperPrev"
                >
                    <PhCaretLeft
                        :size="68"
                        weight="light"
                        class="house-detail__control-icon"
                    />
                </button>
                <button
                    class="house-detail__control house-detail__control--next"
                    @click="swiperNext"
                >
                    <PhCaretRight
                        :size="68"
                        weight="light"
                        class="house-detail__control-icon"
                    />
                </button>

                <swiper
                    ref="swiper2"
                    :modules="modules"
                    :slides-per-view="'auto'"
                    :centered-slides="true"
                    :loop="true"
                    :scrollbar="{ draggable: true }"
                    :update-on-window-resize="true"
                    :navigation="{
                        nextEl: '.house-detail__control--next',
                        prevEl: '.house-detail__control--prev'
                    }"
                    class="house-detail__swiper"
                >
                    <swiper-slide
                        v-for="(image, index) in house.gallery"
                        :key="index"
                        class="house-detail__slide"
                    >
                        <div class="house-detail__slide-inner">
                            <img
                                :src="image"
                                :alt="`Фото ${index + 1}`"
                                class="house-detail__image"
                                loading="lazy"
                            >
                        </div>
                    </swiper-slide>
                </swiper>
            </div>

            <button
                class="house-detail__button"
                @click="isOpenDialog = true"
            >Забронировать</button>

            <div class="house-detail__info-container">

                <div class="house-detail__info">
                    <h3>О доме</h3>
                    <p>Площадь дома: 36 м2</p>
                    <p>Помещения: кухня-гостинная, спальная комната, санузел</p>
                    <p>Особенности:</p>
                    <ul>
                        <li>просторная мебелированная терраса</li>
                        <li>невероятный вид на реку</li>
                        <li>дом рассчитан до 4 человек</li>
                    </ul>
                    <p>У нас тихий и спокойный формат отдыха, поэтому мы не принимаем шумные компании. На нашей территории запрещено распивать алкогольные напитки, слушать музыку на улице, а также курить кальяны и сигареты в доме и на террасе (электронные сигареты допускаются).</p>
                </div>

                <div class="house-detail__inside">
                    <h3>Что внутри</h3>
                    <ul>
                        <li>Халаты, полотенца, гигеинические принадлежности</li>
                        <li>Вся необходимая посуда: кружки, тарелки, бокалы, графины, столовы приборы, а также кострюля и сковородка</li>
                        <li>Из бытовой техники: свч, чайник, холодильник, инфрокрасная плита для приготовления пищи</li>
                        <li>Телевизор, фен</li>
                        <li>Wi-Fi</li>
                    </ul>

                </div>

                <div class="house-detail__territory">
                    <h3>Территория</h3>
                    <p>У дома есть собственная преддомовая территория со своей собственной мангальной зоной</p>
                    <p>На территории находится отдельностоящая просторная баня со своей террассой, которая выходит на реку. Баня разделеная на несколько помещений: зона отдыха, раздельный санузел с душевой и сама парная</p>
                    <p class="house-detail__optional-text">* баня не включена в стоимость дома</p>
                    <p class="house-detail__optional-text">* посещение бани от 2 часов включительно</p>
                </div>

            </div>


            <div class="house-detail__another-house">
                <p>Посмотрите также:</p>

                <div class="house-detail__another-house-card">
                    <img
                        class="house-detail__another-house-image"
                        :src="otherHouse.gallery[5]"
                        :alt="otherHouse.imageAlt"
                    >
                    <span>{{ otherHouse.title }}</span>
                    <span>{{ otherHouse.description }}</span>
                    <router-link
                        :to="{
                            name: 'house-detail',
                            params: { slug: otherHouse.slug }
                        }"
                        class="house-detail__another-house-link"
                    >
                        <span>Подробнее</span>
                        <span class="pi pi-arrow-right"></span>
                    </router-link>
                </div>

            </div>


            <HouseBooking
                v-if="isOpenDialog"
                :isOpenDialog="isOpenDialog"
                :house="house"
                @close-dialog="onCloseDialog"
                @success-submit="onSuccessSubmit"
            />

            <HouseSuccessBooking
                @close-dialog="onCloseDialogSuccess"
                :isSuccesSubmit="isSuccesSubmit"
            />
        </div>

    </section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '@stores/data'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Scrollbar } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'

import { PhCaretRight, PhCaretLeft } from '@phosphor-icons/vue'
import HouseBooking from '@components/houses/HouseBooking.vue'
import HouseSuccessBooking from '@components/houses/HouseSuccessBooking.vue'

const store = useDataStore()
const route = useRoute()
const router = useRouter()

const modules = [Navigation, Scrollbar]
const swiper2 = ref(null)
const isOpenDialog = ref(false)
const isSuccesSubmit = ref(false)

const house = computed(() => store.getHouseBySlug(route.params.slug))
const otherHouse = computed(() => store.getOtherHouse(route.params.slug))

const swiperPrev = () => swiper2.value?.swiper.slidePrev()
const swiperNext = () => swiper2.value?.swiper.slideNext()

const onCloseDialog = () => { isOpenDialog.value = false }
const onSuccessSubmit = () => { isSuccesSubmit.value = true; isOpenDialog.value = false }
const onCloseDialogSuccess = () => { isSuccesSubmit.value = false }

watch(isSuccesSubmit, (value) => {
    if (value) setTimeout(() => { isSuccesSubmit.value = false }, 5000)
})

watch(() => route.params.slug, () => {
    isOpenDialog.value = false
    isSuccesSubmit.value = false
})

onMounted(async () => {
    await store.loadHouses()

    if (!house.value) {
        router.push('/404')
    }
})
</script>

<style lang="scss">
.house-detail {
    &__container {
        margin: 0 auto 80px auto;
    }

    &__title-container {
        max-width: $vp-1440;
        margin: 40px auto 40px auto;
        padding: 0 50px;
    }

    &__title,
    &__description,
    &__time {
        text-align: center;
    }

    &__title {
        margin-bottom: 30px;
        font-size: 40px;
        font-weight: 600;
    }

    &__description {
        width: 50%;
        font-size: 20px;
        margin: 0 auto 40px auto;
    }

    &__time {
        font-size: 20px;
        text-transform: uppercase;
        font-weight: 600;
        color: $color-accent;
        line-height: 1.7;
    }

    &__slider-wrapper {
        width: 100%;
        position: relative;
        margin-bottom: 80px;
        display: flex;
        justify-content: center;
        align-items: center;

        .swiper-wrapper {
            align-items: center;
        }
    }

    &__swiper {
        overflow: hidden !important;
        position: relative;
        width: 100%;
        height: 570px;

        .swiper-button-prev,
        .swiper-button-next {
            display: flex !important;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            cursor: pointer;
            z-index: 10;

            &::after {
                font-size: 20px;
                color: $color-accent;
                font-weight: bold;
            }

            &:hover {
                background: $color-accent;
                box-shadow: 0 6px 16px rgba($color-accent, 0.3);

                &::after {
                    color: white;
                }
            }
        }
    }

    &__slide {
        width: 450px;
        height: 450px;
        margin-right: 40px;
        transition: all 0.3s ease;
        opacity: 0.5;
        cursor: grabbing;
        border-radius: 20px;

        &-inner {
            width: 100%;
            height: 100%;
            border-radius: 20px;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        &.swiper-slide-active {
            transform: scale(1.15);
            opacity: 1;
        }
    }

    &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &__control {
        background-color: transparent;
        border: none;
        cursor: pointer;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 100;
    }

    &__control-icon {
        fill: $color-accent;
    }

    &__control--prev {
        left: 0;
    }

    &__control--next {
        right: 0;
    }

    &__button {
        margin: 0 auto 70px auto;
        display: block;
        width: fit-content;
        background-color: $color-accent;
        color: $color-light-text;
        font-size: 18px;
        border: none;
        border-radius: 10px;
        padding: 6px 14px;
        width: 400px;
        height: 56px;
        cursor: pointer;
    }

    &__info-container {
        max-width: $vp-1440;
        padding: 0 50px;
        margin: 0 auto 70px auto;
        display: flex;
        column-gap: 40px;
    }

    &__info,
    &__inside,
    &__territory {
        flex: 1;
        border: 1px solid $color-accent;
        padding: 30px;

        h3 {
            color: $color-accent;
            text-transform: uppercase;
            margin-bottom: 16px;
        }

        p {
            margin-bottom: 10px;
            font-size: 16px;
        }

        ul {
            margin-bottom: 20px;
        }

        li {
            position: relative;
            padding-left: 14px;
            font-size: 16px;

            &::before {
                content: "";
                position: absolute;
                top: 0.8em;
                left: 0;
                width: 6px;
                height: 2px;
                background-color: $color-accent;
            }
        }
    }

    &__inside,
    &__territory {
        position: relative;

        &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: -26px;
            height: 10px;
            width: 10px;
            background-color: $color-accent;
            border-radius: 50%;
        }
    }

    &__optional-text {
        font-size: 14px;
        margin: 0 !important;
    }

    &__another-house {
        max-width: $vp-1440;
        margin: 0 auto;
        padding: 0 50px;

        p {
            font-size: 22px;
            margin-bottom: 26px;
        }
    }

    &__another-house-card {
        max-width: 300px;

        span {
            display: block;

            &:nth-of-type(1) {
                margin-bottom: 10px;
                font-size: 18px;
            }

            &:nth-of-type(2) {
                margin-bottom: 16px;
                font-size: 16px;
            }
        }
    }

    &__another-house-image {
        height: 200px;
        width: 100%;
        object-fit: cover;
        margin-bottom: 14px;
    }

    &__another-house-link {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: $color-accent;
        column-gap: 10px;

        span {
            margin: 0 !important;
        }
    }
}

@media (max-width: $vp-1024) {
    .house-detail {
        &__title-container {
            padding: 0 30px;
            margin: 30px auto;
        }

        &__title {
            font-size: 32px;
            margin-bottom: 20px;
        }

        &__description {
            width: 70%;
            font-size: 18px;
        }

        &__time {
            font-size: 18px;
        }

        &__swiper {
            height: 450px;
        }

        &__slide {
            width: 350px;
            height: 350px;
            margin-right: 20px;
        }

        &__control-icon {
            width: 50px;
            height: 50px;
        }

        &__button {
            width: 300px;
            height: 50px;
            font-size: 16px;
            margin-bottom: 50px;
        }

        &__info-container {
            padding: 0 30px;
            column-gap: 30px;
            margin-bottom: 50px;
        }

        &__info,
        &__inside,
        &__territory {
            padding: 20px;

            h3 {
                font-size: 18px;
            }

            p,
            li {
                font-size: 14px;
            }
        }

        &__another-house {
            padding: 0 30px;

            p {
                font-size: 20px;
            }
        }
    }
}

@media (max-width: $vp-768) {
    .house-detail {
        &__container {
            margin: 0 auto 40px auto;
        }

        &__title-container {
            padding: 0 16px;
            margin: 20px auto;
        }

        &__title {
            font-size: 24px;
            margin-bottom: 16px;
        }

        &__description {
            width: 100%;
            font-size: 16px;
            margin-bottom: 24px;
        }

        &__time {
            font-size: 16px;
        }

        &__slider-wrapper {
            margin-bottom: 40px;
        }

        &__swiper {
            height: 300px;
        }

        &__slide {
            width: 250px;
            height: 250px;
            margin-right: 12px;
            border-radius: 12px;

            &-inner {
                border-radius: 12px;
            }

            &.swiper-slide-active {
                transform: scale(1.1);
            }
        }

        &__control {
            display: none;
        }

        &__button {
            width: calc(100% - 32px);
            margin: 0 16px 40px 16px;
            height: 48px;
            font-size: 16px;
        }

        &__info-container {
            flex-direction: column;
            padding: 0 16px;
            gap: 20px;
            margin-bottom: 40px;
        }

        &__info,
        &__inside,
        &__territory {
            padding: 20px;

            h3 {
                font-size: 18px;
                margin-bottom: 12px;
            }

            p,
            li {
                font-size: 14px;
            }

            ul {
                margin-bottom: 16px;
            }
        }

        &__inside::before,
        &__territory::before {
            display: none;
        }

        &__another-house {
            padding: 0 16px;

            p {
                font-size: 18px;
                margin-bottom: 20px;
            }
        }

        &__another-house-card {
            max-width: 100%;
        }

        &__another-house-image {
            height: 180px;
        }
    }
}
</style>