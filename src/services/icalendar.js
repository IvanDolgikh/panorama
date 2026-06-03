// services/icalendar.js

/**
 * Генерация ICS-файла из бронирований
 */
export const generateICS = (bookings) => {
    const events = bookings.map(b => {
        const start = formatICSDate(b.startDate)
        const end = formatICSDate(b.endDate)
        return `BEGIN:VEVENT
DTSTART;VALUE=DATE:${start}
DTEND;VALUE=DATE:${end}
SUMMARY:${b.houseTitle || 'Занято'}
UID:${b.id}
END:VEVENT`
    }).join('\n')

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Panorama Houses//Booking Calendar//RU
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Бронирования домов
${events}
END:VCALENDAR`
}

export const parseExternalICS = (text) => {
    const events = []
    const lines = text.split('\n')
    let current = {}

    for (const line of lines) {
        if (line.startsWith('BEGIN:VEVENT')) {
            current = {}
        } else if (line.startsWith('END:VEVENT')) {
            if (current.start && current.end) {
                events.push({
                    startDate: parseICSDate(current.start),
                    endDate: parseICSDate(current.end)
                })
            }
        } else if (line.startsWith('DTSTART')) {
            const parts = line.split(':')
            current.start = parts[parts.length - 1].trim()
        } else if (line.startsWith('DTEND')) {
            const parts = line.split(':')
            current.end = parts[parts.length - 1].trim()
        }
    }
    return events
}


const PROXIES = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url=',
    'https://cors-anywhere.herokuapp.com/'
]

export const fetchExternalBookings = async (url) => {
    for (const proxy of PROXIES) {
        try {
            const proxyUrl = proxy + encodeURIComponent(url)
            const response = await fetch(proxyUrl)
            const text = await response.text()
            return parseExternalICS(text)
        } catch (error) {
            continue
        }
    }
    return []
}

const formatICSDate = (dateStr) => dateStr.replace(/-/g, '')
const parseICSDate = (icsDate) => `${icsDate.slice(0, 4)}-${icsDate.slice(4, 6)}-${icsDate.slice(6, 8)}`