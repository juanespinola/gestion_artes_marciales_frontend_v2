<script setup lang="ts">
import CustomerLayout from '@/layouts/CustomerLayout.vue';
import FederationsView from '@/views/customer/FederationsView.vue'
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import Toast from 'primevue/toast';
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

onMounted(() => {
    if(!Object.keys(userStore.federation).length == 0 && route.path == '/'){
        router.push({ name: 'FederationCards'})
    }
})
</script>

<template>
    <CustomerLayout>
        <!-- <Toast /> -->
        <FederationsView v-if="Object.keys(userStore.federation).length === 0"/>
        <router-view />
    </CustomerLayout>
</template>
