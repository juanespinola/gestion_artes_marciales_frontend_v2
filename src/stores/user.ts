import useData from '@/composables/useData'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const isOnline = useStorage('isOnline', ref(false))
  const user = useStorage('user', ref({}))
  const federation = useStorage('federation', ref({}))
  const token = useStorage('token', ref(''))

  const { fetchAll } = useData()


  const federationIsEmpty = () => {
    if(Object.keys(federation.value).length === 0)
      router.push({ name: "home" })
  }

  const logout = async (type: string) => {
    if(type == 'athlete'){
      const response = await fetchAll('athlete/logout')
      if(response.success){
        isOnline.value = false;
        user.value = {}
        token.value = ''
      }
    } else {
      const response = await fetchAll('logout')
      if(response.success){
        isOnline.value = false;
        user.value = {}
        token.value = ''
      }
    }
  }

  const selectFederation = () => {
    federation.value = {}
  }
  
  return { isOnline, federation, user, token, federationIsEmpty, logout, selectFederation}
})
