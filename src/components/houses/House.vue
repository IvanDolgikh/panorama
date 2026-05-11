<template>
    <section class="house">
        <div class="house__container">
            <div class="house__image-container">
                <img
                    class="house__image"
                    :src="house.mainPhoto"
                    :alt="house.slug"
                    height="500"
                >
            </div>

            <div class="house__info">
                <h3 class="house__title">{{ house.title }}</h3>
                <p class="house__description">{{ house.description }}</p>
                <div class="house__price-container">
                    <div class="house__price-day-container">
                        <p class="house__day">Пн-Чт, Вс</p>
                        <p class="house__price">{{ house.pricing.base }}</p>
                    </div>

                    <div class="house__price-day-container">
                        <p class="house__day">Пт, Сб</p>
                        <p class="house__price">{{ house.pricing.weekend }}</p>
                    </div>
                </div>

                <div class="house__buttons-container">
                    <button @click="isOpenDialog = true">Забронировать</button>
                    <div class="house__link">
                        <RouterLink :to="{
                            name: 'house-detail',
                            params: { slug: house.slug }
                        }">
                            Узнать больше
                        </RouterLink>
                        <span class="pi pi-arrow-right"></span>
                    </div>
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
import { ref, watch } from 'vue'
import HouseBooking from './HouseBooking.vue'
import HouseSuccessBooking from './HouseSuccessBooking.vue'

defineProps({
    house: {
        type: Object,
        required: true
    }
})

const isOpenDialog = ref(false)
const isSuccesSubmit = ref(false)

const onCloseDialog = () => {
    isOpenDialog.value = false
}

const onSuccessSubmit = () => {
    isSuccesSubmit.value = true
    isOpenDialog.value = false
}

const onCloseDialogSuccess = () => {
    isSuccesSubmit.value = false
}

watch(isSuccesSubmit, (value) => {
    if (value) {
        setTimeout(() => {
            isSuccesSubmit.value = false
        }, 5000)
    }
});
</script>

<style lang="scss">
.house {
    &__container {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        column-gap: 70px;
        margin: 0 auto;
    }

    &__image-container {
        overflow: hidden;
        border-radius: 20px;
        height: 500px;
    }

    &__image {
        width: 100%;
        height: 500px;
        aspect-ratio: 16 / 9;
        object-fit: cover;
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.05);
        }
    }

    &__info {
        display: flex;
        flex-direction: column;
    }

    &__title {
        text-align: end;
        font-size: 28px;
        text-transform: uppercase;
        margin-bottom: 40px;
    }

    &__description {
        font-size: 20px;
        margin-bottom: 50px;
    }

    &__price-container {
        background-color: #eaeadd;
        border-radius: 30px;
        padding: 18px 30px;
        width: 60%;
    }

    &__price-day-container {
        display: grid;
        grid-template-columns: 0.6fr 1fr;

        &:first-child {
            margin-bottom: 16px;
        }
    }

    &__price {
        font-weight: 600;
    }

    &__buttons-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: auto 20px 20px 20px;

        button {
            background-color: $color-accent;
            color: $color-light-text;
            font-size: 18px;
            border: none;
            border-radius: 10px;
            padding: 6px 14px;
            cursor: pointer;
            transition: background-color 0.3s;

            &:hover {
                background-color: darken($color-accent, 10%);
            }
        }

        .house__link {
            display: flex;
            align-items: center;
            column-gap: 16px;
            cursor: pointer;

            span {
                font-size: 16px;
                color: $color-accent;
            }
        }
    }
}

@media (max-width: $vp-1024) {
    .house {
        &__container {
            grid-template-columns: 1fr;
            column-gap: 0;
            row-gap: 40px;
        }

        &__image-container {
            height: 400px;
        }

        &__image {
            height: 400px;
        }

        &__info {
            order: 2;
        }

        &__title {
            text-align: center;
            font-size: 26px;
            margin-bottom: 30px;
        }

        &__description {
            font-size: 18px;
            margin-bottom: 40px;
            text-align: center;
        }

        &__price-container {
            width: fit-content;
            min-width: 280px;
            margin: 0 auto;
            padding: 16px 32px;
            display: inline-block;
        }

        &__price-day-container {
            grid-template-columns: 1fr 1fr;
            gap: 20px;

            &:first-child {
                margin-bottom: 12px;
            }
        }

        &__day {
            text-align: left;
        }

        &__price {
            text-align: right;
        }

        &__buttons-container {
            margin: 40px 20px 20px 20px;
        }
    }
}

@media (max-width: $vp-768) {
    .house {
        &__container {
            row-gap: 30px;
        }

        &__image-container {
            height: 280px;
            border-radius: 16px;
        }

        &__image {
            height: 280px;

            &:hover {
                transform: none;
            }
        }

        &__title {
            font-size: 22px;
            margin-bottom: 20px;
            text-align: center;
        }

        &__description {
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.5;
            text-align: left;
        }

        &__price-container {
            width: 100%;
            background: linear-gradient(135deg, #eaeadd 0%, #f5f5eb 100%);
            border-radius: 24px;
            padding: 20px 24px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        &__price-day-container {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 0;

            &:first-child {
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
            }
        }

        &__day {
            font-size: 15px;
            font-weight: 500;
            color: #4a4a3a;
        }

        &__price {
            font-size: 18px;
            font-weight: 700;
            color: $color-accent;
        }

        &__buttons-container {
            flex-direction: column;
            gap: 16px;
            margin: 30px 0 0 0;

            button {
                width: 100%;
                padding: 14px 20px;
                font-size: 16px;
                border-radius: 12px;
                font-weight: 500;
            }

            .house__link {
                justify-content: center;
                padding: 10px 0;

                a {
                    font-size: 16px;
                }
            }
        }
    }
}
</style>