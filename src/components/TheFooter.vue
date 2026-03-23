<template>
    <footer class="main-footer">
        <div class="main-footer__container">
            <Logo
                :color="'dark'"
                :size="logoSize"
            />

            <div class="main-footer__documents">
                <a
                    :href="pdfUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                >Публичная оферта</a>
                <p>
                    <span>©</span> 2025 Панорама
                </p>
            </div>

            <div class="main-footer__social">
                <a
                    class="main-footer__social-link"
                    href="https://t.me/panorama_guest"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <span class="pi pi-telegram"></span>
                </a>

                <a
                    class="main-footer__social-link"
                    href="https://t.me/panorama_guest"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <span class="pi pi-instagram"></span>
                </a>
            </div>
        </div>
    </footer>
</template>

<script setup>
import Logo from '@components/TheLogo.vue'

import ofertaPdf from '../assets/documets/oferta.pdf'

// Преобразуем в URL
const pdfUrl = new URL(ofertaPdf, import.meta.url).href

const logoSize = {
    width: 90,
    height: 90
}
</script>

<style lang="scss">
.main-footer {
    position: relative;
    margin-top: auto;

    &::after {
        content: '';
        position: absolute;
        top: 0; // Отступ от блока
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 1px;
        background-color: #bdbdbd;
    }


    &__container {
        width: $vp-1200;
        margin: 0 auto;
        display: grid;
        align-items: center;
        justify-items: center;
        grid-template-columns: repeat(3, 1fr);
        padding: 10px 50px;
    }

    &__documents {
        a {
            text-decoration: underline;
        }
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

        span {
            font-size: 24px;
            color: $color-accent;
        }
    }
}
</style>