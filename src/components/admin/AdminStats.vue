<template>
    <div class="admin-stats">
        <div class="admin-stats__container">
            <div class="admin-stats__header">
                <h2>Статистика</h2>
                <div class="admin-stats__month-selector">
                    <Button
                        icon="pi pi-chevron-left"
                        rounded
                        outlined
                        size="small"
                        @click="prevMonth"
                    />
                    <span class="admin-stats__current-month">{{ monthLabel }}</span>
                    <Button
                        icon="pi pi-chevron-right"
                        rounded
                        outlined
                        size="small"
                        @click="nextMonth"
                        :disabled="isCurrentMonth"
                    />
                </div>
            </div>



            <!-- Загрузка -->
            <div
                v-if="!houses.length && !monthBookingsData.length"
                class="admin-stats__loading"
            >
                <p>Нет данных для отображения</p>
            </div>

            <template v-else>
                <!-- Карточки -->
                <div class="admin-stats__grid">
                    <div class="admin-stats__card">
                        <span class="admin-stats__value">{{ stats.totalBookings }}</span>
                        <span class="admin-stats__label">Броней за месяц</span>
                    </div>
                    <div class="admin-stats__card">
                        <span class="admin-stats__value">{{ stats.monthRevenue.toLocaleString() }}₽</span>
                        <span class="stat-label">Выручка за месяц</span>
                    </div>
                    <div class="admin-stats__card">
                        <span class="admin-stats__value">{{ stats.yearRevenue.toLocaleString() }}₽</span>
                        <span class="admin-stats__label">Выручка за год</span>
                    </div>
                </div>

                <!-- Загрузка домов -->
                <div
                    v-if="stats.houses.length"
                    class="admin-stats__section"
                >
                    <h3>Загрузка домов</h3>
                    <div class="admin-stats__houses-grid">
                        <div
                            v-for="house in stats.houses"
                            :key="house.title"
                            class="admin-stats__house-card"
                        >
                            <div class="admin-stats__house-header">
                                <span class="admin-stats__house-name">{{ house.title }}</span>
                                <span class="admin-stats__house-revenue">{{ house.revenue.toLocaleString() }}₽</span>
                            </div>

                            <div class="admin-stats__occupancy">
                                <div class="admin-stats__occupancy-bar">
                                    <div
                                        class="admin-stats__fill"
                                        :style="{ width: house.occupancy + '%' }"
                                    ></div>
                                </div>
                                <span class="admin-stats__occupancy-text">{{ house.occupancy }}%</span>
                            </div>

                            <div class="admin-stats__details">
                                <span>{{ house.bookings }} броней</span>
                                <span>{{ house.nights }} ночей</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-if="!stats.totalBookings"
                    class="admin-stats__stats-empty"
                >
                    <p>Нет броней за выбранный месяц</p>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@services/firebase'
import { ref, computed, toRefs, watch, onMounted } from 'vue'
import Button from 'primevue/button'

const props = defineProps({
    houses: { type: Array, default: () => [] },
})

const { houses } = toRefs(props)

const monthBookingsData = ref([])
const yearRevenue = ref(0)

// Месяц по умолчанию - текущий
const selectedMonth = ref(new Date().getMonth())
const selectedYear = ref(new Date().getFullYear())

// Текущий месяц
const isCurrentMonth = computed(() => {
    const now = new Date()
    return selectedMonth.value === now.getMonth() && selectedYear.value === now.getFullYear()
})

// Название месяца
const monthLabel = computed(() => {
    const date = new Date(selectedYear.value, selectedMonth.value, 1)
    return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
})

// Навигация
const prevMonth = () => {
    if (selectedMonth.value === 0) {
        selectedMonth.value = 11
        selectedYear.value--
    } else {
        selectedMonth.value--
    }
}

const nextMonth = () => {
    if (selectedMonth.value === 11) {
        selectedMonth.value = 0
        selectedYear.value++
    } else {
        selectedMonth.value++
    }
}

const resetTime = (date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}


const loadYearRevenue = async () => {
    const year = selectedYear.value
    const snapshot = await getDocs(query(
        collection(db, 'bookings'),
        where('startDate', '<=', `${year}-12-31`),
        where('endDate', '>=', `${year}-01-01`)
    ))

    const yearBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    yearRevenue.value = yearBookings
        .filter(b => b.startDate >= `${year}-01-01` && b.startDate <= `${year}-12-31`)
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
}

const loadMonthBookings = async () => {
    const start = new Date(selectedYear.value, selectedMonth.value, 1).toISOString().split('T')[0]
    const end = new Date(selectedYear.value, selectedMonth.value + 1, 0).toISOString().split('T')[0]

    const snapshot = await getDocs(query(
        collection(db, 'bookings'),
        where('startDate', '<=', end),
        where('endDate', '>=', start)
    ))

    monthBookingsData.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// Вся статистика
const stats = computed(() => {
    const monthBookings = monthBookingsData.value

    const monthStart = resetTime(new Date(selectedYear.value, selectedMonth.value, 1))
    const monthEnd = resetTime(new Date(selectedYear.value, selectedMonth.value + 1, 0))
    const monthStartStr = formatDate(monthStart)
    const monthEndStr = formatDate(monthEnd)
    const daysInMonth = monthEnd.getDate()

    const monthRevenue = monthBookings
        .filter(b => b.startDate >= monthStartStr && b.startDate <= monthEndStr)
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0)

    const housesStats = houses.value.map(house => {
        const houseBookings = monthBookings.filter(b => b.houseId === house.id)
        const totalNights = houseBookings.reduce((sum, b) => sum + (b.nights || 0), 0)
        const totalRevenuePerHouse = houseBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
        const occupancy = Math.round((totalNights / daysInMonth) * 100)

        return {
            title: house.title,
            bookings: houseBookings.length,
            nights: totalNights,
            occupancy,
            revenue: totalRevenuePerHouse
        }
    }).sort((a, b) => b.revenue - a.revenue)

    return {
        totalBookings: monthBookings.length,
        monthRevenue,
        yearRevenue: yearRevenue.value,
        houses: housesStats
    }
})

// Форматирование даты
const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

watch([selectedMonth, selectedYear], () => {
    loadMonthBookings()
})

onMounted(async () => {
    await loadMonthBookings()
    await loadYearRevenue()
})
</script>

<style
    lang="scss"
    scoped
>
.admin-stats {
    background: #f3f3ee;
    border-radius: 20px;

    &__container {
        padding: 30px 50px;
        margin-bottom: 40px;
    }

    h2 {
        margin-bottom: 8px;
        color: $color-base-text;
        font-size: 28px;
    }

    h3 {
        margin: 24px 0 16px;
        font-size: 18px;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
    }

    &__month-selector {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    &__current-month {
        padding: 0 10px;
        font-size: 18px;
        font-weight: 500;
        text-align: center;
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin: 20px 0;
    }

    &__card {
        background: white;
        padding: 24px;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    &__value {
        display: block;
        font-size: 30px;
        font-weight: 700;
        color: $color-accent;
    }

    &__label {
        font-size: 14px;
        color: #888;
        margin-top: 4px;
    }

    &__houses-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }

    &__house-card {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    &__house-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        flex-wrap: wrap;
        gap: 8px;
    }

    &__house-name {
        font-weight: 600;
    }

    &__house-revenue {
        color: $color-accent;
        font-weight: 600;
    }

    &__occupancy {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
    }

    &__occupancy-bar {
        flex: 1;
        height: 8px;
        background: #eee;
        border-radius: 4px;
        overflow: hidden;
    }

    &__fill {
        height: 100%;
        background: $color-accent;
        border-radius: 4px;
        transition: width 0.3s;
    }

    &__occupancy-text {
        font-weight: 600;
        font-size: 14px;
        min-width: 40px;
        text-align: right;
    }

    &__details {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 13px;
        color: #888;
    }

    &__loading,
    &__stats-empty {
        text-align: center;
        padding: 40px;
        color: #999;
        font-size: 16px;
    }
}

@media (max-width: $vp-1024) {
    .admin-stats {
        &__container {
            padding: 20px 30px;
            margin-bottom: 30px;
        }

        h2 {
            font-size: 24px;
        }

        &__grid {
            gap: 16px;
        }

        &__card {
            padding: 20px;
        }

        &__value {
            font-size: 26px;
        }

        &__houses-grid {
            gap: 12px;
        }

        &__house-card {
            padding: 16px;
        }
    }
}

@media (max-width: $vp-768) {
    .admin-stats {
        border-radius: 16px;

        &__container {
            padding: 16px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 20px;
            margin-bottom: 4px;
        }

        h3 {
            margin: 20px 0 12px;
            font-size: 16px;
        }

        &__header {
            flex-direction: column;
            align-items: stretch;
        }

        &__month-selector {
            justify-content: center;
        }

        &__current-month {
            font-size: 16px;
        }

        &__grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin: 16px 0;
        }

        &__card {
            padding: 16px;
        }

        &__value {
            font-size: 24px;
        }

        &__label {
            font-size: 14px;
        }

        &__houses-grid {
            grid-template-columns: 1fr;
            gap: 12px;
        }

        &__house-card {
            padding: 14px;
        }

        &__house-header {
            font-size: 14px;
        }

        &__house-name {
            font-size: 14px;
        }

        &__house-revenue {
            font-size: 14px;
        }

        &__occupancy-text {
            font-size: 12px;
            min-width: 35px;
        }

        &__details {
            font-size: 11px;
        }

        &__loading,
        &__stats-empty {
            padding: 30px;
            font-size: 14px;
        }
    }
}
</style>