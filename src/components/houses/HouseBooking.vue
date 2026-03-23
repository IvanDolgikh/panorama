<template>
    <Dialog
        class="booking"
        :visible="isOpenDialog"
        closeOnEscape
        modal
        header="Бронирование"
        @update:visible="onClose"
    >
        <div class="booking__container">
            <p class="booking__house-title">{{ house.houseTitle }}</p>

            <Form
                v-slot="$form"
                :initialValues
                :resolver
                @submit="onFormSubmit"
                class="booking__form"
            >
                <div>
                    <label
                        class="booking__input-label"
                        for="startDate"
                    >Дата заезда</label>
                    <DatePicker
                        class="booking__date"
                        name="startDate"
                        id="startDate"
                        fluid
                        showClear
                        showIcon
                        iconDisplay="input"
                        :minDate="new Date()"
                        :disabledDates="disableDate"
                    >
                        <template #date="slotProps">
                            <div
                                class="date-cell"
                                :class="{ 'booking__date-booked': isDateBooked(slotProps.date) }"
                            >
                                {{ slotProps.date.day }}
                            </div>
                        </template>

                    </DatePicker>
                    <Message
                        v-if="$form.startDate?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >{{ $form.startDate.error?.message }}</Message>
                </div>

                <div>
                    <label
                        class="booking__input-label"
                        for="endDate"
                    >Дата выезда</label>
                    <DatePicker
                        class="booking__date"
                        name="endDate"
                        id="endDate"
                        fluid
                        showClear
                        showIcon
                        iconDisplay="input"
                        :minDate="new Date()"
                        :disabledDates="disableDate"
                    >
                        <template #date="slotProps">
                            <div
                                class="date-cell"
                                :class="{ 'booking__date-booked': isDateBooked(slotProps.date) }"
                            >
                                {{ slotProps.date.day }}
                            </div>
                        </template>
                    </DatePicker>
                    <Message
                        v-if="$form.endDate?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >{{ $form.endDate.error?.message }}</Message>
                </div>

                <div class="booking__username">
                    <label
                        class="booking__input-label"
                        for="username"
                    >Ваше имя</label>
                    <InputText
                        class="booking__input"
                        inputId="username"
                        type="text"
                        placeholder="Имя"
                        name="username"
                    />
                    <Message
                        v-if="$form.username?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >{{ $form.username.error?.message }}</Message>
                </div>

                <div class="booking__phone">
                    <label
                        class="booking__input-label"
                        for="phone"
                    >Номер телефона</label>
                    <InputMask
                        v-model="phone"
                        class="booking__input"
                        inputId="phone"
                        name="phone"
                        mask="+7 (999) 999-9999"
                        placeholder="+7 (999) 999-9999"
                        fluid
                    />
                    <Message
                        v-if="$form.phone?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >{{ $form.phone.error?.message }}</Message>
                </div>

                <div class="booking__people-amount-container">
                    <label
                        class="booking__input-label"
                        for="people-amount"
                    >Количество человек</label>
                    <InputNumber
                        inputClass="booking__input"
                        id="people-amount"
                        inputId="integeronly"
                        name="peopleAmount"
                        placeholder="0"
                        fluid
                    />
                    <Message
                        v-if="$form.peopleAmount?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >{{ $form.peopleAmount.error?.message }}</Message>
                </div>

                <div class="booking__wishes">
                    <label
                        class="booking__input-label"
                        for="wishes"
                    >Ваши пожелания</label>
                    <Textarea
                        name="wishes"
                        rows="2"
                        cols="30"
                        style="resize: none"
                        fluid
                    />
                </div>

                <div class="booking__agreement">
                    <Checkbox
                        v-model="agreement"
                        class="my-checkbox"
                        inputId="ingredient1"
                        name="agreement"
                        value="Cheese"
                    />
                    <label
                        class="booking__input-label"
                        for="ingredient1"
                    > Нажимая на кнопку, вы даете согласие на обработку персональных данных и соглашаетесь c политикой конфиденциальности </label>

                    <Message
                        v-if="$form.agreement?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                    >{{ $form.agreement.error?.message }}</Message>
                </div>

                <Button
                    class="booking__submit"
                    type="submit"
                    severity="secondary"
                    label="Отправить"
                    :loading="isLoading"
                />
            </Form>
        </div>
    </Dialog>
</template>

<script setup>

import { onMounted, reactive, ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import Message from 'primevue/message';
import Dialog from 'primevue/dialog';
import DatePicker from 'primevue/datepicker';
import Textarea from 'primevue/textarea';
import { Form } from '@primevue/forms';

import { sendTelegramNotification } from '@services/telegram'

import { db } from '@services/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

const props = defineProps({
    house: {
        type: Object,
        required: true
    },
    isOpenDialog: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['close-dialog', 'success-submit'])

const onClose = () => {
    emit('close-dialog')
}



const initialValues = reactive({
    startDate: null,
    endDate: null,
    username: '',
    phone: '',
    peopleAmount: null,
    wishes: '',
    agreement: false
});

const disableDate = ref([])

const isLoading = ref(false)

const formatLocalDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}


const isDateBooked = (date) => {
    if (!disableDate.value.length) return false;

    // Создаем дату из полей day/month/year
    const currentDate = new Date(date.year, date.month, date.day);
    currentDate.setHours(0, 0, 0, 0);

    // Проверяем, есть ли эта дата в списке занятых
    return disableDate.value.some(bookedDate => {
        const booked = new Date(bookedDate);
        booked.setHours(0, 0, 0, 0);

        return booked.getTime() === currentDate.getTime();
    });
};
const resolver = ({ values }) => {
    const errors = {};

    if (!values.startDate) {
        errors.startDate = [{ message: 'Укажите дату заезда' }];
    }

    if (!values.endDate) {
        errors.endDate = [{ message: 'Укажите дату выезда' }];
    }

    if (!values.username) {
        errors.username = [{ message: 'Укажите имя' }];
    }

    if (!values.phone) {
        errors.phone = [{ message: 'Укажите номер телефона' }];
    }

    if (!values.peopleAmount) {
        errors.peopleAmount = [{ message: 'Укажите количество человек' }];
    }

    if (!values.agreement) {
        errors.agreement = [{ message: 'Необходимо дать согласие на обработку персональных данных' }];
    }

    return {
        values,
        errors
    };
};


const onFormSubmit = async ({ valid, values }) => {
    if (!valid) return;

    try {

        isLoading.value = true
        console.log('start', formatLocalDate(values.startDate))
        console.log('end', formatLocalDate(values.endDate))
        const docRef = await addDoc(collection(db, 'bookings'), {
            houseId: props.house.id,
            houseTitle: props.house.houseTitle,
            startDate: formatLocalDate(values.startDate) || values.startDate,
            endDate: formatLocalDate(values.endDate) || values.endDate,
            username: values.username,
            phone: values.phone,
            peopleAmount: values.peopleAmount,
            wishes: values.wishes || '',
            createdAt: new Date().toISOString(),
        });

        console.log('✅ Успешно! ID:', docRef.id);
        emit('success-submit', true)

        const message = `
❗❗❗ <b>НОВОЕ БРОНИРОВАНИЕ</b>

🏡 <b>ДОМ</b>
• ${props.house.houseTitle}

📅 <b>ДАТЫ</b>
• Заезд: ${formatLocalDate(values.startDate)}
• Выезд: ${formatLocalDate(values.endDate)}
• Ночей: ${Math.ceil((new Date(values.endDate) - new Date(values.startDate)) / (1000 * 60 * 60 * 24))}

👥 <b>ГОСТИ</b>
• Количество: ${values.peopleAmount}

👤 <b>КОНТАКТЫ</b>
• Имя: ${values.username}
• Телефон: ${values.phone}
• Пожелания: ${values.wishes || 'Нет'}

<b>Создано:</b> ${new Date().toLocaleString('ru-RU')}
`

        await sendTelegramNotification(message)

    } catch (error) {
        console.error('❌ Детальная ошибка:', error);
    } finally {
        isLoading.value = false
    }
};

const loadBookedDates = async () => {
    if (!props.isOpenDialog) return
    try {
        const bookingsRef = collection(db, 'bookings');

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISO = today.toISOString().split('T')[0];

        const q = query(
            bookingsRef,
            where('houseId', '==', props.house.id),
            where('endDate', '>=', todayISO)
        );

        const querySnapshot = await getDocs(q);

        const dates = [];
        const todayTime = today.getTime();

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const startTime = new Date(data.startDate).getTime();
            const endTime = new Date(data.endDate).getTime();

            if (endTime < todayTime) return;

            // 👇 ВАЖНО: начинаем с даты заезда
            const startDate = new Date(Math.max(startTime, todayTime));
            // 👇 ВАЖНО: заканчиваем ДО даты выезда (выезд утром)
            const endDate = new Date(endTime);

            // Уменьшаем endDate на 1 день, т.к. в день выезда можно заехать
            const lastBookedDate = new Date(endDate);
            lastBookedDate.setDate(lastBookedDate.getDate() - 1);

            const currentDate = new Date(startDate);
            // Включаем дату заезда, исключаем дату выезда
            while (currentDate <= lastBookedDate) {
                dates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        disableDate.value = dates;
        console.log('✅ Загружено занятых дат (выезд свободен):', dates);

    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
    }
};

onMounted(() => {
    loadBookedDates()
})
</script>

<style lang="scss">
.booking {
    background-color: $color-base-white !important;
    color: $color-base-text !important;
    @include spectral-regular;
    font-size: 18px;
    width: 50%;

    &__container {}

    &__form {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 18px 30px;
    }

    .p-dialog-title {
        font-size: 26px;
        font-weight: 600;
    }

    &__house-title {
        text-align: center;
        font-size: 24px;
        margin-bottom: 22px;
        grid-column: 1 / 3;
    }

    &__input-label {
        font-size: 16px;
    }

    &__username {
        grid-column: 1;
    }

    &__phone {
        grid-column: 2;
    }

    &__people-amount-container,
    &__agreement {
        grid-column: 1 / 3;
    }

    &__agreement {
        font-size: 16px;
    }

    &__submit {
        grid-column: 1 / 3;
        background-color: $color-accent !important;
        color: $color-light-text !important;
    }

    &__date {
        height: 40px;

        .p-datepicker-dropdown {
            background: $color-bg-default !important;
        }
    }

    &__wishes {
        grid-column: 1 / 3;
    }

    &__date-booked {
        text-decoration: line-through;
    }

    &__input,
    .p-datepicker-input,
    .p-textarea {
        background-color: transparent !important;
        border: 1px solid $color-accent;
        font-weight: 400 !important;
        color: $color-base-text !important;
        padding: 12px 16px !important;
        border-radius: 8px !important;
        width: 100%;
    }

    &__input,
    .p-datepicker-input {
        height: 40px;
    }

    .p-inputtext:enabled:focus,
    .p-textarea:enabled:focus {
        border-color: $color-accent;
    }

    .my-checkbox {
        cursor: pointer;

        // Базовые стили для квадратика
        .p-checkbox-box {
            width: 20px;
            height: 20px;
            background: transparent !important;
            border: 1px solid $color-accent !important;
            border-radius: 4px !important;
            transition: all 0.2s ease;
            position: relative;

            // &:hover {
            //     border-color: darken($color-accent, 10%) !important;
            // }
        }

        // Стили для отмеченного состояния
        &.p-checkbox-checked {
            .p-checkbox-box {
                background: $color-accent !important;
                border-color: $color-accent !important;

                .p-checkbox-icon {
                    color: $color-light-text !important;
                    font-size: 14px;
                }
            }
        }
    }
}

.p-datepicker-panel {
    background: $color-base-white !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
    border: none !important;

    .p-datepicker-header {
        background: $color-accent !important;
        border-bottom: none;
        border-radius: 10px;
        padding: 2px;

        .p-datepicker-select-month,
        .p-datepicker-select-year {
            color: $color-light-text;
        }
    }

    .p-datepicker-weekdays,
    .p-datepicker-month,
    .p-datepicker-year {
        color: $color-base-text !important;
    }

    .p-datepicker-calendar td span {
        border-radius: 6px !important;

        &.p-highlight {
            background: $color-accent !important;
            color: $color-light-text !important;
        }
    }

    .p-datepicker-weekday,
    .p-datepicker-day {
        color: $color-base-text;
    }

    .p-datepicker-day:not(.p-datepicker-day-selected):not(.p-disabled):hover,
    .p-datepicker-month:not(.p-disabled):not(.p-datepicker-month-selected):hover,
    .p-datepicker-year:not(.p-disabled):not(.p-datepicker-year-selected):hover {
        color: $color-base-text !important;
        background-color: rgba(0, 0, 0, 0.1);
    }

    .p-button-text.p-button-secondary:not(:disabled):hover {
        background: transparent;
        color: $color-base-white;
    }

    .p-datepicker-today>.p-datepicker-day {
        background-color: transparent;
        border: 1px solid $color-accent;
        color: $color-base-text;
    }

    .p-datepicker-day-selected,
    .p-datepicker-month-selected,
    .p-datepicker-year-selected {
        background-color: $color-accent !important;
        color: $color-light-text !important;
    }

    .p-datepicker-day:focus-visible {
        outline-color: $color-accent !important;
    }

    .p-datepicker-select-month:enabled:hover,
    .p-datepicker-select-year:enabled:hover {
        background: transparent;
    }
}
</style>