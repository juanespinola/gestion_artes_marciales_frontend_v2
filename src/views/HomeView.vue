<script setup lang="ts">
import CustomerLayout from '@/layouts/CustomerLayout.vue';
import FederationsView from '@/views/customer/FederationsView.vue'
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

onMounted(() => {
    console.log(route.path)    
    console.log(userStore.federation)    
    if(!Object.keys(userStore.federation).length == 0 && route.path == '/'){
        router.push({ name: 'FederationCards'})
    }
})
</script>

<template>
    <CustomerLayout>
        <FederationsView v-if="Object.keys(userStore.federation).length === 0"/>
        <router-view />
    </CustomerLayout>

    <!-- <AdminLayout v-if="userStore.isOnline && userStore.user.type !== 'athlete'">
        
    </AdminLayout> -->
</template>
