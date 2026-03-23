<template>
    <div class="logo">
        <div class="logo__container">
            <component
                :is="logo"
                class="logo__icon"
            />
        </div>
    </div>
</template>

<script setup>
import LogoDark from '@svg-images/logo-panorama-dark.svg'
import LogoLight from '@svg-images/logo-panorama-light.svg'

import { computed } from 'vue';

const props = defineProps({
    color: {
        type: String
    },
    size: {
        type: Object
    }
})

const logo = computed(() => {
    return props.color === 'dark' ? LogoDark : LogoLight
})

</script>

<style
    lang="scss"
    scoped
>
.logo {
    &__container {
        top: 50%;
        left: 50%;
        display: block;
        width: v-bind('props.size.width + "px"');
        height: v-bind('props.size.height + "px"');
    }

    &__icon {
        width: 100%;
        height: 100%;
        display: block;
    }
}
</style>