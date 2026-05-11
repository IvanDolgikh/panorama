import { fetchExternalBookings, generateICS } from './icalendar'
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore'
import { db } from './firebase'

// Расчет стоимости внешней брони по ценам дома
const calculateExternalPrice = (startStr, endStr, pricing) => {
    if (!pricing) return 0

    let total = 0
    const start = new Date(startStr)
    const end = new Date(endStr)
    const current = new Date(start)

    while (current < end) {
        const dayOfWeek = current.getDay()
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6

        let price = isWeekend ? pricing.weekend : pricing.base

        if (pricing.custom) {
            for (const period of pricing.custom) {
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

const importExternalBookings = async (events, source, houseId, houseTitle, housePricing) => {
    const bookingsRef = collection(db, 'bookings')

    for (const event of events) {
        const q = query(
            bookingsRef,
            where('startDate', '==', event.startDate),
            where('source', '==', source),
            where('houseId', '==', houseId)
        )
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
            const nights = Math.ceil(
                (new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60 * 24)
            )
            const totalPrice = calculateExternalPrice(event.startDate, event.endDate, housePricing)

            await addDoc(bookingsRef, {
                startDate: event.startDate,
                endDate: event.endDate,
                houseId: houseId,
                houseTitle: houseTitle,
                source: source,
                totalPrice: totalPrice,
                nights: nights,
                username: `Бронь с ${source}`,
                phone: '',
                peopleAmount: 0,
                wishes: '',
                createdAt: new Date().toISOString()
            })
        }
    }
    // console.log(`Импортировано из ${source}: ${events.length} броней`)
}

export const syncExternalCalendars = async (houseId, houseTitle, icsUrls, housePricing) => {
    if (!icsUrls) {
        // console.log('Нет ссылок ICS для этого дома')
        return
    }

    // console.log('Синхронизация с внешними площадками')

    if (icsUrls.avito) {
        try {
            const avitoEvents = await fetchExternalBookings(icsUrls.avito)
            if (avitoEvents.length > 0) {
                await importExternalBookings(avitoEvents, 'avito', houseId, houseTitle, housePricing)
            }
        } catch (e) {
            console.error('Ошибка синхронизации с Авито:', e)
        }
    }

    if (icsUrls.yandex) {
        try {
            const yandexEvents = await fetchExternalBookings(icsUrls.yandex)
            if (yandexEvents.length > 0) {
                await importExternalBookings(yandexEvents, 'yandex', houseId, houseTitle, housePricing)
            }
        } catch (e) {
            console.error('Ошибка синхронизации с Яндексом:', e)
        }
    }

    console.log('✅ Синхронизация завершена')
}

// Публикация ICS на GitHub Gist (постоянный URL)
export const publishICS = async (bookings, houseId, gistId) => {
    if (!gistId?.id) return

    // Только брони с сайта, без внешних
    const activeBookings = bookings.filter(b =>
        b.houseId === houseId && !b.source
    )
    const icsContent = generateICS(activeBookings)

    try {
        await fetch(`https://api.github.com/gists/${gistId.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${import.meta.env.VITE_GITHUB_GIST_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                files: {
                    [gistId.filename]: { content: icsContent }
                }
            })
        })
    } catch (error) {
        console.error('Ошибка публикации ICS:', error)
    }
}

export const createGist = async (houseTitle, slug) => {
    try {
        const response = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers: {
                'Authorization': `token ${import.meta.env.VITE_GITHUB_GIST_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description: `Calendar for ${houseTitle}`,
                public: true,
                files: {
                    [`${slug}.ics`]: {
                        content: 'BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR'
                    }
                }
            })
        })
        const data = await response.json()
        return { id: data.id, filename: `${slug}.ics` }
    } catch (e) {
        console.error('Ошибка создания Gist:', e)
        return null
    }
}