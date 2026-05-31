<template>
    <div class="admin-panel">
        <div class="admin-panel__container">

            <div class="admin-panel__houses">
                <h2>Информация о домах</h2>
                <div class="admin-panel__button-container">
                    <Button
                        rounded
                        aria-label="Filter"
                        @click="onOpenDialog"
                    >
                        <span class="pi pi-plus"></span>
                    </Button>
                </div>

                <div class="admin-panel__accordion">
                    <Accordion
                        v-if="houses.length"
                        v-model:value="activeAccordion"
                        multiple
                    >
                        <AccordionPanel
                            v-for="house in houses"
                            :key="house.id"
                            :value="house.id"
                        >
                            <AccordionHeader>{{ house.title }}</AccordionHeader>
                            <AccordionContent>
                                <AdminPanelHouseInfo
                                    v-if="house"
                                    :house="house"
                                    @edit-house="onEditHouse"
                                    @delete-house="onDeleteHouse"
                                />

                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>

                    <p
                        v-else
                        class="empty-text"
                    >Нет добавленных домов</p>
                </div>
            </div>

            <!-- Статистика -->
            <AdminStats
                :houses="houses"
                :bookings="bookings"
            />

            <AdminCalendar
                :houses="houses"
                :bookings="bookings"
                @booking-deleted="onBookingDeleted"
            />
        </div>

        <AddHouseDialog
            v-model:isOpenDialog="isOpenDialog"
            :house-to-edit="houseToEdit"
            @house-added="onHouseAdded"
            @house-updated="onHouseUpdated"
            @close-dialog="onCloseDialog"
        />

        <ConfirmDialog />
        <Toast />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore'
import { db } from '@services/firebase'
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast'
import AddHouseDialog from './AddHouseDialog.vue'
import AdminPanelHouseInfo from './AdminPanelHouseInfo.vue'
import AdminStats from './AdminStats.vue'
import AdminCalendar from './AdminCalendar.vue';
import { syncExternalCalendars } from '@services/calendarSync'

const confirm = useConfirm();
const toast = useToast()

const isOpenDialog = ref(false)
const houses = ref([])
const bookings = ref([])
const activeAccordion = ref([])
const houseToEdit = ref(null)

const loadData = async () => {
    try {
        const [housesSnapshot, bookingsSnapshot] = await Promise.all([
            getDocs(collection(db, 'houses')),
            getDocs(collection(db, 'bookings'))
        ])

        houses.value = housesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))


        bookings.value = bookingsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        console.log('Загружено:', houses.value.length, 'домов,', bookings.value.length, 'броней')
    } catch (error) {
        console.error('Ошибка загрузки:', error)
    }
}

const onDeleteHouse = (house) => {
    confirm.require({
        message: `Вы уверены, что хотите удалить "${house.title}"?`,
        header: 'Удаление дома',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Отмена',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Удалить',
            severity: 'danger'
        },
        accept: async () => {
            try {
                await deleteDoc(doc(db, 'houses', house.id))
                houses.value = houses.value.filter(h => h.id !== house.id)
                toast.add({
                    severity: 'success',
                    summary: 'Удалено',
                    detail: `Дом "${house.title}" удален`,
                    life: 3000
                })
            } catch (error) {
                console.error('Ошибка удаления:', error)
                toast.add({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: 'Не удалось удалить дом',
                    life: 3000
                })
            }
        }
    })
}

const onBookingDeleted = (id) => {
    bookings.value = bookings.value.filter(b => b.id !== id)
}

const onEditHouse = (house) => {
    const freshHouse = houses.value.find(h => h.id === house.id)
    houseToEdit.value = freshHouse ? { ...freshHouse } : null
    isOpenDialog.value = true
}

const onHouseUpdated = (updatedHouse) => {
    const index = houses.value.findIndex(h => h.id === updatedHouse.id)
    if (index !== -1) {
        houses.value[index] = updatedHouse
    }
}

const onOpenDialog = () => {
    isOpenDialog.value = true
    houseToEdit.value = null
}

const onHouseAdded = (newHouse) => {
    houses.value.push(newHouse)
    activeAccordion.value = [newHouse.id]
}

const onCloseDialog = () => {
    isOpenDialog.value = false
}

onMounted(async () => {
    await loadData()

    // Автосинхронизация для каждого дома при входе в админку
    for (const house of houses.value) {
        const icsUrls = house.icsUrls || null
        if (icsUrls) {
            syncExternalCalendars(
                house.id,
                house.title,
                icsUrls,
                house.pricing
            ).catch(e => console.error('Ошибка синхронизации:', e))
        }
    }

    // // Периодическая синхронизация каждые 30 минут
    // setInterval(async () => {
    //     for (const house of houses.value) {
    //         const icsUrls = house.icsUrls || null
    //         if (icsUrls) {
    //             syncExternalCalendars(
    //                 house.id,
    //                 house.title,
    //                 icsUrls,
    //                 house.pricing
    //             ).catch(e => console.error('Ошибка синхронизации:', e))
    //         }
    //     }
    // }, 30 * 60 * 1000)
})
</script>

<style lang="scss">
.admin-panel {
    &__container {
        max-width: $vp-1440;
        margin: 0 auto;
        padding: 30px 50px;
    }

    &__houses {
        margin-bottom: 40px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        background: #f3f3ee;
        border-radius: 20px;
        padding: 30px 50px;

        h2 {
            margin-bottom: 8px;
            color: $color-base-text;
        }
    }

    &__button-container {
        width: fit-content;
        margin: 0 auto 30px auto;

        button {
            width: 60px;
            height: 60px;
            background-color: transparent;
            color: $color-accent;
            border: 1px solid $color-accent;
        }

        span {
            font-size: 22px;
            color: $color-accent;
        }
    }

    .p-button:not(:disabled):hover {
        background: $color-accent;
        border: none;

        span {
            color: $color-bg-default;
        }
    }
}

.house-photo {
    max-width: 300px;
    border-radius: 8px;
    margin-top: 10px;
}

.empty-text {
    text-align: center;
    color: #999;
    font-size: 18px;
    padding: 40px;
}

@media (max-width: $vp-1024) {
    .admin-panel {
        &__container {
            padding: 20px 30px;
        }

        &__houses {
            padding: 20px 30px;
            margin-bottom: 30px;

            h2 {
                font-size: 24px;
            }
        }

        &__button-container button {
            width: 50px;
            height: 50px;

            span {
                font-size: 18px;
            }
        }
    }
}

@media (max-width: $vp-768) {
    .admin-panel {
        &__container {
            padding: 16px;
        }

        &__houses {
            padding: 16px;
            margin-bottom: 24px;
            border-radius: 16px;

            h2 {
                font-size: 20px;
            }
        }

        &__button-container {
            margin: 16px auto;

            button {
                width: 44px;
                height: 44px;
            }
        }
    }

    .empty-text {
        font-size: 14px;
        padding: 30px;
    }
}
</style>