import house1Image from '@other-images/house-1/living-room-1.jpg'
import house2Image from '@other-images/house-2/living-room-1.jpg'

const galleryHouse1 = import.meta.glob('@other-images/house-1/*.{jpg,png,webp}', {
    eager: true,
    as: 'url'
})

const galleryHouse2 = import.meta.glob('@other-images/house-2/*.{jpg,png,webp}', {
    eager: true,
    as: 'url'
})

const _galleryHouse1 = Object.values(galleryHouse1)
const _galleryHouse2 = Object.values(galleryHouse2)


export const houses = [
    {
        id: 1,
        slug: 'bakenschika',
        image: house1Image,
        imageAlt: 'Дом "Бакенщика"',
        houseTitle: 'Дом "Бакенщика"',
        houseDescription: 'Лёгкий, светлый дом для ясных мыслей. Здесь можно следить за движением воды на речном изгибе — медитативное зрелище, которое растворяет суету и приносит умиротворение.',
        housePriceWorkday: 7500,
        housePriceWeekend: 8500,
        capacity: 4,
        gallery: [..._galleryHouse1],
        features: ['Wi-Fi', 'Кухня', 'Санузел', 'Панорамные окна', 'Терраса', 'Мангал'],
    },

    {
        id: 2,
        slug: 'yamshika',
        image: house2Image,
        imageAlt: 'Дом "Ямщика"',
        houseTitle: 'Дом "Ямщика"',
        houseDescription: 'Лёгкий, светлый дом для ясных мыслей. Здесь можно следить за движением воды на речном изгибе — медитативное зрелище, которое растворяет суету и приносит умиротворение.',
        housePriceWorkday: 7500,
        housePriceWeekend: 8500,
        capacity: 4,
        gallery: [..._galleryHouse2],
        features: ['Wi-Fi', 'Кухня', 'Санузел', 'Панорамные окна', 'Терраса', 'Мангал'],

    }
]

export const getHouseById = (id) => {
    return houses.find(house => house.id === parseInt(id))
}

export const getHouseBySlug = (slug) => {
    return houses.find(house => house.slug === slug)
}