<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import AdminLayout from '@/layouts/AdminLayout.vue';
// import Toast from 'primevue/toast';
const userStore = useUserStore()
</script>

<template>
    <AdminLayout v-if="userStore.isOnline && userStore.user.type !== 'athlete'">
        <!-- <Toast/> -->
        <router-view />
    </AdminLayout>
</template>
