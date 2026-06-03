<template>
    <Dialog
        class="add-house"
        :visible="isOpenDialog"
        :closable="true"
        closeOnEscape
        modal
        header="Добавить дом"
        @update:visible="(value) => emit('update:isOpenDialog', value)"
    >
        <Tabs value="0">
            <TabList>
                <Tab value="0">Основное</Tab>
                <Tab value="1">Цены</Tab>
                <Tab value="2">Фото</Tab>
            </TabList>

            <TabPanels>
                <TabPanel value="0">
                    <HouseMainInfo v-model="form" />
                </TabPanel>
                <TabPanel value="1">
                    <HousePricing v-model="form.pricing" />
                </TabPanel>
                <TabPanel value="2">
                    <HousePhotos
                        :main-photo-preview="mainPhotoPreview"
                        :gallery-previews="galleryPreviews"
                        @main-photo="onMainPhotoSelect"
                        @gallery="onGallerySelect"
                        @remove-main-photo="onRemoveMainPhoto"
                        @remove-gallery-photo="onRemoveGalleryPhoto"
                    />
                </TabPanel>
            </TabPanels>
        </Tabs>

        <!-- Кнопки -->
        <div class="add-house__buttons">
            <Button
                label="Отмена"
                severity="danger"
                outlined
                @click="onClose"
            />
            <Button
                label="Сохранить"
                severity="secondary"
                :loading="isSaving"
                @click="saveHouse"
            />
        </div>
    </Dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore'
import { db } from '@services/firebase'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'

import HouseMainInfo from './HouseMainInfo.vue'
import HousePricing from './HousePricing.vue'
import HousePhotos from './HousePhotos.vue'

import { compressImage, base64ToBlob } from '@services/imageCompressor'
import { uploadToStorage, deleteFromStorage } from '@services/storage'
import { createGist } from '@services/calendarSync'

const toast = useToast()

const props = defineProps({
    isOpenDialog: { type: Boolean, required: true },
    houseToEdit: { type: Object, default: null }
})

const emit = defineEmits(['update:visible', 'house-added'])

const form = reactive({
    title: '',
    slug: '',
    description: '',
    checkInTime: '15:00',
    checkOutTime: '12:00',
    pricing: {
        base: 7500,
        weekend: 8500,
        custom: []
    },
    icsUrls: {
        avito: '',
        yandex: ''
    },
})

const isSaving = ref(false)
const mainPhotoPreview = ref(null)
const galleryPreviews = ref([])
const mainPhotoFile = ref(null)

const resetForm = () => {
    form.title = ''
    form.slug = ''
    form.description = ''
    form.checkInTime = '15:00'
    form.checkOutTime = '12:00'
    form.pricing = { base: 7500, weekend: 8500, custom: [] }
    mainPhotoPreview.value = null
    galleryPreviews.value = []
    mainPhotoFile.value = null
    form.icsUrls.avito = ''
    form.icsUrls.yandex = ''
}

const onRemoveMainPhoto = () => {
    mainPhotoPreview.value = null
    mainPhotoFile.value = null
}

const onRemoveGalleryPhoto = (index) => {
    galleryPreviews.value.splice(index, 1)
}


watch(() => props.houseToEdit, (house) => {
    if (house) {
        form.title = house.title || ''
        form.slug = house.slug || ''
        form.description = house.description || ''
        form.checkInTime = house.checkInTime || '15:00'
        form.checkOutTime = house.checkOutTime || '12:00'

        const pricing = { ...(house.pricing || { base: 7500, weekend: 8500, custom: [] }) }
        if (pricing.custom) {
            pricing.custom = pricing.custom
                .filter(period => period.startDate || period.endDate)
                .map(period => ({
                    ...period,
                    startDate: period.startDate ? new Date(period.startDate + 'T00:00:00') : null,
                    endDate: period.endDate ? new Date(period.endDate + 'T00:00:00') : null
                }))
        }
        form.pricing = pricing
        form.icsUrls.avito = house.icsUrls?.avito || ''
        form.icsUrls.yandex = house.icsUrls?.yandex || ''

        mainPhotoPreview.value = house.mainPhoto || null
        galleryPreviews.value = [...(house.gallery || [])]
    } else {
        resetForm()
    }
}, { immediate: true })

// // Автогенерация slug
// watch(() => form.title, (newTitle) => {
//     form.slug = newTitle
//         .toLowerCase()
//         .replace(/[^а-яa-z0-9\s]/g, '')
//         .replace(/\s+/g, '-')
// })

const onMainPhotoSelect = async (event) => {
    const file = event.files?.[0]
    if (!file) return

    mainPhotoFile.value = file

    const compressed = await compressImage(file, { maxWidth: 800, quality: 0.75 })
    mainPhotoPreview.value = compressed
}

const onGallerySelect = async (event) => {
    const files = event.files
    if (!files) return

    for (const file of files) {
        const compressed = await compressImage(file, { maxWidth: 600, quality: 0.7 })
        galleryPreviews.value.push(compressed)
    }
}

const formatLocalDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


// Удаление старых фото из Storage
const cleanupOldPhotos = async () => {
    if (!props.houseToEdit) return

    const oldPhotos = [
        props.houseToEdit.mainPhoto,
        ...(props.houseToEdit.gallery || [])
    ].filter(Boolean)

    const newPhotos = [
        mainPhotoPreview.value,
        ...galleryPreviews.value
    ].filter(p => p && !p.startsWith('data:'))

    for (const oldUrl of oldPhotos) {
        if (!newPhotos.includes(oldUrl)) {
            await deleteFromStorage(oldUrl)
        }
    }
}

// Загрузка главного фото
const uploadMainPhoto = async () => {
    if (mainPhotoPreview.value?.startsWith('data:')) {
        const blob = base64ToBlob(mainPhotoPreview.value)
        return await uploadToStorage(blob, form.slug)
    }
    return props.houseToEdit?.mainPhoto || null
}

// Загрузка галереи
const uploadGallery = async () => {
    const urls = []

    // Оставляем старые фото
    if (props.houseToEdit?.gallery) {
        for (const oldUrl of props.houseToEdit.gallery) {
            if (galleryPreviews.value.includes(oldUrl)) {
                urls.push(oldUrl)
            }
        }
    }

    // Добавляем новые фото
    for (const preview of galleryPreviews.value) {
        if (preview.startsWith('data:')) {
            const blob = base64ToBlob(preview)
            const url = await uploadToStorage(blob, form.slug)
            urls.push(url)
        }
    }

    return urls
}

// Сохранение
const saveHouse = async () => {
    if (!form.title || !form.slug) {
        alert('Заполните обязательные поля')
        return
    }

    try {
        isSaving.value = true

        await cleanupOldPhotos()

        const mainPhotoUrl = await uploadMainPhoto()
        const galleryUrls = await uploadGallery()

        const pricing = {
            base: form.pricing.base,
            weekend: form.pricing.weekend,
            custom: (form.pricing.custom || []).map(period => ({
                label: period.label || '',
                startDate: period.startDate ? formatLocalDate(period.startDate) : null,
                endDate: period.endDate ? formatLocalDate(period.endDate) : null,
                price: period.price || 0
            }))
        }

        const houseData = {
            title: form.title,
            slug: form.slug,
            description: form.description,
            checkInTime: form.checkInTime,
            checkOutTime: form.checkOutTime,
            pricing: pricing,
            mainPhoto: mainPhotoUrl,
            gallery: galleryUrls,
            createdAt: new Date().toISOString(),
            icsUrls: {
                avito: form.icsUrls.avito,
                yandex: form.icsUrls.yandex
            }
        }

        if (props.houseToEdit) {
            if (!props.houseToEdit.gistId) {
                const gistId = await createGist(form.title, form.slug)
                houseData.gistId = gistId
            } else {
                houseData.gistId = props.houseToEdit.gistId
            }
            await updateDoc(doc(db, 'houses', props.houseToEdit.id), houseData)
            emit('house-updated', { id: props.houseToEdit.id, ...houseData })
            toast.add({ severity: 'success', summary: 'Сохранено', detail: `Дом "${form.title}" обновлен`, life: 3000 })
        } else {
            const gistId = await createGist(form.title, form.slug)
            houseData.gistId = gistId
            const docRef = await addDoc(collection(db, 'houses'), houseData)
            emit('house-added', { id: docRef.id, ...houseData })
            toast.add({
                severity: 'success',
                summary: 'Дом создан',
                life: 15000
            })
        }

        onClose()

    } catch (error) {
        toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось сохранить дом', life: 5000 })
    } finally {
        isSaving.value = false
    }
}

const onClose = () => {
    emit('close-dialog')
    resetForm()
}
</script>

<style lang="scss">
.add-house {
    background-color: $color-base-white !important;
    color: $color-base-text !important;
    @include spectral-regular;
    font-size: 18px;
    width: 50%;
    max-width: 700px;

    &__buttons {
        display: flex;
        justify-content: end;
        column-gap: 18px;
        margin-top: 24px;
    }

    .p-inputtext,
    .p-datepicker-input {
        height: 36px !important;
    }
}

@media (max-width: $vp-1024) {
    .add-house {
        width: 70%;
        max-width: 600px;

        &__buttons {
            margin-top: 20px;
            column-gap: 14px;
        }
    }
}

@media (max-width: $vp-768) {
    .add-house {
        width: 95% !important;
        margin: 16px;

        &__buttons {
            margin-top: 16px;
            column-gap: 12px;

            .p-button {
                font-size: 14px;
                padding: 8px 16px;
            }
        }



    }
}
</style>