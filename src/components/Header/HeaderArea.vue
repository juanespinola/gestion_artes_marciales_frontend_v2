<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar'
import DarkModeSwitcher from './DarkModeSwitcher.vue'
import DropdownMessage from './DropdownMessage.vue'
import DropdownNotification from './DropdownNotification.vue'
import DropdownUser from './DropdownUser.vue'
import { useUserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'
import DropdownAdmin from './DropdownAdmin.vue'

const { toggleSidebar } = useSidebarStore()
const sidebarStore = useSidebarStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()


const handleFederationSelection = () => {
  userStore.selectFederation()
  router.push({ name: "home"})
}

const isPageFederations = route.path == '/'

</script>

<template>
  <header
    class="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
  >
    <div class="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
      <div class="flex items-center gap-2 sm:gap-4 lg:hidden">
        <!-- Hamburger Toggle BTN -->
        <button
          v-if="userStore.isOnline && userStore.user.type !== 'athlete'"
          class="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          @click="
            () => {
              console.log('Toggling Sidebar')
              toggleSidebar()
            }
          "
        >
          <span class="relative block h-5.5 w-5.5 cursor-pointer">
            <span class="block absolute right-0 h-full w-full">
              <span
                class="relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white"
                :class="{ '!w-full delay-300': !sidebarStore.isSidebarOpen }"
              ></span>
              <span
                class="relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white"
                :class="{ '!w-full delay-400': !sidebarStore.isSidebarOpen }"
              ></span>
              <span
                class="relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white"
                :class="{ '!w-full delay-500': !sidebarStore.isSidebarOpen }"
              ></span>
            </span>
            <span class="block absolute right-0 h-full w-full rotate-45">
              <span
                class="absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white"
                :class="{ '!h-0 delay-[0]': !sidebarStore.isSidebarOpen }"
              ></span>
              <span
                class="delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white"
                :class="{ '!h-0 delay-200': !sidebarStore.isSidebarOpen }"
              ></span>
            </span>
          </span>
        </button>
        <!-- Hamburger Toggle BTN -->
        <!-- <router-link class="block flex-shrink-0 lg:hidden" to="/">
          <img src="@/assets/images/logo/logo-icon.svg" alt="Logo" />
        </router-link> -->
      </div>
      <div class="hidden sm:block">
        <div class="border-stroke p-5 px-7.5 dark:border-strokedark">
              <h4 class="text-xl font-semibold text-black dark:text-white">
                  {{ userStore.federation.description }}
              </h4>
          </div>
      </div>

      <div class="flex items-center gap-3 2xsm:gap-7">
        <ul class="flex items-center gap-2 2xsm:gap-4">
          <li>
            <DarkModeSwitcher />
          </li>
          <li>
            <DropdownMessage v-if="!isPageFederations"/>
          </li>
          <li>
            <button v-if="!userStore.isOnline && !isPageFederations" @click="handleFederationSelection">Federaciones</button>
          </li>
        </ul>

        <!-- User Area -->
        <DropdownUser v-if="userStore.isOnline && userStore.user.type == 'athlete' && !isPageFederations"/>
        <DropdownAdmin v-if="userStore.isOnline && userStore.user.type !== 'athlete' && !isPageFederations"/>
        
        <button @click="$router.push({ name: 'Login'})" v-if="!userStore.isOnline && !isPageFederations">Iniciar Sesión</button>
        <button @click="$router.push({ name: 'Register'})" v-if="!userStore.isOnline && !isPageFederations">Registrarse</button>
        <!-- User Area -->
      </div>
    </div>
  </header>
</template>
