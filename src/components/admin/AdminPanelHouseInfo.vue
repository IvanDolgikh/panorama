<template>
    <div class="house-details">
        <div class="house-details__container">

            <div class="house-details__photo-container">
                <div
                    v-if="!house.mainPhoto"
                    class="house-details__fake-photo"
                >
                    <span class="pi pi-image"></span>
                </div>
                <img
                    v-else
                    :src="house.mainPhoto"
                    class="house-details__photo"
                    :alt="house.title"
                    height="340"
                />
            </div>

            <div class="house-details__info-container">
                <p class="house-details__title">{{ house.title || 'Нет' }}</p>
                <p class="house-details__description"><strong>Описание:</strong> {{ house.description || 'Нет' }}</p>
                <p class="house-details__time-in"><strong>Заезд:</strong> {{ house.checkInTime }}</p>
                <p class="house-details__time-out"><strong>Выезд:</strong> {{ house.checkOutTime }}</p>
                <p class="house-details__price">
                    <strong>Цены:</strong>
                    Будни: {{ house.pricing.base }}₽,
                    Выходные: {{ house.pricing.weekend }}₽
                </p>
                <p class="house-details__gist-link">
                    <strong>Ссылка для синхронизации календарей с внешними ресурсами:</strong>
                    {{ `https://gist.githubusercontent.com/IvanDolgikh/${house.gistId.id}/raw/215ee378d8aa05503c3157a4d61f551530709035/${house.gistId.filename}` }}
                </p>
            </div>

            <div class="house-details__actions">
                <SpeedDial
                    :model="items"
                    direction="down"
                    style="position: absolute; top: 0"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import SpeedDial from 'primevue/speeddial';

const props = defineProps({
    house: {
        type: Object,
        required: true,
        default: () => ({})
    }
})

const emit = defineEmits(['edit-house', 'delete-house'])

const items = ref([
    {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
            emit('edit-house', props.house);
        }
    },
    {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => emit('delete-house', props.house)
    },
])
</script>

<style lang="scss">
.house-details {
    color: $color-base-text;

    &__container {
        display: grid;
        grid-template-columns: 0.8fr 1fr 30px;
        column-gap: 50px;
    }

    &__fake-photo {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 340px;
        background-color: $color-gray-lighter;
        border-radius: 20px;
        margin-bottom: 20px;

        span {
            font-size: 60px;
            font-weight: 400;
            color: #ecececed;
        }
    }

    &__photo {
        width: 100%;
        height: 340px;
        border-radius: 20px;
        object-fit: cover;
        margin-bottom: 20px;
    }

    &__info-container {
        padding: 20px 0;
    }

    &__title {
        font-size: 22px;
        margin-bottom: 10px;
        font-weight: 500;
    }

    &__description {
        margin-bottom: 10px;
    }

    &__time-out,
    &__price {
        margin-bottom: 10px;
    }

    &__gist-link {
        word-break: break-word;
        background: #f5f5f5;
        border-radius: 8px;
    }

    &__actions {
        position: relative;

        .p-button {
            width: 30px !important;
            height: 30px !important;
            background-color: transparent !important;
            color: $color-accent !important;
            border-color: $color-accent !important;
        }
    }
}

@media (max-width: $vp-1024) {
    .house-details {
        &__container {
            grid-template-columns: 1fr 30px;
            column-gap: 20px;
        }

        &__photo-container {
            grid-row: 1;
        }

        &__info-container {
            grid-row: 2;
            grid-column: 1 / 3;
            padding: 0;
            margin-top: 20px;
        }

        &__fake-photo,
        &__photo {
            height: 280px;
        }

        &__title {
            font-size: 20px;
        }
    }
}

@media (max-width: $vp-768) {
    .house-details {
        &__container {
            grid-template-columns: 1fr;
            column-gap: 0;
            position: relative;
        }

        &__photo-container {
            grid-row: 1;
        }

        &__info-container {
            grid-row: 2;
            grid-column: 1;
            margin-top: 16px;
        }

        &__actions {
            position: absolute;
            top: 14px;
            right: 44px;
            z-index: 10;

            .p-button {
                background-color: $color-accent !important;
                color: $color-bg-default !important;
            }
        }

        &__fake-photo,
        &__photo {
            height: 240px;
            border-radius: 16px;
            margin-bottom: 0;
        }

        &__fake-photo span {
            font-size: 40px;
        }

        &__info-container {
            padding: 0;
        }

        &__title {
            font-size: 18px;
            margin-bottom: 8px;
        }

        &__description,
        &__time-in,
        &__time-out,
        &__price,
        &__gist-link {
            font-size: 14px;
            margin-bottom: 8px;
        }

        &__time-in {
            margin: 0;
        }
    }
}
</style>