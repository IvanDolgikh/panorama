<template>
    <div class="app">
        <Header
            v-if="$route.name !== 'admin'"
            ref="headerComponent"
        />
        <RouterView />
        <Footer v-if="$route.name !== 'admin'" />
    </div>
</template>


<script setup>
import Header from '@components/TheHeader.vue';
import Footer from '@components/TheFooter.vue';
import { ref, provide, watchEffect } from 'vue'


const headerComponent = ref(null)
const headerHeight = ref(0)

watchEffect(() => {
    if (headerComponent.value) {
        headerHeight.value = headerComponent.value.headerHeight
    }
})

provide('headerHeight', headerHeight)
</script>

<style
    scoped
    lang="scss"
></style>