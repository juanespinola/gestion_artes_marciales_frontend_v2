<script>
import CardComponent from '@/components/Card/CardComponent.vue';
import { ref, computed } from "vue";
import ProfileFormComponent from './components/ProfileFormComponent.vue';
import AthleteProfileFormComponents from './components/AthleteProfileFormComponent.vue';
import MinorAuthorizationFormComponent from './components/MinorAuthorizationFormComponent.vue';
import { useUserStore } from '@/stores/user';
// import ListEntryCategoryComponent from '../entrycategories/components/ListEntryCategoryComponent.vue';
// import ListAthleteInscriptionsComponent from '../athletesinscriptions/components/ListAthleteInscriptionsComponent.vue';

export default {
    components: {
        CardComponent
    },
    props: {
        // id: {
        //     type: String,
        //     required: false,
        // },
    },
    setup(props) {

        const userStore = useUserStore()
        // Lista de pestañas con sus nombres y componentes asociados
        const tabs = ref([
            { name: "profile", label: "Perfil de Cuenta", component: ProfileFormComponent },
            { name: "athlete", label: "Perfil del Atleta", component: AthleteProfileFormComponents },
            { name: "minorauthorization", label: "Autorización de Menores", component: MinorAuthorizationFormComponent },
          
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


        return {
            tabs,
            currentTab,
            selectTab,
            currentComponent,
            filteredTabs,
            userStore,
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