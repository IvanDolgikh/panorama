<template>
    <router-link :to="{
        name: 'home'
    }">

        <div class="logo">
            <div class="logo__container">

                <component
                    :is="logo"
                    class="logo__icon"
                />
            </div>
        </div>
    </router-link>
</template>

<script setup>
import LogoDark from '@svg-images/logo-panorama-dark.svg'
import LogoLight from '@svg-images/logo-panorama-light.svg'

import { computed } from 'vue';

const props = defineProps({
    color: {
        type: String
    },
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
        width: 80px;
        height: 80px;


        @media (max-width: $vp-768) {
            width: 65px;
            height: 65px;
        }
    }



    &__icon {
        width: 100%;
        height: 100%;
        display: block;
    }
}
</style>