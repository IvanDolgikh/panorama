import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

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
    {
        path: '/admin',
        name: 'admin',
        component: () => import('@views/AdminView.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }

        if (to.hash) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const element = document.querySelector(to.hash)
                    if (element) {
                        resolve({
                            el: to.hash,
                            behavior: 'smooth',
                            top: 80
                        })
                    } else {
                        resolve({ top: 0 })
                    }
                }, 100)
            })
        }

        return { top: 0 }
    }
})

export default router