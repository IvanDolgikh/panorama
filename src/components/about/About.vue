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
        width: $vp-1200;
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
</style>