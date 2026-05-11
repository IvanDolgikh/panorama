<template>
    <ProgressSpinner v-if="isLoading" />

    <div
        v-else-if="!user"
        class="admin"
    >
        <div class="admin__container">
            <p class="admin__container-title">Вход в админ панель</p>
            <form
                @submit.prevent="login"
                class="admin__form"
            >
                <InputText
                    v-model="email"
                    class="admin__input"
                    placeholder="Email"
                    fluid
                />
                <Password
                    v-model="password"
                    :feedback="false"
                    toggleMask
                    type="password"
                    placeholder="Пароль"
                    fluid
                />
                <Message
                    v-if="error"
                    severity="error"
                    size="small"
                    variant="simple"
                >
                    {{ error }}
                </Message>
                <Button
                    class="admin__button"
                    type="submit"
                    label="Войти"
                    :loading="loading"
                    fluid
                    severity="secondary"
                />
            </form>
        </div>
    </div>

    <div v-else>
        <!-- <button
            @click="logout"
            class="admin__logout-btn"
        >Выйти</button> -->
        <AdminPanel />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@services/firebase'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password';
import Button from 'primevue/button'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner';

import AdminPanel from '@/components/admin/AdminPanel.vue';

const user = ref(null)
const email = ref('panorama-tmn@mail.ru')
const password = ref('Panorama_2026_!')
const error = ref('')
const isLoading = ref(false)
const loading = ref(false)

onMounted(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
        user.value = firebaseUser
        isLoading.value = false
    })
})

const login = async () => {
    try {
        loading.value = true
        error.value = ''
        await signInWithEmailAndPassword(auth, email.value, password.value)
    } catch (e) {
        error.value = 'Неверный email или пароль'
    } finally {
        loading.value = false
    }
}

const logout = async () => {
    await signOut(auth)
}
</script>

<style lang="scss">
.admin {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;

    &__container-title {
        margin-bottom: 30px;
        font-size: 22px;
        color: $color-accent;
    }

    &__input,
    .p-password-input {
        background-color: transparent !important;
        border: 1px solid $color-accent;
        font-weight: 400 !important;
        color: $color-base-text !important;
        padding: 12px 16px !important;
        border-radius: 8px !important;
        width: 100%;
        height: 46px;
    }

    &__button {
        background-color: $color-accent !important;
        border: none !important;
        font-size: 18px !important;
        height: 46px !important;
    }

    &__container {
        background: white;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 500px;
    }

    &__form {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }



    .p-inputtext:enabled:focus,
    .p-textarea:enabled:focus {
        border-color: $color-accent;
    }

    .p-message-text {
        font-size: 16px !important;
    }
}

.p-progressspinner {
    margin: auto !important;
}

.p-progressspinner-circle {
    stroke: $color-accent !important;
}

@media (max-width: $vp-768) {
    .admin {
        padding: 16px;

        &__container {
            padding: 24px 20px;
            max-width: 100%;
        }

        &__container-title {
            margin-bottom: 24px;
            font-size: 20px;
            text-align: center;
        }

        &__input,
        .p-password-input {
            padding: 10px 14px !important;
            height: 42px;
            font-size: 14px !important;
        }

        &__button {
            font-size: 16px !important;
            height: 42px !important;
        }

        .p-message-text {
            font-size: 14px !important;
        }
    }
}
</style>