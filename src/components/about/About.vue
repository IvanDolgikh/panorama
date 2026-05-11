<template>
    <section
        class="about"
        id="about"
    >
        <div class="about__container">
            <h2 class="visually-hidden">О нас</h2>
            <p class="about__title">Уединение. Панорама. Покой.</p>
            <p class="about__text">Наша философия&nbsp;&mdash; уважение к&nbsp;природе и&nbsp;тишине. Мы&nbsp;сдаем домики на&nbsp;краю обрыва для тех, кто ищет не&nbsp;развлечений, а&nbsp;покоя.</p>
            <p class="about__text">Это место для негромких разговоров, наблюдения за&nbsp;звездами и&nbsp;пробуждения под шепот реки. Мы&nbsp;сознательно поддерживаем атмосферу уединения, поэтому шумные компании&nbsp;&mdash; не&nbsp;для нас.</p>
        </div>
    </section>
</template>

<style lang="scss">
.about {
    &__container {
        width: $vp-1440;
        margin: 0 auto 70px auto;
        padding: 0 50px;
    }

    &__title {
        font-size: 36px;
        font-weight: 500;
        text-align: center;
        text-transform: uppercase;
        margin-bottom: 40px;
    }

    &__text {
        font-size: 24px;
        text-align: center;
        width: 80%;
        margin: 0 auto;

        &:not(:last-child) {
            margin-bottom: 20px;
        }
    }
}

@media (max-width: $vp-1024) {
    .about {
        &__container {
            width: 100%;
            padding: 0 30px;
            margin: 0 auto 50px auto;
        }

        &__title {
            font-size: 28px;
            margin-bottom: 30px;
        }

        &__text {
            font-size: 20px;
            width: 90%;
        }
    }
}

@media (max-width: $vp-768) {
    .about {
        &__container {
            padding: 0 20px;
            margin: 0 auto 40px auto;
        }

        &__title {
            font-size: 24px;
            margin-bottom: 24px;
        }

        &__text {
            font-size: 16px;
            width: 100%;
            line-height: 1.5;

            &:not(:last-child) {
                margin-bottom: 16px;
            }
        }
    }
}
</style>