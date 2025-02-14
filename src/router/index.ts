import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FederationView from '@/views/customer/FederationView.vue'
import LoginView from '@/views/customer/LoginView.vue'
import RegisterAthleteView from '@/views/customer/registerathlete/RegisterAthleteView.vue'
import HomeAdminView from '@/views/admin/HomeAdminView.vue'
import LoginAdminView from '@/views/admin/login/LoginAdminView.vue'


import RouteAdmin from '@/views/admin/router'
import RouteCustomer from '@/views/customer/router'



const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/register', name: "Register", component: RegisterAthleteView },
    { path: '/federation', name: "FederationCards", component: FederationView },
    { path: '/login', name: "Login", component: LoginView },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        ...RouteCustomer
      ]
    },

    // admin panel
    { path: '/admin/login', name: "LoginAdmin", component: LoginAdminView },
    {
      path: '/admin',
      name: "homeAdmin",
      component: HomeAdminView,
      children:[
        ...RouteAdmin
      ]
    }
  ],
})

export default router
