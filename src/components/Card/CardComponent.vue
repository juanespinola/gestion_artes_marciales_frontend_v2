<script setup lang="ts">
// Puedes definir las propiedades del componente aquí
interface Props {
  content: string | number | HTMLElement;
}

// Definir props
defineProps<Props>();

</script>

<template>
    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <slot>{{ content }}</slot> 
    </div>
</template>