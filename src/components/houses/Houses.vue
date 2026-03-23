<template>
    <section
        class="houses"
        id="houses"
    >
        <div class="houses__container">
            <div class="houses__info">
                <h2 class="visually-hidden">Домики</h2>
                <p class="houses__title">Дома &laquo;Бакенщика&raquo; и&nbsp;&laquo;Ямщика&raquo;</p>
                <p class="houses__text">Добро пожаловать в&nbsp;историческое село Созоново, стоявшее на&nbsp;Великом Чайном пути. Наш участок на&nbsp;живописном берегу реки Туры хранит память о&nbsp;прошлом: здесь жил бакенщик, чей огонек был ориентиром для судов. В&nbsp;честь него и&nbsp;ключевой профессии той эпохи&nbsp;&mdash; ямщика&nbsp;&mdash; названы наши дома. Отдохните в&nbsp;месте, где дышит история.</p>
            </div>

            <div class="houses__list">
                <template
                    v-for="(house, index) in houses"
                    :key="index"
                >
                    <House
                        :house="house"
                        :class="{ 'houses__card--separator': index % 2 === 1 }"
                    />

                    <!-- Добавляем разделитель после каждого дома, кроме последнего -->
                    <div
                        v-if="index < houses.length - 1"
                        class="houses__separator"
                    ></div>
                </template>
            </div>
        </div>
    </section>
</template>

<script setup>
import House from './House.vue';

import { houses } from '@/data/houses'

</script>

<style lang="scss">
.houses {
    &__container {
        width: $vp-1200;
        margin: 0 auto 80px auto;
        padding: 0 50px;
    }

    &__info {
        margin: 0 auto;
        margin-bottom: 70px;
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
    }

    &__list {
        display: flex;
        flex-direction: column;
    }


    &__separator {
        width: 60%;
        height: 2px;
        margin: 60px auto; // Отступы сверху и снизу
        background: linear-gradient(to right,
                transparent,
                $color-accent,
                transparent);
        opacity: 0.5;

        // Анимированная линия при наведении
        transition: opacity 0.3s, width 0.3s;

        &:hover {
            opacity: 1;
            width: 80%;
        }
    }
}
</style>