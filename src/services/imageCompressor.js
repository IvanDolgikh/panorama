export const compressImage = (file, { maxWidth = 800, quality = 0.7 } = {}) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            const img = new Image()

            img.onload = () => {
                const canvas = document.createElement('canvas')
                const scale = Math.min(1, maxWidth / img.width)
                canvas.width = Math.round(img.width * scale)
                canvas.height = Math.round(img.height * scale)

                const ctx = canvas.getContext('2d')
                ctx.imageSmoothingEnabled = true
                ctx.imageSmoothingQuality = 'high'
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                const avif = canvas.toDataURL('image/avif', quality)
                if (avif.length > 100 && avif !== 'data:,') {
                    const sizeKB = (avif.length * 3) / 4 / 1024
                    resolve(avif)
                    return
                }

                const webp = canvas.toDataURL('image/webp', quality)
                const sizeKB = (webp.length * 3) / 4 / 1024
                resolve(webp)
            }

            img.src = e.target.result
        }

        reader.readAsDataURL(file)
    })
}

export const base64ToBlob = (base64) => {
    const arr = base64.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }

    return new Blob([u8arr], { type: mime })
}