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
                    v-for="(house, index) in store.houses"
                    :key="index"
                >
                    <House
                        :house="house"
                        :class="{ 'houses__card--separator': index % 2 === 1 }"
                    />

                    <!-- Добавляем разделитель после каждого дома, кроме последнего -->
                    <div
                        v-if="index < store.houses.length - 1"
                        class="houses__separator"
                    ></div>
                </template>
            </div>
        </div>
    </section>
</template>

<script setup>
import { onMounted } from 'vue'
import House from './House.vue';
import { useDataStore } from '@stores/data'

const store = useDataStore()

onMounted(async () => {
    await store.loadHouses()
})

</script>

<style lang="scss">
$vp-1024: 1024px;
$vp-768: 768px;

.houses {
    &__container {
        width: $vp-1440;
        margin: 0 auto 80px auto;
        padding: 0 50px;

        @media (max-width: $vp-1024) {
            width: 100%;
            margin: 0 auto 60px auto;
            padding: 0 30px;
        }

        @media (max-width: $vp-768) {
            margin: 0 auto 40px auto;
            padding: 0 16px;
        }
    }

    &__info {
        margin: 0 auto;
        margin-bottom: 70px;

        @media (max-width: $vp-1024) {
            margin-bottom: 50px;
        }

        @media (max-width: $vp-768) {
            margin-bottom: 40px;
        }
    }

    &__title {
        font-size: 36px;
        font-weight: 500;
        text-align: center;
        text-transform: uppercase;
        margin-bottom: 40px;

        @media (max-width: $vp-1024) {
            font-size: 32px;
            margin-bottom: 30px;
        }

        @media (max-width: $vp-768) {
            font-size: 24px;
            margin-bottom: 20px;
        }
    }

    &__text {
        font-size: 24px;
        text-align: center;
        width: 80%;
        margin: 0 auto;

        @media (max-width: $vp-1024) {
            font-size: 20px;
            width: 90%;
        }

        @media (max-width: $vp-768) {
            font-size: 16px;
            width: 100%;
            line-height: 1.5;
        }
    }

    &__list {
        display: flex;
        flex-direction: column;
    }

    &__separator {
        width: 60%;
        height: 2px;
        margin: 60px auto;
        background: linear-gradient(to right,
                transparent,
                $color-accent,
                transparent);
        opacity: 0.5;
        transition: opacity 0.3s, width 0.3s;

        @media (max-width: $vp-1024) {
            width: 70%;
            margin: 50px auto;
        }

        @media (max-width: $vp-768) {
            width: 80%;
            margin: 40px auto;

            // Убираем анимацию при наведении на мобильных
            &:hover {
                width: 80%;
            }
        }

        &:hover {
            opacity: 1;
            width: 80%;

            @media (max-width: $vp-768) {
                width: 80%;
            }
        }
    }
}
</style>