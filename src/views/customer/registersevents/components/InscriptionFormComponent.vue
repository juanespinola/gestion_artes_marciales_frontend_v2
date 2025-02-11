<script>
import useData from '@/composables/useData';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
export default {
    component: {},
    props: {
        entrycategories: {
            type: Array,
        }
    },
    setup(props) {

        return {
            props
        }
    }
}
</script>

<template>
    <div v-for="(entrycategory, index) of props.entrycategories" :key="index">
        <label :for="`checkboxLabel_${index}`" class="flex cursor-pointer select-none items-center" >
            <div class="relative">
                <input type="checkbox" :id="`checkboxLabel_${index}`" class="sr-only" @click="$emit('deselectEntryCategory', entrycategory)">
                <div class="mr-4 flex h-5 w-5 items-center justify-center rounded border">
                    <span class="h-2.5 w-2.5 rounded-sm"></span>
                </div>
            </div> {{ entrycategory.name }} | - {{ entrycategory.max_weight ? entrycategory.max_weight :
                "Sin Limites" }} Kg |
            {{ entrycategory.gender == 'masculino' ? "Masculino" : "Femenino" }} |
            - {{ entrycategory.max_age }} Años |
            {{ entrycategory.clothes }}
        </label>
    </div>
</template>