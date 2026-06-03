<template>
    <header
        class="main-header"
        ref="header"
    >
        <div class="main-header__container">
            <h1 class="visually-hidden">Гостевые дома Панорама</h1>
            <Logo
                class="main-header__logo"
                :color="'dark'"
            />

            <button
                class="main-header__burger"
                :class="{ 'main-header__burger--open': isMenuOpen }"
                @click="isMenuOpen = !isMenuOpen"
                aria-label="Открыть меню"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div
                class="main-header__nav-wrapper"
                :class="{ 'main-header__nav-wrapper--open': isMenuOpen }"
            >
                <nav>
                    <ul class="main-header__list-links">
                        <li class="main-header__link-container">
                            <RouterLink
                                to="/#about"
                                @click="closeMenu"
                            >О нас</RouterLink>
                        </li>
                        <li class="main-header__link-container">
                            <RouterLink
                                to="/#houses"
                                @click="closeMenu"
                            >Домики</RouterLink>
                        </li>
                        <li class="main-header__link-container">
                            <RouterLink
                                to="/#contacts"
                                @click="closeMenu"
                            >Контакты</RouterLink>
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
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Logo from '@components/TheLogo.vue'

const header = ref(null)
const headerHeight = ref(0)
const isMenuOpen = ref(false)

const updateHeight = () => {
    if (header.value) {
        headerHeight.value = header.value.offsetHeight
    }
}

const closeMenu = () => {
    isMenuOpen.value = false
}

// Закрытие меню при изменении размера окна (если стало больше 768px)
const handleResize = () => {
    updateHeight()
    if (window.innerWidth > 768 && isMenuOpen.value) {
        isMenuOpen.value = false
    }
}

onMounted(() => {
    updateHeight()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})

defineExpose({ headerHeight })
</script>

<style lang="scss">
.main-header {
    &__container {
        width: $vp-1440;
        margin: 0 auto;
        padding: 10px 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        @media (max-width: $vp-1024) {
            width: 100%;
            padding: 10px 30px;
        }

        @media (max-width: $vp-768) {
            padding: 10px 16px;
        }
    }

    &__burger {
        display: none;
        flex-direction: column;
        justify-content: space-between;
        width: 30px;
        height: 20px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        z-index: 101;

        span {
            display: block;
            width: 100%;
            height: 2px;
            background: $color-base-text;
            transition: 0.3s;
        }

        // Анимация для открытого состояния
        &--open {
            span {
                &:first-child {
                    transform: rotate(45deg) translate(5px, 5px);
                }

                &:nth-child(2) {
                    opacity: 0;
                }

                &:last-child {
                    transform: rotate(-45deg) translate(7px, -7px);
                }
            }
        }
    }

    &__nav-wrapper {
        display: flex;
        align-items: center;
        gap: 30px;

        @media (max-width: $vp-1024) {
            gap: 20px;
        }
    }

    &__list-links {
        display: flex;
        column-gap: 24px;

        @media (max-width: $vp-1024) {
            column-gap: 16px;
        }
    }

    &__link-container {
        font-size: 20px;
        cursor: pointer;

        @media (max-width: $vp-1024) {
            font-size: 18px;
        }

        a {
            text-decoration: none;
            color: $color-base-text;
            transition: color 0.3s ease;

            &:hover {
                color: $color-accent;
            }
        }
    }

    &__contacts {
        display: flex;
        align-items: center;
        column-gap: 20px;

        @media (max-width: $vp-1024) {
            column-gap: 15px;
        }
    }

    &__phone-link {
        @include spectral-medium;
        text-decoration: none;
        color: $color-base-text;
        transition: color 0.3s ease;

        &:hover {
            color: $color-accent;
        }

        @media (max-width: $vp-1024) {
            font-size: 14px;
        }
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
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.1);
        }

        span {
            font-size: 30px;
            color: $color-accent;

            @media (max-width: $vp-1024) {
                font-size: 26px;
            }
        }
    }
}

@media (max-width: $vp-1024) {
    .main-header {
        &__list-links {
            column-gap: 16px;
        }
    }
}

@media (max-width: $vp-768) {
    .main-header {
        &__container {
            width: 100%;
            padding: 10px 16px;
            position: relative;
        }

        &__burger {
            display: flex;
        }

        &__nav-wrapper {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: $color-bg-default;
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            z-index: 100;
            gap: 20px;

            &--open {
                display: flex;
                animation: slideDown 0.3s ease;
            }
        }

        &__list-links {
            flex-direction: column;
            text-align: center;
            width: 100%;
        }

        &__link-container {
            font-size: 18px;
            padding: 8px 0;
        }

        &__contacts {
            flex-direction: column;
            row-gap: 12px;
            margin-top: 16px;
            width: 100%;
            text-align: center;
        }

        &__phone-link {
            font-size: 16px;
        }

        &__link-tg span {
            font-size: 24px;
        }
    }
}

// Анимация для мобильного меню
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>