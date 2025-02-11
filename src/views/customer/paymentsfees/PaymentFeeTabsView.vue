<script>
import CardComponent from '@/components/Card/CardComponent.vue';
import { ref, computed, onMounted, watch } from 'vue'
import ListMembershipsComponent from './components/ListMembershipsComponent.vue';
import ListInscriptionsComponent from './components/ListInscriptionsComponent.vue';
import ListPaymentsComponent from './components/ListPaymentsComponent.vue';
import { useRoute } from 'vue-router'


export default {
    components: {
        CardComponent,
    },
    props: {},
    setup(props) {
        
        const route = useRoute()
        // Lista de pestañas con sus nombres y componentes asociados
        const tabs = ref([
            { name: "memberships", label: "Membresias", component: ListMembershipsComponent },
            { name: "inscriptions", label: "Inscripciones", component: ListInscriptionsComponent },
            { name: "payments", label: "Pagos", component: ListPaymentsComponent },
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
            return tabs.value.filter(tab => tab.name !== "minorauthorization" || props.minor_verified);
        });
    
        onMounted(() => {
            if(route.query.pageFrom=='registerevent') selectTab('inscriptions');
        })

        return {
            tabs,
            currentTab,
            selectTab,
            currentComponent,
            filteredTabs,

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
            <component :is="currentComponent"/>
        </div>
        
    </div>
</template>