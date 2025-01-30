<script>
import CardComponent from '@/components/Card/CardComponent.vue';
import { ref, computed } from "vue";
import FormEventsComponent from './components/FormEventsComponent.vue';
import ContentFormEventsComponent from './components/ContentFormEventsComponent.vue';
import ListEntryCategoryComponent from '../entrycategories/components/ListEntryCategoryComponent.vue';
import ListAthleteInscriptionsComponent from '../athletesinscriptions/components/ListAthleteInscriptionsComponent.vue';

export default {
    components: {
        CardComponent
    },
    props: {
        id: {
            type: String,
            required: false,
        },
    },
    setup(props) {
        // Lista de pestañas con sus nombres y componentes asociados
        const tabs = ref([
            { name: "athleteinscriptions", label: "Atletas Inscriptos", component: ListAthleteInscriptionsComponent },
            { name: "evento", label: "Evento", component: FormEventsComponent },
            { name: "content", label: "Contenido", component: ContentFormEventsComponent },
            { name: "entrycategory", label: "Categorias", component: ListEntryCategoryComponent },
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

        const filteredTabs = computed(() => {
            return tabs.value.filter(tab => tab.name !== "entrycategory" || props.id);
        });


        return {
            tabs,
            currentTab,
            selectTab,
            currentComponent,
            filteredTabs
        };
    },
};
</script>


<template>
    <div class="mb-14 w-full p-7.5">
        <!-- Tabs -->
        <div class="mb-6 flex flex-wrap gap-5 border-b border-stroke dark:border-strokedark sm:gap-10">
            <button v-for="tab in filteredTabs" :key="tab.name" @click="selectTab(tab.name)" :class="[
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
            <component :is="currentComponent" :eventid="id" />
        </div>
    </div>
</template>