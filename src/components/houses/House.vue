<template>
    <section class="house">
        <div class="house__container">
            <div class="house__image-container">
                <img
                    class="house__image"
                    :src="house.image"
                    :alt="house.imageAlt"
                >
            </div>

            <div class="house__info">
                <h3 class="house__title">{{ house.houseTitle }}</h3>
                <p class="house__description">{{ house.houseDescription }}</p>
                <div class="house__price-container">
                    <div class="house__price-day-container">
                        <p class="house__day">Пн-Чт, Вс</p>
                        <p class="house__price">{{ house.housePriceWorkday }}</p>
                    </div>

                    <div class="house__price-day-container">
                        <p class="house__day">Пт, Сб</p>
                        <p class="house__price">{{ house.housePriceWeekend }}</p>
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

            <!-- Добавил if так как компонент монтировался сразу и запрос вызывался до того, диалог откроется -->
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
</style>