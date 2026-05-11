<template>
    <section class="about-gallery">
        <div class="about-gallery__container">
            <div class="about-gallery__item about-gallery__item--1">
                <img
                    src="@other-images/house-1/house.jpg"
                    alt="Дом бакенщика"
                    class="about-gallery__image"
                >
            </div>
            <div class="about-gallery__item about-gallery__item--2">
                <img
                    src="@other-images/ladder.jpg"
                    alt="Лестница на территории"
                    class="about-gallery__image"
                >
            </div>
            <div class="about-gallery__item about-gallery__item--3">
                <img
                    src="@other-images/house-2/view.jpg"
                    alt="Вид с территории на реку"
                    class="about-gallery__image"
                >
            </div>
            <div class="about-gallery__item about-gallery__item--4">
                <img
                    src="@other-images/sauna/sauna-out-of-territory.jpg"
                    alt="Баня издалека"
                    class="about-gallery__image"
                >
            </div>
        </div>
    </section>
</template>

<style lang="scss">
.about-gallery {
    overflow-x: hidden;

    &__container {
        width: 100vw;
        height: 100vh;
        padding: 0 50px;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: 1fr 1fr;
        gap: 16px;
        overflow-x: hidden;
        margin-bottom: 50px;
    }

    &__item {
        border-radius: 14px;
        overflow: hidden;

        &--1 {
            grid-column: 1 / 4;
        }

        &--2 {
            grid-column: 4 / 6;
        }

        &--3 {
            grid-row: 2;
            grid-column: 1 / 3;
        }

        &--4 {
            grid-row: 2;
            grid-column: 3 / 6;
        }
    }

    &__image {
        width: 100%;
        height: 100%;
        aspect-ratio: 16 / 9;
        object-fit: cover;
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.05);
        }
    }
}

// Планшеты (до 1024px)
@media (max-width: $vp-1024) {
    .about-gallery {
        &__container {
            height: 60vh;
            padding: 0 30px;
            gap: 10px;
            margin-bottom: 40px;
        }

        &__item {
            border-radius: 12px;
        }
    }
}

// Мобильные устройства (до 768px)
@media (max-width: $vp-768) {
    .about-gallery {
        &__container {
            height: auto;
            padding: 0 16px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto;
            gap: 8px;
            margin-bottom: 30px;
        }

        &__item {
            border-radius: 10px;
            aspect-ratio: 4 / 3;

            // Сбрасываем все позиционирования
            grid-column: auto !important;
            grid-row: auto !important;
        }

        &__image {
            &:hover {
                transform: none;
            }
        }
    }
}
</style>