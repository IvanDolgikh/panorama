<template>
    <section class="promo">
        <div class="promo__container">
            <div class="promo__title-container">
                <h2 class="promo__title">Станьте частью нашей панорамы</h2>
                <button class="promo__button">Забронировать</button>
                <!-- <div class="promo__arrow">
                    <span class="pi pi-arrow-down"></span>
                </div> -->
            </div>
        </div>
    </section>
</template>

<script setup>
import { inject } from 'vue'

const headerHeight = inject('headerHeight')

</script>

<style lang="scss">
.promo {
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('../assets/images/other/house-1/view.jpg') no-repeat center;
    background-size: cover;
    background-position: 30% 50%;

    &__container {
        width: $vp-1200;
        margin: 0 auto 70px auto;
        position: relative;
        padding: 0 50px;
        height: calc(100vh - v-bind('headerHeight + "px"'));
    }

    &__title {
        width: 100%;
        text-align: center;
        font-size: 68px;
        color: $color-light-text;
        font-weight: 600;
        margin-bottom: 30px;
    }

    &__button {
        padding: 10px 16px;
        max-width: 300px;
        width: 100%;
        margin: 0 auto;
        display: block;
        font-size: 22px;
        background-color: #fffcf01f;
        border: 1px solid $color-bg-default;
        color: $color-light-text;
        border-radius: 16px;
        cursor: pointer;
    }

    &__title-container {
        width: fit-content;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    // &__arrow {
    //     width: fit-content;
    //     margin: 0 auto;
    //     span {
    //         font-size: 30px;
    //         color: $color-light-text;
    //     }
    // }
}
</style>