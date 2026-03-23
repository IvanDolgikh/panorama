const BOT_TOKEN = '8650093810:AAGunQviBr1XfWtNIuv49WRDdfTs3mo5imE'
const GROUP_CHAT_ID = '-5256702406'

import { db } from '@services/firebase';
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs,
    doc,        // 👈 ЭТОГО НЕ ХВАТАЕТ!
    getDoc      // 👈 И ЭТОГО!
} from 'firebase/firestore';


export const sendTelegramNotification = async (message) => {
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: GROUP_CHAT_ID, // ID группы/канала
                text: message,
                parse_mode: 'HTML'
            })
        })

        const data = await response.json()

        if (data.ok) {
            console.log('✅ Уведомление отправлено в Telegram группу')
        } else {
            console.error('❌ Ошибка Telegram:', data.description)
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