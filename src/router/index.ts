import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FederationView from '@/views/customer/FederationView.vue'
import LoginView from '@/views/customer/LoginView.vue'
import HomeAdminView from '@/views/admin/HomeAdminView.vue'
import LoginAdminView from '@/views/admin/login/LoginAdminView.vue'

import RouteProfile from '@/views/customer/profile/routes'

import RouteAdmin from '@/views/admin/router'
import FederationsView from '@/views/customer/FederationsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // { path: '/federations', name: "FederationsCards", component: FederationsView },
    { path: '/federation', name: "FederationCards", component: FederationView },
    { path: '/login', name: "Login", component: LoginView },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        ...RouteProfile
      ]
    },
    { path: '/admin/login', name: "LoginAdmin", component: LoginAdminView },
    {
      path: '/admin',
      name: "homeAdmin",
      component: HomeAdminView,
      children:[
        ...RouteAdmin
      ]
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
