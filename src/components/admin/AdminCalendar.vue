<template>
    <div class="admin-bookings">
        <div class="admin-bookings__container">
            <div class="admin-bookings__header">
                <h2>Бронирования</h2>
                <div class="admin-bookings__controls">
                    <!-- Переключатель вида -->
                    <SelectButton
                        v-model="viewMode"
                        :options="viewOptions"
                        optionLabel="label"
                        optionValue="value"
                    />
                    <!-- Фильтр по дому -->
                    <Select
                        v-model="selectedHouse"
                        :options="houseOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Все дома"
                        class="admin-bookings__house-filter"
                    />
                    <!-- Фильтр по источнику брони -->
                    <Select
                        v-model="selectedSource"
                        :options="sourceOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Все брони"
                        class="admin-bookings__source-filter"
                    />
                    <!-- Месяц -->
                    <div class="admin-bookings__month-nav">
                        <Button
                            icon="pi pi-chevron-left"
                            rounded
                            outlined
                            size="small"
                            @click="prevMonth"
                        />
                        <span>{{ monthLabel }}</span>
                        <Button
                            icon="pi pi-chevron-right"
                            rounded
                            outlined
                            size="small"
                            @click="nextMonth"
                        />
                    </div>
                </div>
            </div>

            <!-- Календарь -->
            <div
                v-if="viewMode === 'calendar'"
                class="admin-bookings__calendar-grid"
            >
                <div
                    v-for="day in weekDays"
                    :key="day"
                    class="admin-bookings__calendar-weekday"
                >{{ day }}</div>
                <div
                    v-for="(day, index) in calendarDays"
                    :key="index"
                    class="admin-bookings__calendar-day"
                    :class="{
                        'admin-bookings__other-month': !day.isCurrentMonth,
                        'admin-bookings__today': day.isToday,
                        'admin-bookings__booked': day.isBooked
                    }"
                >
                    <span class="admin-bookings__day-number">{{ day.date }}</span>
                    <div
                        v-if="day.bookings.length"
                        class="admin-bookings__day-chips"
                    >
                        <div
                            v-for="b in day.bookings"
                            :key="b.id"
                            class="admin-bookings__chip"
                            :class="{ 'admin-bookings__chip--external': b.source === 'avito' || b.source === 'yandex' }"
                            :style="{ background: getColor(b.houseId) }"
                            v-tooltip.top="getTooltip(b)"
                            @click="confirmDelete(b)"
                        >
                            {{ b.houseTitle?.charAt(5) }}
                        </div>
                    </div>
                </div>
                <div class="admin-bookings__calendar-legend">
                    <div
                        v-for="house in houses"
                        :key="house.id"
                        class="admin-bookings__legend-item"
                    >
                        <span
                            class="admin-bookings__legend-color"
                            :style="{ background: getColor(house.id) }"
                        ></span>
                        <span>{{ house.title }}</span>
                    </div>
                    <div class="admin-bookings__legend-item">
                        <span
                            class="admin-bookings__legend-color"
                            style="background: #e0e0e0"
                        ></span>
                        <span>Свободно</span>
                    </div>
                    <div class="admin-bookings__legend-item">
                        <span
                            class="admin-bookings__legend-color"
                            style="border: 3px solid #5c623f"
                        ></span>
                        <span>Внешние брони</span>
                    </div>
                </div>
            </div>

            <!-- Таблица -->
            <DataTable
                v-else
                :value="filteredBookings"
                :paginator="true"
                :rows="10"
                sortField="startDate"
                :sortOrder="1"
                stripedRows
                class="admin-bookings__bookings-table"
            >
                <Column
                    field="houseTitle"
                    header="Дом"
                    sortable
                />
                <Column
                    field="startDate"
                    header="Заезд"
                    sortable
                />
                <Column
                    field="endDate"
                    header="Выезд"
                    sortable
                />
                <Column
                    field="nights"
                    header="Ночей"
                    sortable
                />
                <Column
                    field="username"
                    header="Гость"
                    sortable
                />
                <Column
                    field="phone"
                    header="Телефон"
                />
                <Column
                    field="totalPrice"
                    header="Сумма"
                    sortable
                >
                    <template #body="{ data }">
                        {{ data.totalPrice?.toLocaleString() }}₽
                    </template>
                </Column>

                <Column>
                    <template #body="{ data }">
                        <Button
                            icon="pi pi-trash"
                            severity="danger"
                            rounded
                            size="small"
                            @click="confirmDelete(data)"
                        />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import Select from 'primevue/select'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@services/firebase'

import { publishICS } from '@services/calendarSync'

const confirm = useConfirm()
const toast = useToast()

const emit = defineEmits(['booking-deleted'])

const props = defineProps({
    houses: { type: Array, default: () => [] },
})

const viewMode = ref('calendar')
const selectedHouse = ref(null)
const currentDate = ref(new Date())
const monthBookingsData = ref([])

const viewOptions = [
    { label: 'Календарь', value: 'calendar' },
    { label: 'Таблица', value: 'table' }
]

const houseOptions = computed(() => [
    { label: 'Все дома', value: null },
    ...props.houses.map(h => ({ label: h.title, value: h.id }))
])

const selectedSource = ref(null)

const sourceOptions = [
    { label: 'Все брони', value: null },
    { label: 'Сайт', value: 'site' },
    { label: 'Авито', value: 'avito' },
    { label: 'Яндекс.Путешествия', value: 'yandex' }
]

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const colors = ['#5c623f', '#e74c3c', '#2ecc71', '#f39c12']
const getColor = (id) => colors[props.houses.findIndex(h => h.id === id) % colors.length]

const loadMonthBookings = async () => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const start = new Date(year, month, 1).toISOString().split('T')[0]
    const end = new Date(year, month + 1, 0).toISOString().split('T')[0]

    const snapshot = await getDocs(query(
        collection(db, 'bookings'),
        where('startDate', '<=', end),
        where('endDate', '>=', start)
    ))

    monthBookingsData.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const monthLabel = computed(() =>
    currentDate.value.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
)

// Календарь
const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    let startDay = firstDay.getDay() - 1
    if (startDay < 0) startDay = 6

    const days = []
    const today = new Date()

    for (let i = startDay - 1; i >= 0; i--) {
        days.push(makeDay(new Date(year, month, -i), false, today))
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(makeDay(new Date(year, month, i), true, today))
    }
    while (days.length < 42) {
        const i = days.length - lastDay.getDate() - startDay + 1
        days.push(makeDay(new Date(year, month + 1, i), false, today))
    }

    return days
})

const makeDay = (date, isCurrentMonth, today) => {
    const dateStr = format(date)
    const dayBookings = monthBookingsData.value.filter(b =>
        b.startDate <= dateStr && b.endDate > dateStr
    )
    // Сортировка по порядку домов в массиве houses
    dayBookings.sort((a, b) => {
        const indexA = props.houses.findIndex(h => h.id === a.houseId)
        const indexB = props.houses.findIndex(h => h.id === b.houseId)
        return indexA - indexB
    })
    return {
        date: date.getDate(),
        isCurrentMonth,
        isToday: date.toDateString() === today.toDateString(),
        isBooked: dayBookings.length > 0,
        bookings: dayBookings
    }
}

// Таблица
const filteredBookings = computed(() => {
    let result = monthBookingsData.value

    if (selectedHouse.value) {
        result = result.filter(b => b.houseId === selectedHouse.value)
    }

    if (selectedSource.value === 'site') {
        result = result.filter(b => !b.source || b.source === 'site')
    } else if (selectedSource.value) {
        result = result.filter(b => b.source === selectedSource.value)
    }

    const start = format(new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1))
    const end = format(new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0))

    result = result.filter(b => b.startDate <= end && b.endDate >= start)

    return result
})

const format = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const getTooltip = (b) => `${b.houseTitle}\n${b.startDate} → ${b.endDate}\n${b.username}`
const prevMonth = () => { const d = new Date(currentDate.value); d.setMonth(d.getMonth() - 1); currentDate.value = d }
const nextMonth = () => { const d = new Date(currentDate.value); d.setMonth(d.getMonth() + 1); currentDate.value = d }

const confirmDelete = (booking) => {
    confirm.require({
        message: `Удалить бронь "${booking.houseTitle}"?\n${booking.startDate} -> ${booking.endDate}\nГость: ${booking.username}`,
        header: 'Удаление брони',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: { label: 'Отмена', severity: 'secondary', outlined: true },
        acceptProps: { label: 'Удалить', severity: 'danger' },
        accept: async () => {
            try {
                const isMyBooking = !booking.source
                await deleteDoc(doc(db, 'bookings', booking.id))

                if (isMyBooking) {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    const todayStr = today.toISOString().split('T')[0]
                    const updatedBookings = monthBookingsData.value.filter(b => b.id !== booking.id)
                    const activeBookings = updatedBookings.filter(b => !b.source && b.endDate >= todayStr)
                    const house = props.houses.find(h => h.id === booking.houseId)
                    if (house?.gistId) {
                        await publishICS(activeBookings, house.id, house.gistId)
                    }
                }

                emit('booking-deleted', booking.id)
                monthBookingsData.value = monthBookingsData.value.filter(b => b.id !== booking.id)
                toast.add({ severity: 'success', summary: 'Удалено', detail: 'Бронь удалена', life: 3000 })
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить', life: 3000 })
            }
        }
    })
}

watch(currentDate, async () => {
    await loadMonthBookings()
}, { deep: true })

onMounted(async () => {
    await loadMonthBookings()
})
</script>

<style
    lang="scss"
    scoped
>
.admin-bookings {
    background: #f3f3ee;
    border-radius: 20px;

    &__container {
        padding: 30px 50px;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 20px;

        h2 {
            margin-bottom: 8px;
            color: $color-base-text;
            font-size: 28px;
        }
    }

    &__controls {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
    }

    &__house-filter {
        width: 200px;
    }

    &__source-filter {
        width: 200px;
    }

    &__month-nav {
        display: flex;
        align-items: center;
        gap: 8px;

        span {
            padding: 0 10px;
            text-align: center;
            font-weight: 500;
            font-size: 18px !important;
        }
    }

    &__calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
        overflow-x: auto;
    }

    &__calendar-weekday {
        text-align: center;
        font-weight: 600;
        font-size: 13px;
        color: #888;
        padding: 8px 0;
    }

    &__calendar-day {
        min-height: 80px;
        padding: 6px;
        border-radius: 6px;
        background: $color-base-white;
        position: relative;
    }

    &__other-month {
        opacity: 0.4;
    }

    &__today {
        box-shadow: inset 0 0 0 2px $color-accent;
    }

    &__booked {
        background: #dbddd7;
    }

    &__day-number {
        font-size: 14px;
        font-weight: 500;
    }

    &__day-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 3px;
        margin-top: 4px;
    }

    &__chip {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;

        &:hover {
            transform: scale(1.2);
        }
    }

    &__bookings-table {
        margin-top: 12px;
        overflow-x: auto;
    }

    &__calendar-legend {
        grid-column: 1 / -1;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid #eee;
    }

    &__legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: #666;
    }

    &__legend-color {
        width: 14px;
        height: 14px;
        border-radius: 50%;
    }

    &__chip--external {
        box-shadow: 0 0 0 2px #fff, 0 0 0 4px $color-accent;
    }
}

@media (max-width: $vp-1024) {
    .admin-bookings {
        &__container {
            padding: 20px 30px;
        }

        h2 {
            font-size: 24px;
        }

        &__controls {
            gap: 10px;
        }

        &__house-filter,
        &__source-filter {
            width: 180px;
        }

        &__calendar-day {
            min-height: 70px;
            padding: 4px;
        }

        &__day-number {
            font-size: 12px;
        }

        &__chip {
            width: 22px;
            height: 22px;
            font-size: 11px;
        }

        &__month-nav span {
            font-size: 16px !important;
        }
    }
}

@media (max-width: $vp-768) {
    .admin-bookings {
        border-radius: 16px;

        &__container {
            padding: 16px;
        }

        h2 {
            font-size: 20px;
            margin-bottom: 4px;
        }

        &__header {
            flex-direction: column;
            align-items: stretch;
        }

        &__controls {
            flex-direction: column;
            align-items: stretch;
        }

        &__house-filter,
        &__source-filter {
            width: 100%;
        }

        &__month-nav {
            justify-content: center;

            span {
                font-size: 14px !important;
                padding: 0 6px;
            }
        }

        &__calendar-grid {
            gap: 1px;
        }

        &__calendar-weekday {
            font-size: 11px;
            padding: 6px 0;
        }

        &__calendar-day {
            min-height: 55px;
            padding: 3px;
        }

        &__day-number {
            font-size: 10px;
        }

        &__day-chips {
            gap: 2px;
            margin-top: 2px;
        }

        &__chip {
            width: 16px;
            height: 16px;
            font-size: 8px;
        }

        &__calendar-legend {
            gap: 12px;
            margin-top: 12px;
            justify-content: center;
        }

        &__legend-item {
            font-size: 11px;
        }

        &__legend-color {
            width: 12px;
            height: 12px;
        }

        .p-datatable {
            font-size: 12px;
        }
    }
}
</style>