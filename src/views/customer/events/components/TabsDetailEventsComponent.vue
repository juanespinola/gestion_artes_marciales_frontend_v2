<script>
import { ref, computed, onMounted, watch } from 'vue'
import ContentEventsComponent from './ContentEventsComponent.vue';
import ListAthleteInscriptionComponent from './ListAthleteInscriptionsComponent.vue'


export default {
    components: {
        ContentEventsComponent,
        ListAthleteInscriptionComponent
    },
    props: {
        data: {
            type: String,
            required: false,
        },
    },
    setup(props) {
        // Lista de pestañas con sus nombres y componentes asociados
        const tabs = ref([
            { name: "information", label: "Información", component: ContentEventsComponent },
            { name: "categories", label: "Categorías", component: ListAthleteInscriptionComponent },
            
          
        ]);
      
        // Pestaña seleccionada actualmente
        const currentTab = ref(tabs.value[0].name);

        // Seleccionar una pestaña
        const selectTab = (tabName) => {
            currentTab.value = tabName;
        };

        // Componente actual basado en la pestaña activa
        const currentComponent = computed(() => {
            return tabs.value.find((tab) => tab.name === currentTab.value)?.component || null;
        });

    
        onMounted(async () => {
           
        })




        return {
            tabs,
            currentTab,
            selectTab,
            currentComponent,
            props 
        };
    },
};
</script>


<template>
    <div class="mb-14 w-full p-7.5">
        <!-- Tabs -->
        <div class="mb-6 flex flex-wrap gap-5 border-b border-stroke dark:border-strokedark sm:gap-10">
            <button v-for="tab in tabs" :key="tab.name" @click="selectTab(tab.name)" :class="[
                'py-4 text-sm font-medium md:text-base border-b-2',
                currentTab === tab.name
                    ? 'text-primary border-primary'
                    : 'text-gray-600 border-transparent hover:text-primary'
            ]">
                {{ tab.label }}
            </button>
        </div>

        <!-- Tab Content -->
        <div>
            <component :is="currentComponent" :data="props.data"/>
        </div>
        
    </div>
</template>