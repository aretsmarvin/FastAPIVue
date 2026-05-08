import { createRouter, createWebHistory } from 'vue-router'
import HelloWorldView from '@/views/HelloWorldView.vue'
import SSOUserView from '@/views/SSOUserView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'hello', component: HelloWorldView },
    { path: '/me', name: 'me', component: SSOUserView },
  ],
})

export default router
