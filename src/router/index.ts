import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../view/Home.vue'
import Signup from '../view/Signup.vue'
import Login from '../view/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_API_BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

export default router