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
            <p class="booking__house-title">{{ house.title }}</p>

            <form
                @submit.prevent="onFormSubmit"
                class="booking__form"
            >
                <div class="booking__date-container">
                    <label
                        class="booking__input-label"
                        for="startDate"
                    >Даты проживания</label>
                    <DatePicker
                        v-model="form.dates"
                        class="booking__date"
                        inputId="startDate"
                        fluid
                        showClear
                        showIcon
                        selectionMode="range"
                        :numberOfMonths="2"
                        :manualInput="false"
                        iconDisplay="input"
                        :minDate="new Date()"
                        :disabledDates="disableDate"
                    >
                        <template #date="slotProps">
                            <span
                                v-tooltip.top="getCheckoutHint(slotProps.date)"
                                :class="{ 'booking__date-booked': isDateBooked(slotProps.date) }"
                            >
                                {{ slotProps.date.day }}
                            </span>
                            <span class="booking__date-price">{{ priceOfDay(slotProps.date) }}₽</span>
                        </template>
                    </DatePicker>
                    <Message
                        v-if="errors.dates"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ errors.dates }}
                    </Message>
                </div>

                <div class="booking__username">
                    <label
                        class="booking__input-label"
                        for="username"
                    >Ваше имя</label>
                    <InputText
                        v-model="form.username"
                        class="booking__input"
                        inputId="username"
                        type="text"
                        placeholder="Имя"
                    />
                    <Message
                        v-if="errors.username"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ errors.username }}
                    </Message>
                </div>

                <div class="booking__phone">
                    <label
                        class="booking__input-label"
                        for="phone"
                    >Номер телефона</label>
                    <InputMask
                        v-model="form.phone"
                        class="booking__input"
                        inputId="phone"
                        mask="+7 (999) 999-9999"
                        placeholder="+7 (999) 999-9999"
                        fluid
                    />
                    <Message
                        v-if="errors.phone"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ errors.phone }}
                    </Message>
                </div>

                <div class="booking__people-amount-container">
                    <label
                        class="booking__input-label"
                        for="peopleAmount"
                    >Количество человек</label>
                    <InputNumber
                        v-model="form.peopleAmount"
                        inputClass="booking__input"
                        inputId="peopleAmount"
                        placeholder="0"
                        :min="1"
                        :max="house.maxGuests || 4"
                        fluid
                    />
                    <Message
                        v-if="errors.peopleAmount"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ errors.peopleAmount }}
                    </Message>
                </div>

                <div class="booking__wishes">
                    <label
                        class="booking__input-label"
                        for="wishes"
                    >Ваши пожелания</label>
                    <Textarea
                        v-model="form.wishes"
                        inputId="wishes"
                        rows="2"
                        cols="30"
                        style="resize: none"
                        fluid
                    />
                </div>

                <div class="booking__agreement">
                    <Checkbox
                        v-model="form.agreement"
                        class="my-checkbox"
                        inputId="agreement"
                        binary
                    />
                    <label
                        class="booking__input-label"
                        for="agreement"
                    >
                        Нажимая на кнопку, вы даете согласие на обработку персональных данных
                        и соглашаетесь c политикой конфиденциальности
                    </label>
                    <Message
                        v-if="errors.agreement"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ errors.agreement }}
                    </Message>
                </div>

                <Button
                    class="booking__submit"
                    type="submit"
                    severity="secondary"
                    label="Отправить"
                    :loading="isLoading"
                />
            </form>
        </div>
    </Dialog>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import Message from 'primevue/message';
import Dialog from 'primevue/dialog';
import DatePicker from 'primevue/datepicker';
import Textarea from 'primevue/textarea';

import { sendTelegramNotification } from '@services/telegram';
import { sendVkNotification } from '@services/vk';
import { db } from '@services/firebase';
import {
    query,
    where,
    getDocs,
    collection,
    onSnapshot,
    addDoc
} from 'firebase/firestore';

import { syncExternalCalendars, publishICS } from '@services/calendarSync'

const props = defineProps({
    house: { type: Object, required: true },
    isOpenDialog: { type: Boolean, required: true }
});

const emit = defineEmits(['close-dialog', 'success-submit']);

const form = reactive({
    dates: null,
    username: '',
    phone: '',
    peopleAmount: null,
    wishes: '',
    agreement: false
});

const isSubmitted = ref(false);
const allBookedDates = ref([]);      // Все занятые даты (дни проживания)
const disableDate = ref([]);         // Динамический массив для DatePicker
const isLoading = ref(false);
const serverError = ref('');
let unsubscribeFromBookings = null;

// ЦЕНА В ЗАВИСИМОСТИ ОТ ДНЯ НЕДЕЛИ
const priceOfDay = (date) => {
    const currentDate = new Date(date.year, date.month, date.day);

    // Проверяем особые периоды В первую очередь
    if (props.house?.pricing?.custom) {
        for (const period of props.house.pricing.custom) {
            const periodStart = new Date(period.startDate)
            const periodEnd = new Date(period.endDate)
            periodStart.setHours(0, 0, 0, 0)
            periodEnd.setHours(0, 0, 0, 0)

            if (currentDate >= periodStart && currentDate <= periodEnd) {
                return period.price
            }
        }
    }

    // Потом проверяем выходные
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) {
        return props.house.pricing.weekend;
    }

    return props.house.pricing.base;
};

// РАСЧЁТ СТОИМОСТИ
const calculateTotalPrice = (startDate, endDate) => {
    if (!props.house?.pricing) return 0

    let total = 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const current = new Date(start)

    while (current < end) {
        const dayOfWeek = current.getDay()
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6

        let price = isWeekend ? props.house.pricing.weekend : props.house.pricing.base

        if (props.house.pricing.custom) {
            for (const period of props.house.pricing.custom) {
                const periodStart = new Date(period.startDate)
                const periodEnd = new Date(period.endDate)
                periodStart.setHours(0, 0, 0, 0)
                periodEnd.setHours(0, 0, 0, 0)

                if (current >= periodStart && current <= periodEnd) {
                    price = period.price
                    break
                }
            }
        }

        total += price
        current.setDate(current.getDate() + 1)
    }

    return total
}

// ОБРАБОТКА ЗАНЯТЫХ ДАТ
const processBookedDates = (snapshot) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    const dates = [];

    const parseDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.startDate || !data.endDate) return;

        const startDate = parseDate(data.startDate);
        const endDate = parseDate(data.endDate);
        const startTime = startDate.getTime();
        const endTime = endDate.getTime();

        if (endTime < todayTime) return;

        const start = new Date(Math.max(startTime, todayTime));
        const currentDate = new Date(start);

        // Блокируем только дни проживания (день выезда не блокируем)
        const lastBookedDate = new Date(endDate);
        lastBookedDate.setDate(lastBookedDate.getDate() - 1);

        while (currentDate <= lastBookedDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
    });

    // Убираем дубликаты
    const uniqueDates = dates.filter((date, index) =>
        index === dates.findIndex(d => d.getTime() === date.getTime())
    );

    // Сохраняем все занятые даты
    allBookedDates.value = uniqueDates;

    // Обновляем disableDate в зависимости от выбранной даты заезда
    updateDisabledDates();

    return uniqueDates;
};

// ДИНАМИЧЕСКОЕ ОБНОВЛЕНИЕ DISABLED DATES
const updateDisabledDates = () => {
    // Если дата заезда НЕ выбрана — блокируем все занятые дни
    if (!form.dates || !form.dates[0]) {
        disableDate.value = [...allBookedDates.value];
        return;
    }

    const startDate = form.dates[0];
    const startTime = new Date(startDate).setHours(0, 0, 0, 0);

    // Если выбрана только дата заезда
    if (form.dates[0] && !form.dates[1]) {
        const disabled = [];

        // Находим занятые дни после даты заезда
        const bookedAfterStart = allBookedDates.value
            .filter(d => d.getTime() > startTime)
            .sort((a, b) => a.getTime() - b.getTime());

        allBookedDates.value.forEach(bookedDate => {
            const bookedTime = bookedDate.getTime();

            // Все даты до заезда блокируем
            if (bookedTime < startTime) {
                disabled.push(bookedDate);
                return;
            }

            // Если это не первый занятый день после заезда - блокируем
            // Первый занятый день после заезда = потенциальный день выезда (не блокируем)
            if (bookedAfterStart.length > 0 && bookedTime !== bookedAfterStart[0].getTime()) {
                disabled.push(bookedDate);
            }
        });

        disableDate.value = disabled;
        return;
    }

    // Если обе даты выбраны - не блокируем выбранные даты
    if (form.dates[0] && form.dates[1]) {
        const endDate = form.dates[1];
        const endTime = new Date(endDate).setHours(0, 0, 0, 0);

        const disabled = [];

        allBookedDates.value.forEach(bookedDate => {
            const bookedTime = bookedDate.getTime();

            // Не блокируем выбранные даты (заезд и выезд)
            if (bookedTime === startTime || bookedTime === endTime) {
                return;
            }

            disabled.push(bookedDate);
        });

        disableDate.value = disabled;
        return;
    }

    // По умолчанию - блокируем все занятые
    disableDate.value = [...allBookedDates.value];
};

// Следим за изменением form.dates
watch(() => form.dates, () => {
    updateDisabledDates();
}, { deep: true });

// WEBSOCKET ПОДПИСКА 
const startRealtimeListener = () => {
    if (!props.isOpenDialog) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString().split('T')[0];

    const q = query(
        collection(db, 'bookings'),
        where('houseId', '==', props.house.id),
        where('endDate', '>=', todayISO)
    );

    unsubscribeFromBookings = onSnapshot(q,
        (snapshot) => {
            processBookedDates(snapshot);
        },
        (error) => {
            setTimeout(() => {
                if (props.isOpenDialog) loadBookedDatesOnce();
            }, 3000);
        }
    );
};

const stopRealtimeListener = () => {
    if (unsubscribeFromBookings) {
        unsubscribeFromBookings();
        unsubscribeFromBookings = null;
    }
};

const loadBookedDatesOnce = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISO = today.toISOString().split('T')[0];

        const q = query(
            collection(db, 'bookings'),
            where('houseId', '==', props.house.id),
            where('endDate', '>=', todayISO)
        );

        const querySnapshot = await getDocs(q);
        processBookedDates(querySnapshot);
    } catch (error) {
        console.error(error);
    }
};

// ПРОВЕРКА ДОСТУПНОСТИ ДАТ
const checkDatesAvailability = async (startStr, endStr) => {

    const q = query(
        collection(db, 'bookings'),
        where('houseId', '==', props.house.id),
        where('endDate', '>', startStr),
        where('startDate', '<', endStr)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
        const data = doc.data();
    });

    return snapshot.empty;
};

// ПРОВЕРКА ЗАНЯТЫХ ДАТ В ДИАПАЗОНЕ
const hasBookedDatesInRange = (start, end) => {
    if (!start || !end) return false;

    const startTime = new Date(start).setHours(0, 0, 0, 0);
    const endTime = new Date(end).setHours(0, 0, 0, 0);

    return allBookedDates.value.some(bookedDate => {
        const bookedTime = bookedDate.getTime();
        return bookedTime > startTime && bookedTime < endTime;
    });
};

// СОЗДАНИЕ БРОНИ
const createBooking = async (startStr, endStr) => {
    const totalPrice = calculateTotalPrice(startStr, endStr)
    const nights = Math.ceil((new Date(endStr) - new Date(startStr)) / (1000 * 60 * 60 * 24))
    const bookingData = {
        houseId: props.house.id,
        houseTitle: props.house.title,
        startDate: startStr,
        endDate: endStr,
        username: form.username,
        phone: form.phone,
        peopleAmount: form.peopleAmount,
        wishes: form.wishes || '',
        totalPrice: totalPrice,
        nights: nights,
        createdAt: new Date().toLocaleString('ru-RU'),
    };
    const docRef = await addDoc(collection(db, 'bookings'), bookingData);
    return { id: docRef.id, ...bookingData };
};

// ВАЛИДАЦИЯ
const errors = computed(() => {
    const newErrors = {
        dates: serverError.value || '',
        username: '',
        phone: '',
        peopleAmount: '',
        agreement: ''
    };

    if (!isSubmitted.value) return newErrors;

    if (!form.dates?.[0]) newErrors.dates = newErrors.dates || 'Укажите дату заезда';
    if (!form.dates?.[1]) newErrors.dates = newErrors.dates || 'Укажите дату выезда';
    if (!form.username?.trim()) newErrors.username = 'Укажите имя';
    if (!form.phone) newErrors.phone = 'Укажите номер телефона';
    else if (form.phone.includes('_')) newErrors.phone = 'Введите полный номер телефона';
    if (!form.peopleAmount || form.peopleAmount < 1) newErrors.peopleAmount = 'Укажите количество человек';
    if (!form.agreement) newErrors.agreement = 'Необходимо дать согласие';

    return newErrors;
});

const isValid = computed(() => !Object.values(errors.value).some(error => error !== ''));

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
const formatLocalDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const isDateBooked = (date) => {
    if (!disableDate.value.length) return false;

    const currentDate = new Date(date.year, date.month, date.day);
    currentDate.setHours(0, 0, 0, 0);

    return disableDate.value.some(disabledDate => {
        const disabled = new Date(disabledDate);
        disabled.setHours(0, 0, 0, 0);
        return disabled.getTime() === currentDate.getTime();
    });
};

const resetForm = () => {
    form.dates = null;
    form.username = '';
    form.phone = '';
    form.peopleAmount = null;
    form.wishes = '';
    form.agreement = false;
    isSubmitted.value = false;
    serverError.value = '';
};

const publishGistICS = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]

    const q = query(
        collection(db, 'bookings'),
        where('endDate', '>=', todayStr)
    )
    const snapshot = await getDocs(q)
    const activeBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    publishICS(activeBookings, props.house.id, props.house.gistId)
}

const createMessageForChat = (startDate, endDate) => {
    const startStr = formatLocalDate(startDate);
    const endStr = formatLocalDate(endDate);
    const nightsCount = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const message = `
❗❗❗ <b>НОВОЕ БРОНИРОВАНИЕ</b>

🏡 <b>ДОМ</b>
• ${props.house.title}

📅 <b>ДАТЫ</b>
• Заезд: ${startStr}
• Выезд: ${endStr}
• Ночей: ${nightsCount}

👥 <b>ГОСТИ</b>
• Количество: ${form.peopleAmount}

👤 <b>КОНТАКТЫ</b>
• Имя: ${form.username}
• Телефон: ${form.phone}
• Пожелания: ${form.wishes || 'Нет'}
`;

    return message
}

const onClose = () => emit('close-dialog');

// ОТПРАВКА ФОРМЫ
const onFormSubmit = async () => {
    isSubmitted.value = true;
    serverError.value = '';

    if (!isValid.value) return;

    try {
        isLoading.value = true;

        const [startDate, endDate] = form.dates;
        const startStr = formatLocalDate(startDate);
        const endStr = formatLocalDate(endDate);

        // Проверяем, нет ли занятых дат в диапазоне
        if (hasBookedDatesInRange(startDate, endDate)) {
            serverError.value = 'В выбранном диапазоне есть занятые даты. Выберите другие даты.';
            isLoading.value = false;
            return;
        }

        // Проверка доступности через Firestore
        const isAvailable = await checkDatesAvailability(startStr, endStr);

        if (!isAvailable) {
            serverError.value = 'К сожалению, эти даты только что забронировали. Выберите другие даты.';
            isLoading.value = false;
            return;
        }

        // Создание брони
        await createBooking(startStr, endStr);

        // Добавление данных о забронированных датах в файл ICS, который развернут на GitHub Gist
        publishGistICS()

        const message = createMessageForChat(startDate, endDate)

        // Отправка уведомления в Telegram
        // sendTelegramNotification(message);

        sendVkNotification(message)

        emit('success-submit', true);
        onClose();

    } catch (error) {
        console.error('Ошибка в onFormSubmit:', error)
        serverError.value = 'Произошла ошибка при бронировании. Попробуйте еще раз.';
    } finally {
        isLoading.value = false;
    }
};

onMounted(async () => {
    if (props.isOpenDialog) {
        // Сначала запускаем вебсокет на получение данных из firebase
        // после того как получили данные, Проверяем есть ли ссылки на внешние календари
        // если есть то выполняем запрос на получение этих календарей.
        startRealtimeListener();
        const icsUrls = props.house.icsUrls || null
        if (icsUrls) {
            syncExternalCalendars(
                props.house.id,
                props.house.title,
                icsUrls,
                props.house.pricing
            ).catch(e => {
                console.error('Ошибка фоновой синхронизации:', e)
            })
        }
    }
});

onBeforeUnmount(() => {
    stopRealtimeListener();
    resetForm();
});

const getCheckoutHint = (date) => {
    const currentDate = new Date(date.year, date.month, date.day);
    currentDate.setHours(0, 0, 0, 0);
    const currentTime = currentDate.getTime();

    // Занята ли дата?
    const isOccupied = allBookedDates.value.some(d => d.getTime() === currentTime);

    // Заблокирована ли дата?
    const isDisabled = disableDate.value.some(d => new Date(d).setHours(0, 0, 0, 0) === currentTime);

    // Показываем тултип только если дата занята, но не заблокирована
    return isOccupied && !isDisabled ? 'Только для выезда' : '';
};
</script>

<style lang="scss">
.booking {
    background-color: $color-base-white !important;
    color: $color-base-text !important;
    @include spectral-regular;
    font-size: 18px;
    width: 50%;
    max-width: 800px;

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

    &__date-container {
        grid-column: 1 / 3;
    }

    &__date {
        position: relative;
        height: 40px;

        .p-datepicker {
            width: 100%;
        }
    }

    &__wishes {
        grid-column: 1 / 3;
    }

    &__date-booked {
        text-decoration: line-through;
    }
}

@media (max-width: $vp-1024) {
    .booking {
        width: 70%;

        .p-dialog-title {
            font-size: 24px;
        }

        &__house-title {
            font-size: 22px;
        }

        &__form {
            gap: 16px 24px;
        }
    }
}

@media (max-width: $vp-768) {
    .booking {
        width: 95% !important;
        margin: 16px;

        .p-dialog-content {
            padding: 16px !important;
        }

        .p-dialog-title {
            font-size: 20px;
        }

        &__house-title {
            font-size: 18px;
            margin-bottom: 18px;
        }

        &__form {
            grid-template-columns: 1fr;
            gap: 14px;
        }

        &__username,
        &__phone,
        &__people-amount-container,
        &__agreement,
        &__date-container,
        &__wishes,
        &__submit {
            grid-column: 1;
        }

        &__input-label {
            font-size: 14px;
            display: block;
            margin-bottom: 4px;
        }

        &__agreement {
            font-size: 12px;
            display: grid;
            grid-template-columns: min-content 1fr;

            .p-message {
                grid-column: 1 / 3;
            }

            .p-checkbox {
                margin-right: 10px;
            }

            label {
                font-size: 12px;
            }
        }

        &__date {
            .p-datepicker {
                width: 100%;
                min-width: auto;

                table {
                    font-size: 12px;
                }
            }
        }

        &__date-price {
            font-size: 10px;
        }
    }
}
</style>