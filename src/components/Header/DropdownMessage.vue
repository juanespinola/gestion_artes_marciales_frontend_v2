<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const target = ref(null)
const dropdownOpen = ref(false)
const notifying = ref(true)
const router = useRouter()
const route = useRoute()

onClickOutside(target, () => {
  dropdownOpen.value = false
})

const messagesList = ref([
  {
    id: 1,
    description: "Noticias",
    route: 'ListAthleteNews',
  },
  {
    id: 2,
    description: "Eventos",
    route: "ListAthleteEvents",
  },
  // {
  //   id: 3,
  //   description: "Información",
  //   route: "federation/news",
  // },
  {
    id: 3,
    description: "Atletas",
    route: "ListAthlete",
  },
  {
    id: 4,
    description: "Ranking",
    route: "Ranking",
  },
])


const handleSelectOption = (route) => {
  router.push({ name: route })
}
</script>

<template>
  <li class="relative" ref="target">
    <!-- <router-link
      class="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
      to="#" @click.prevent="(dropdownOpen = !dropdownOpen), (notifying = false)">
      <span :class="!notifying && 'hidden'" class="absolute -top-0.5 -right-0.5 z-1 h-2 w-2 rounded-full bg-meta-1">
        <span class="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
      </span>

     
    </router-link> -->
    <router-link class="relative flex items-center text-gray-700 border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white" @click.prevent="(dropdownOpen = !dropdownOpen)"  to="#">
      <span
        class="block mr-1 font-medium text-theme-sm">Ir a...</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="">
        <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
    </router-link>

    <!-- Dropdown Start -->
    <div v-show="dropdownOpen"
      class="absolute -right-16 mt-2.5 flex h-50 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80">
      <div class="px-4.5 py-3">
        <h5 class="text-sm font-medium text-bodydark2">Paginas</h5>
      </div>

      <ul class="flex h-auto flex-col overflow-y-auto">
        <template v-for="(item, index) in messagesList" :key="index">
          <li>
            <button
              class="w-full flex gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              @click="handleSelectOption(item.route)">
              <!-- <div class="h-12.5 w-12.5 rounded-full">
                <img :src="item.userImg" alt="User" />
              </div> -->

              <div>
                <h6 class="text-sm font-medium text-black dark:text-white">{{ item.description }}</h6>
                <!-- <p class="text-sm">{{ item.message }}</p>
                <p class="text-xs">{{ item.time }}</p> -->
              </div>
            </button>
          </li>
        </template>
      </ul>
    </div>
    <!-- Dropdown End -->
  </li>
</template>
