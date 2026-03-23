<template>
    <section class="reserve">
        <div class="reserve__container">
            <h2 class="visually-hidden">Бронирование</h2>
            <p class="reserve__title">Оставьте заявку</p>
            <p class="reserve__text">Для подтверждения заявки с вами свяжутся в течении 30 минут</p>

            <div>
                <Form
                    v-slot="$form"
                    :initialValues
                    :resolver
                    @submit="onFormSubmit"
                    class="reserve__form"
                >
                    <div>
                        <label for="username">Ваше имя</label>
                        <InputText
                            class="my-input"
                            inputId="username"
                            type="text"
                            placeholder="Имя"
                            name="username"
                        />
                        <Message
                            v-if="$form.username?.invalid"
                            severity="error"
                            size="small"
                            variant="simple"
                        >{{ $form.username.error?.message }}</Message>
                    </div>

                    <div>
                        <label for="phone">Номер телефона</label>
                        <InputMask
                            v-model="phone"
                            class="my-input"
                            inputId="phone"
                            name="phone"
                            mask="+7 (999) 999-9999"
                            placeholder="+7 (999) 999-9999"
                            fluid
                        />
                        <Message
                            v-if="$form.phone?.invalid"
                            severity="error"
                            size="small"
                            variant="simple"
                        >{{ $form.phone.error?.message }}</Message>
                    </div>

                    <div class="reserve__people-amount-container">
                        <label for="people-amount">Количество человек</label>
                        <InputNumber
                            inputClass="my-input"
                            id="people-amount"
                            inputId="integeronly"
                            name="peopleAmount"
                            placeholder="0"
                            fluid
                        />
                        <Message
                            v-if="$form.peopleAmount?.invalid"
                            severity="error"
                            size="small"
                            variant="simple"
                        >{{ $form.peopleAmount.error?.message }}</Message>
                    </div>

                    <div class="reserve__agreement">
                        <Checkbox
                            v-model="agreement"
                            class="my-checkbox"
                            inputId="ingredient1"
                            name="agreement"
                            value="Cheese"
                        />
                        <label for="ingredient1"> Нажимая на кнопку, вы даете согласие на обработку персональных данных и соглашаетесь c политикой конфиденциальности </label>

                        <Message
                            v-if="$form.agreement?.invalid"
                            severity="error"
                            size="small"
                            variant="simple"
                        >{{ $form.agreement.error?.message }}</Message>
                    </div>


                    <Button
                        class="reserve__submit"
                        type="submit"
                        severity="secondary"
                        label="Отправить"
                    />
                </Form>
            </div>

            <Dialog
                v-model:visible="isVisible"
                :closable="false"
                :dismissableMask="true"
                class="reserve__dialog"
                modal
            >
                <div class="reserve__dialog-content">
                    <p class="reserve__dialog-title">Спасибо!</p>
                    <p class="reserve__dialog-text">В ближайщее время с вами свяжутся</p>
                    <button
                        class="reserve__dialog-button"
                        @click="isVisible = false"
                    >Хорошо</button>
                </div>
            </Dialog>

        </div>
    </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import Message from 'primevue/message';
import Dialog from 'primevue/dialog';
import { Form } from '@primevue/forms';

const initialValues = reactive({
    username: '',
    phone: '',
    peopleAmount: null,
    agreement: false
});

const isVisible = ref(false)

const resolver = ({ values }) => {
    const errors = {};

    if (!values.username) {
        errors.username = [{ message: 'Укажите имя' }];
    }

    if (!values.phone) {
        errors.phone = [{ message: 'Укажите номер телефона' }];
    }

    if (!values.peopleAmount) {
        errors.peopleAmount = [{ message: 'Укажите количество человек' }];
    }

    if (!values.agreement) {
        errors.agreement = [{ message: 'Необходимо дать согласие на обработку персональных данных' }];
    }

    return {
        values,
        errors
    };
};

const onFormSubmit = ({ valid }) => {
    if (valid) {
        isVisible.value = true
    }
};
</script>

<style
    lang="scss"
    scoped
>
.reserve {
    &__container {
        width: $vp-1200;
        max-width: 70%;
        margin: 0 auto 80px auto;
        padding: 0 50px;
    }

    &__title {
        text-align: center;
        font-size: 38px;
        font-weight: 300;
        margin-bottom: 10px;
    }

    &__text {
        text-align: center;
        font-size: 20px;
        font-weight: 300;
        margin-bottom: 40px;
    }

    &__form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px 40px;
    }

    &__people-amount-container {
        grid-column: 1 / 3;
    }

    &__submit {
        grid-column: 1 / 3;
        background-color: $color-accent !important;
        color: $color-light-text !important;
    }

    &__agreement {
        grid-column: 1 / 3;
    }

    .my-input {
        background-color: transparent !important;
        border: 1px solid $color-accent;
        font-weight: 400 !important;
        color: $color-base-text !important;
        padding: 12px 16px !important;
        border-radius: 8px !important;
        width: 100%;
    }

    .p-inputtext:enabled:focus {
        border-color: $color-accent;
    }

    .my-checkbox {
        cursor: pointer;

        // Базовые стили для квадратика
        .p-checkbox-box {
            width: 20px;
            height: 20px;
            background: transparent !important;
            border: 1px solid $color-accent !important;
            border-radius: 4px !important;
            transition: all 0.2s ease;
            position: relative;

            &:hover {
                border-color: darken($color-accent, 10%) !important;
            }
        }

        // Стили для отмеченного состояния
        &.p-checkbox-checked {
            .p-checkbox-box {
                background: $color-accent !important;
                border-color: $color-accent !important;

                .p-checkbox-icon {
                    color: $color-light-text !important;
                    font-size: 14px;
                }
            }
        }
    }

    &__dialog {
        background-color: $color-bg-default !important;
    }

    &__dialog-title {
        @include spectral-light;
        text-align: center;
        font-size: 22px;
        color: $color-base-text;
        margin-bottom: 10px;
    }

    &__dialog-text {
        @include spectral-light;
        text-align: center;
        color: $color-base-text;
        margin-bottom: 20px;
    }

    &__dialog-button {
        text-align: center;
        background-color: $color-accent;
        color: $color-light-text;
        border: none;
        border-radius: 10px;
        padding: 4px 14px;
        width: 100%;
        cursor: pointer;
    }
}
</style>