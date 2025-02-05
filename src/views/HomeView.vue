<script setup lang="ts">
import CustomerLayout from '@/layouts/CustomerLayout.vue';
import FederationsView from '@/views/customer/FederationsView.vue'
import { useUserStore } from '@/stores/user';
import AdminLayout from '@/layouts/AdminLayout.vue';

const userStore = useUserStore()
</script>

<template>
    <CustomerLayout>
        <FederationsView v-if="Object.keys(userStore.federation).length === 0"/>
        <router-view />
    </CustomerLayout>

    <!-- <AdminLayout v-if="userStore.isOnline && userStore.user.type !== 'athlete'">
        
    </AdminLayout> -->
</template>
