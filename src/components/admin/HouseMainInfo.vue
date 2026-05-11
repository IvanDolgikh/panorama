<template>
    <div class="main-info">
        <div class="main-info__field">
            <label for="title">Название дома</label>
            <InputText
                v-model="form.title"
                id="title"
                placeholder="Дом Бакенщика"
                fluid
            />
        </div>

        <div class="main-info__field">
            <label for="slug">Slug (для URL)</label>
            <InputText
                v-model="form.slug"
                id="slug"
                placeholder="bakenschika"
                fluid
            />
        </div>

        <div class="main-info__field">
            <label for="icsAvito">Ссылка ICS (Авито)</label>
            <InputText
                v-model="form.icsUrls.avito"
                id="icsAvito"
                placeholder="https://..."
                fluid
            />
        </div>
        <div class="main-info__field">
            <label for="icsYandex">Ссылка ICS (Яндекс)</label>
            <InputText
                v-model="form.icsUrls.yandex"
                id="icsYandex"
                placeholder="https://..."
                fluid
            />
        </div>

        <div class="main-info__field">
            <label for="description">Описание дома</label>
            <Textarea
                v-model="form.description"
                id="description"
                rows="3"
                placeholder="Опишите дом..."
                fluid
            />
        </div>

        <div class="main-info__field">
            <label for="checkInTime">Время заезда</label>
            <InputText
                v-model="form.checkInTime"
                id="checkInTime"
                placeholder="14:00"
                fluid
            />
        </div>

        <!-- ✅ Время выезда -->
        <div class="main-info__field">
            <label for="checkOutTime">Время выезда</label>
            <InputText
                v-model="form.checkOutTime"
                id="checkOutTime"
                placeholder="12:00"
                fluid
            />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'

const props = defineProps({
    modelValue: { type: Object, required: true }
})

const emit = defineEmits(['update:modelValue'])
const form = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})
</script>

<style
    lang="scss"
    scoped
>
.main-info {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__field {
        display: flex;
        flex-direction: column;
        gap: 6px;

        label {
            font-size: 14px;
            font-weight: 500;
            color: $color-base-text ;
        }
    }
}
</style>