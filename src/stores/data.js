import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@services/firebase'

export const useDataStore = defineStore('data', () => {
    // cостояние
    const houses = ref([])
    const bookings = ref([])
    const housesLoaded = ref(false)
    const bookingsLoaded = ref(false)
    const loading = ref(false)

    // дома
    const loadHouses = async () => {
        if (housesLoaded.value) return

        try {
            loading.value = true
            const snapshot = await getDocs(collection(db, 'houses'))
            houses.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            housesLoaded.value = true
        } catch (error) {
            console.error('Ошибка загрузки домов:', error)
        } finally {
            loading.value = false
        }
    }

    const getHouseBySlug = (slug) => houses.value.find(h => h.slug === slug)
    const getHouseById = (id) => houses.value.find(h => h.id === id)
    const getOtherHouse = (currentSlug) => houses.value.find(h => h.slug !== currentSlug)

    // брони
    const loadBookings = async () => {
        if (bookingsLoaded.value) return

        try {
            loading.value = true
            const snapshot = await getDocs(collection(db, 'bookings'))
            bookings.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            bookingsLoaded.value = true
        } catch (error) {
            console.error('Ошибка загрузки броней:', error)
        } finally {
            loading.value = false
        }
    }

    const getBookingsByHouse = (houseId) => bookings.value.filter(b => b.houseId === houseId)

    const getBookingsByMonth = (year, month) => {
        const start = new Date(year, month, 1).toISOString().split('T')[0]
        const end = new Date(year, month + 1, 0).toISOString().split('T')[0]
        return bookings.value.filter(b => b.startDate <= end && b.endDate >= start)
    }

    const getBookingsByYear = (year) => {
        const start = `${year}-01-01`
        const end = `${year}-12-31`
        return bookings.value.filter(b => b.startDate <= end && b.endDate >= start)
    }

    const reset = () => {
        houses.value = []
        bookings.value = []
        housesLoaded.value = false
        bookingsLoaded.value = false
    }

    return {
        houses,
        bookings,
        loading,
        housesLoaded,
        bookingsLoaded,
        loadHouses,
        loadBookings,
        getHouseBySlug,
        getHouseById,
        getOtherHouse,
        getBookingsByHouse,
        getBookingsByMonth,
        getBookingsByYear,
        reset
    }
})