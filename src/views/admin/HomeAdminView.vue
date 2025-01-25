<script setup lang="ts">
import CustomerLayout from '@/layouts/CustomerLayout.vue';
import FederationsView from '@/views/customer/FederationsView.vue'
import { useUserStore } from '@/stores/user';
import AdminLayout from '@/layouts/AdminLayout.vue';

const userStore = useUserStore()
</script>

<template>
    <AdminLayout v-if="userStore.isOnline && userStore.user.type !== 'athlete'">
        <router-view />
    </AdminLayout>
</template>
