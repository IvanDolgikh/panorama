<template>
    <section class="promo">
        <div class="promo__container">
            <div class="promo__title-container">
                <h2 class="promo__title">Станьте частью нашей панорамы</h2>
                <RouterLink
                    to="/#houses"
                    class="promo__button"
                >Забронировать</RouterLink>
            </div>
            <div
                class="promo__scroll-hint"
                @click="scrollDown"
            >
                <PhCaretDown />
            </div>
        </div>
    </section>
</template>

<script setup>
import { inject } from 'vue'
import { PhCaretDown } from '@phosphor-icons/vue'

const headerHeight = inject('headerHeight')

const scrollDown = () => {
    window.scrollTo({
        top: window.innerHeight - headerHeight.value,
        behavior: 'smooth'
    })
}
</script>

<style lang="scss">
.promo {
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('../assets/images/other/house-1/view.avif') no-repeat center;
    background-size: cover;
    background-position: 30% 50%;

    &__container {
        width: $vp-1440;
        margin: 0 auto 70px auto;
        position: relative;
        padding: 0 50px;
        height: calc(100vh - v-bind('headerHeight + "px"'));
        display: flex;
        flex-direction: column;
        justify-content: center;
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
        transition: background-color 0.3s;

        &:hover {
            background-color: #fffcf03f;
        }
    }

    &__title-container {
        width: fit-content;
        margin: 0 auto;
        text-align: center;
    }

    &__scroll-hint {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        color: $color-light-text;
        cursor: pointer;
        animation: bounce 2s infinite;
        opacity: 0.7;

        svg {
            width: 54px;
            height: 54px;
        }

        &:hover {
            opacity: 1;
        }
    }

    @keyframes bounce {

        0%,
        20%,
        50%,
        80%,
        100% {
            transform: translateX(-50%) translateY(0);
        }

        40% {
            transform: translateX(-50%) translateY(-10px);
        }

        60% {
            transform: translateX(-50%) translateY(-5px);
        }
    }
}

@media (max-width: $vp-1024) {
    .promo {
        &__container {
            width: 100%;
            padding: 0 30px;
            margin: 0 auto 50px auto;
        }

        &__title {
            font-size: 52px;
            margin-bottom: 25px;
        }

        &__button {
            font-size: 20px;
            max-width: 280px;
        }
    }
}

@media (max-width: $vp-768) {
    .promo {
        background-position: center;

        &__container {
            width: 100%;
            padding: 0 20px;
            margin: 0 auto 40px auto;
        }

        &__title {
            font-size: 32px;
            margin-bottom: 20px;
        }

        &__button {
            font-size: 18px;
            padding: 12px 20px;
            max-width: 250px;
        }

        &__scroll-hint {
            bottom: 20px;

            svg {
                width: 24px;
                height: 24px;
            }
        }
    }
}
</style>