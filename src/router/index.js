import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@views/HomeView.vue'),
    },
    {
        path: '/houses/:slug',
        name: 'house-detail',
        component: () => import('@views/HouseDetailView.vue'),
        props: true
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
                top: 80
            }
        }
        return { top: 0 }
    }
})

export default router