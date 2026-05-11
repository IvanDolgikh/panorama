export const sendTelegramNotification = async (message) => {
    try {
        const response = await fetch(`https://api.telegram.org/bot${import.meta.env.VITE_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: import.meta.env.VITE_GROUP_CHAT_ID, // ID группы/канала
                text: message,
                parse_mode: 'HTML'
            })
        })

        const data = await response.json()

        if (data.ok) {
            return data
        }
    } catch (error) {
        console.error('Ошибка отправки:', error)
    }
}

// export const getTelegramConfig = async () => {
//     const docRef = doc(db, 'secrets', 'vD0beEkizg09TxYBDIln')
//     const docSnap = await getDoc(docRef)

//     if (docSnap.exists()) {
//         console.log('docSnap.data()', docSnap.data())
//         return docSnap.data() // { botToken: '...', chatId: '...', ... }
//     }
//     return null
// }