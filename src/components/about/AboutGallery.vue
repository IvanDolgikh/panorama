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
        // Сетка на всю ширину и высоту
        width: 100vw; // Используем viewport width
        height: 100vh; // Используем viewport height
        padding: 0 50px; // Убираем паддинги

        // Настройка сетки
        display: grid;
        grid-template-columns: repeat(5, 1fr); // Две колонки
        grid-template-rows: 1fr 1fr; // Две строки
        gap: 16px; // Небольшой зазор между фото (опционально)

        // Убираем скролл, если изображения выходят за пределы
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
        overflow-x: hidden;
        // Изображение заполняет контейнер
        width: 100%;
        height: 100%;
        object-fit: cover; // Покрывает всю площадь, сохраняя пропорции

        // Опционально: плавное увеличение при наведении
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.05);
        }
    }
}
</style>