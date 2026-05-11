export const uploadToImgBB = async (file) => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`, {
        method: 'POST',
        body: formData
    })

    const data = await response.json()

    if (!data.success) {
        throw new Error('Ошибка загрузки на ImgBB')
    }

    return data.data.url
}