<template>
    <header
        class="main-header"
        ref="header"
    >
        <div class="main-header__container">
            <h1 class="visually-hidden">Гостевые дома Панорама</h1>
            <Logo
                :color="'dark'"
                :size="logoSize"
            />
            <nav>
                <ul class="main-header__list-links">
                    <li class="main-header__link-container">
                        <a href="#about">О нас</a>
                    </li>
                    <li class="main-header__link-container">
                        <a href="#houses">Домики</a>
                    </li>
                    <li class="main-header__link-container">
                        <a href="#contacts">Контакты</a>
                    </li>
                </ul>
            </nav>

            <div class="main-header__contacts">
                <a
                    href="tel:+79229543200"
                    class="main-header__phone-link"
                >+7 (922) 954-32-00</a>

                <a
                    class="main-header__link-tg"
                    href="https://t.me/panorama_guest"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <span class="pi pi-telegram"></span>
                </a>
            </div>
        </div>
    </header>
</template>

<script setup>
import Logo from '@components/TheLogo.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const header = ref(null)
const headerHeight = ref(0)

const logoSize = {
    width: 80,
    height: 80
}

const updateHeight = () => {
    if (header.value) {
        headerHeight.value = header.value.offsetHeight
    }
}

// const isHomePage = computed(() => route.path === '/')

onMounted(() => {
    updateHeight()
    window.addEventListener('resize', updateHeight)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateHeight)
})

// Просто открываем доступ к существующей переменной
defineExpose({
    headerHeight
})
</script>
<style lang="scss">
.main-header {
    &__container {
        width: $vp-1200;
        margin: 0 auto;
        padding: 10px 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    &__list-links {
        display: flex;
        column-gap: 24px;
    }

    &__link-container {
        font-size: 20px;
        cursor: pointer;
    }

    &__contacts {
        display: flex;
        align-items: center;
        column-gap: 20px;
    }

    &__phone-link {
        @include spectral-medium;
    }

    &__link-tg {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        background-color: transparent;
        padding: 0;

        span {
            font-size: 30px;
            color: $color-accent;
        }
    }
}
</style>