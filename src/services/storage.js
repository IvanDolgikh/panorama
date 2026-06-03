import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

const storage = getStorage()

export const uploadToStorage = async (file, folder) => {
    const fileName = `${Date.now()}.jpg`
    const storageRef = ref(storage, `houses/${folder}/${fileName}`)
    const snapshot = await uploadBytes(storageRef, file)
    const url = await getDownloadURL(snapshot.ref)
    return url
}

export const deleteFromStorage = async (url) => {
    if (!url || !url.includes('firebasestorage.googleapis.com')) return

    try {
        const storageRef = ref(storage, url)
        await deleteObject(storageRef)
    } catch (error) {
        console.error('Ошибка удаления из Storage:', error)
    }
}