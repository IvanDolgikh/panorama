<template>
    <div class="photos">
        <div class="photos__field">
            <p>Главное фото</p>
            <FileUpload
                mode="basic"
                accept="image/*"
                :maxFileSize="10000000"
                @select="$emit('main-photo', $event)"
                customUpload
                auto
                severity="secondary"
            />
            <div
                v-if="mainPhotoPreview"
                class="photos__preview-wrapper"
            >
                <img
                    :src="mainPhotoPreview"
                    class="photos__preview"
                />
                <button
                    class="photos__remove-btn"
                    @click="$emit('remove-main-photo')"
                >
                    <span class="pi pi-minus"></span>
                </button>
            </div>
        </div>

        <div class="photos__field">
            <p>Галерея</p>
            <FileUpload
                mode="basic"
                accept="image/*"
                :maxFileSize="10000000"
                @select="$emit('gallery', $event)"
                customUpload
                auto
                multiple
                severity="secondary"
            />
            <div class="photos__gallery">
                <div
                    v-for="(p, i) in galleryPreviews"
                    :key="i"
                    class="photos__thumb-wrapper"
                >
                    <img
                        :src="p"
                        class="photos__thumb"
                    />
                    <button
                        class="photos__remove-btn"
                        @click="$emit('remove-gallery-photo', i)"
                    >
                        <span class="pi pi-minus"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import FileUpload from 'primevue/fileupload'

defineProps({
    mainPhotoPreview: String,
    galleryPreviews: { type: Array, default: () => [] }
})

defineEmits(['main-photo', 'gallery', 'remove-main-photo', 'remove-gallery-photo'])
</script>

<style
    lang="scss"
    scoped
>
.photos {
    &__field {
        margin-bottom: 20px;

        p {
            display: block;
            margin-bottom: 8px;
            color: $color-base-text;
            font-size: 16px;
        }
    }

    &__preview-wrapper {
        position: relative;
        width: 60%;
        margin-top: 10px;

        &:hover {
            .photos__remove-btn {
                opacity: 1
            }
        }
    }

    &__preview {
        width: 100%;
        max-height: 200px;
        object-fit: cover;
        border-radius: 8px;
    }

    &__gallery {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 8px;
    }

    &__thumb-wrapper {
        position: relative;

        &:hover {
            .photos__remove-btn {
                opacity: 1
            }
        }
    }

    &__thumb {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 6px;
    }

    &__remove-btn {
        opacity: 0;
        position: absolute;
        right: 5px;
        top: 5px;
        background-color: #0000008d;
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        transition: opacity 0.2s;
        cursor: pointer;

        span {
            font-size: 12px;
        }


        &:hover {
            background: #000000;
        }
    }
}
</style>