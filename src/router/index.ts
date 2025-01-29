import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FederationView from '@/views/customer/FederationView.vue'
import LoginView from '@/views/customer/LoginView.vue'
import HomeAdminView from '@/views/admin/HomeAdminView.vue'
import LoginAdminView from '@/views/admin/login/LoginAdminView.vue'

import RouteUsers from '@/views/admin/users/routes'
import RouteEventStatus from '@/views/admin/eventstatus/routes'
import RouteEventTypes from '@/views/admin/eventtypes/routes'
import RouteLocations from '@/views/admin/locations/routes'
import RoutePermissions from '@/views/admin/permissions/routes'
import RouteRoles from '@/views/admin/roles/routes'
import RouteFederations from '@/views/admin/federations/routes'
import RouteAssociations from '@/views/admin/associations/routes'
import RouteCountries from '@/views/admin/countries/routes'
import RouteCities from '@/views/admin/cities/routes'
import RouteNews from '@/views/admin/news/routes'
import RouteAthletes from '@/views/admin/athletes/routes'
import RouteSanctions from '@/views/admin/sanctions/routes'
import RouteEvents from '@/views/admin/events/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/federation', name: "FederationCards", component: FederationView },
    { path: '/login', name: "Login", component: LoginView },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    { path: '/admin/login', name: "LoginAdmin", component: LoginAdminView },
    {
      path: '/admin',
      name: "homeAdmin",
      component: HomeAdminView,
      children:[
        ...RouteUsers,
        ...RouteEventStatus,
        ...RouteEventTypes,
        ...RouteEventTypes,
        ...RouteLocations,
        ...RoutePermissions,
        ...RouteRoles,
        ...RouteFederations,
        ...RouteAssociations,
        ...RouteCountries,
        ...RouteCities,
        ...RouteNews,
        ...RouteAthletes,
        ...RouteSanctions,
        ...RouteEvents,
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
