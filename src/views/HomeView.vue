<template>
    <div class="main-block">
        <div class="main-block__container">
            <Promo />
            <About />
            <AboutGallery />
            <Houses />
            <Sauna />
            <Contacts />
        </div>
    </div>
</template>

<script setup>
import Promo from '@components/ThePromo.vue';
import About from '@components/about/About.vue'
import AboutGallery from '@components/about/AboutGallery.vue'
import Houses from '@components/houses/Houses.vue'
import Sauna from '@components/Sauna.vue'
import Contacts from '@components/Contacts.vue'
</script>

<style lang="scss"></style>