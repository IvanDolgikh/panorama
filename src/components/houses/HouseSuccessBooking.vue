<template>
    <Dialog
        class="succes-booking"
        modal
        :visible="isSuccesSubmit"
        closeOnEscape
        :showHeader="false"
        :closable="false"
        :contentStyle="{ padding: 0 }"
        @update:visible="onClose"
    >
        <div class="succes-booking__content-container">
            <div class="succes-booking__icon-container">
                <span class="pi pi-verified"></span>
            </div>
            <p class="succes-booking__text-1">Спасибо!</p>
            <p class="succes-booking__text-2">Ваша бронь зарегистрирована. Будем ждать вас в гости!</p>
            <Button
                class="succes-booking__submit"
                type="button"
                severity="secondary"
                label="Хорошо"
                :loading="isLoading"
                @click="onClose"
            />
        </div>
    </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const props = defineProps({
    isSuccesSubmit: {
        type: Boolean,
        required: true
    }
})


const emit = defineEmits(['close-dialog'])

const onClose = () => {
    emit('close-dialog')
}
</script>

<style lang="scss">
.succes-booking {
    background-color: $color-base-white !important;
    color: $color-base-text !important;
    @include spectral-regular;
    font-size: 18px;
    width: 34%;

    &__content-container {
        padding: 30px;
    }

    &__text-1 {
        text-align: center;
        font-size: 30px;
        margin-bottom: 10px;
    }

    &__text-2 {
        text-align: center;
        font-size: 18px;
        margin-bottom: 20px;
    }

    &__icon-container {
        text-align: center;
        margin-bottom: 20px;

        span {
            font-size: 48px;
            color: #4eb73c;
        }
    }

    &__submit {
        width: 150px;
        height: 50px;
        display: block !important;
        margin: 0 auto !important;
        background-color: $color-accent !important;
        color: $color-light-text !important;
    }
}
</style>