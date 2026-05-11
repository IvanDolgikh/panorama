<template>
    <div class="pricing">
        <h3 class="pricing__title">Базовые цены</h3>
        <div class="pricing__row">
            <div class="pricing__field">
                <label>Будни (₽)</label>
                <InputNumber
                    v-model="pricing.base"
                    :min="0"
                    fluid
                />
            </div>
            <div class="pricing__field">
                <label>Выходные (₽)</label>
                <InputNumber
                    v-model="pricing.weekend"
                    :min="0"
                    fluid
                />
            </div>
        </div>

        <h3 class="pricing__title">Особые периоды</h3>
        <div
            v-for="(period, index) in pricing.custom"
            :key="index"
            class="pricing__period"
        >
            <div class="pricing__period-header">
                <InputText
                    v-model="period.label"
                    placeholder="Название"
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    severity="danger"
                    size="small"
                    @click="removePeriod(index)"
                />
            </div>
            <div class="pricing__period-dates">
                <DatePicker
                    v-model="period.startDate"
                    placeholder="С"
                    showIcon
                />
                <DatePicker
                    v-model="period.endDate"
                    placeholder="По"
                    showIcon
                />
                <InputNumber
                    v-model="period.price"
                    placeholder="Цена"
                    :min="0"
                />
            </div>
        </div>

        <Button
            label="Добавить период"
            icon="pi pi-plus"
            class
            size="small"
            outlined
            @click="addPeriod"
        >
        </Button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'

const props = defineProps({
    modelValue: { type: Object, required: true }
})

const emit = defineEmits(['update:modelValue'])

const pricing = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const addPeriod = () => {
    const updated = { ...pricing.value, custom: [...pricing.value.custom, { label: '', startDate: null, endDate: null, price: null }] }
    emit('update:modelValue', updated)
}

const removePeriod = (index) => {
    const custom = pricing.value.custom.filter((_, i) => i !== index)
    emit('update:modelValue', { ...pricing.value, custom })
}
</script>

<style
    lang="scss"
    scoped
>
.pricing {
    &__title {
        margin-bottom: 12px;
        font-size: 16px;
        color: $color-base-text;
    }

    &__row {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
    }

    &__field {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;

        label {
            font-size: 14px;
            color: $color-base-text;
        }
    }

    &__period {
        background: #f8f9fa;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
    }

    &__period-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
    }

    &__period-dates {
        display: flex;
        gap: 8px;
    }
}
</style>