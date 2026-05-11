<template>
    <footer class="main-footer">
        <div class="main-footer__container">
            <Logo :color="'dark'" />

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
import ofertaPdf from '../../public/docs/oferta.pdf'

const pdfUrl = new URL(ofertaPdf, import.meta.url).href

</script>

<style lang="scss">
.main-footer {
    position: relative;
    margin-top: auto;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 1px;
        background-color: #bdbdbd;
    }

    &__container {
        width: $vp-1440;
        margin: 0 auto;
        display: grid;
        align-items: center;
        justify-items: center;
        grid-template-columns: repeat(3, 1fr);
        padding: 10px 50px;
    }

    &__documents {
        text-align: center;

        a {
            text-decoration: underline;
            color: $color-base-text;
            transition: color 0.3s;

            &:hover {
                color: $color-accent;
            }
        }

        p {
            margin-top: 8px;
            font-size: 14px;
        }
    }

    &__social {
        display: flex;
        width: fit-content;
        column-gap: 12px;
        justify-self: end;
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
        transition: transform 0.3s;

        &:hover {
            transform: scale(1.1);
        }

        span {
            font-size: 24px;
            color: $color-accent;
        }
    }
}

@media (max-width: $vp-1024) {
    .main-footer {
        &__container {
            width: 100%;
            padding: 10px 30px;
        }

        &__documents {
            font-size: 14px;

            p {
                font-size: 12px;
            }
        }

        &__social-link span {
            font-size: 22px;
        }
    }
}

@media (max-width: $vp-768) {
    .main-footer {
        &__container {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 20px 16px;
            text-align: center;
        }

        &__documents {
            order: 3;

            p {
                margin-top: 8px;
            }
        }

        &__social {
            display: none;
        }

        &__social-link span {
            font-size: 28px;
        }

        &__container>div:first-child {
            order: 3;
        }
    }
}
</style>