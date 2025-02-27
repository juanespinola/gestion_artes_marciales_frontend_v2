<script>
import useData from '@/composables/useData';
import { useRouter } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import AccordionRegistersEventsComponent from './components/AccordionRegistersEventsComponent.vue';
import InscriptionFormComponent from './components/InscriptionFormComponent.vue';
import { useNotificationStore } from '@/stores/notification';
export default {
    components: {
        AccordionRegistersEventsComponent,
        InscriptionFormComponent
    },
    props: {
        id: {
            type: String,
            required: true,
        }
    },
    setup(props) {
        const notificationStore = useNotificationStore()
        const indexAccordion = ref()
        const toggleAccordion = (index) => {
            indexAccordion.value = indexAccordion.value === index ? null : index;
        }
        const collection = `athlete/entrycategories`;
        const data = ref({});
        const entry_categories_available = ref({});
        const { isLoading, error, create } = useData();
        const router = useRouter();
        const selectedEntryCategories = ref([]);

        const fetchData = async () => {
            const response = await create(collection, { event_id: props.id });
            if (response.success) {
                data.value = response.data.entry_athlete
                entry_categories_available.value = response.data.entry_category_available
            }
        };

        onMounted(async () => {
            await fetchData(); // Cargar los datos al montar el componente
        });


        // Mover una categoría a "Seleccionadas"
        const selectEntryCategory = (category) => {
            // Si ya hay una categoría normal seleccionada, no permitir agregar más categorías normales
            const isNormalCategory = category.name.toLowerCase() !== 'absoluto';
            const hasNormalCategory = selectedEntryCategories.value.some(cat => cat.name.toLowerCase() !== 'absoluto');

            // Si ya hay una categoría normal seleccionada, y la categoría a seleccionar es normal, no permitirla
            if (hasNormalCategory && isNormalCategory) {
                console.log("Ya está registrado en una categoría normal");
                return;
            }
            if (!selectedEntryCategories.value.some(cat => cat.id === category.id)) {
                selectedEntryCategories.value.push(category);
            }
        };

        // Mover una categoría de vuelta a "Disponibles"
        const deselectEntryCategory = (category) => {
            const index = selectedEntryCategories.value.findIndex(cat => cat.id === category.id);
            if (index !== -1) {
                selectedEntryCategories.value.splice(index, 1);
            }
        };

        const handleInscriptionAthlete = async () => {
            const response = await create("athlete/inscription/create", { selectEntryForPayment: selectedEntryCategories.value });
            if (!response.success) {
                if (typeof response?.message === "string") {
                    notificationStore.error("Error!", response?.message);
                } else if (typeof response?.message === "object" && response?.message !== null) {
                    Object.values(response?.message).forEach((errors) => {
                        if (Array.isArray(errors)) {
                            errors.forEach((error) => notificationStore.error("Error!", error));
                        } else {
                            notificationStore.error("Error!", errors);
                        }
                    });
                } else {
                    notificationStore.error("Error!", "Ocurrió un error desconocido.");
                }
                return;
            }
           
            
            router.push({ name: 'TabsPaymentsFee', query: { pageFrom: 'registerevent'} });
            // if(response.success && response.data.response){
            //     router.push({ name: 'TabsPaymentsFee', query: { pageFrom: 'registerevent'} });
            // } 
        }


        return {
            data,
            entry_categories_available,
            isLoading,
            error,
            router,
            fetchData,
            toggleAccordion,
            indexAccordion,
            selectedEntryCategories,
            selectEntryCategory,
            deselectEntryCategory,
            handleInscriptionAthlete
        }
    }
}
</script>

<template>
    <div class="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2 xl:gap-7.5">
        <div class="flex flex-col gap-6">
            <AccordionRegistersEventsComponent v-for="(entrycategory, index) in entry_categories_available" :key="index"
                :title="entrycategory.belt" :content="entrycategory.categories" :isOpen="indexAccordion === index"
                @toggle="toggleAccordion(index)" @selectEntryCategory="selectEntryCategory" :entry_athlete="data" />
        </div>

        <div class="flex flex-col gap-6">
            <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 class="font-medium text-black dark:text-white">Atleta inscripto a la Categoría/s</h3>
                </div>
                <div class="flex flex-col gap-5.5 p-6.5">
                    <InscriptionFormComponent :entrycategories="selectedEntryCategories"
                        @deselectEntryCategory="deselectEntryCategory" />
                </div>
            </div>
            <button :disabled="selectedEntryCategories == 0" @click="handleInscriptionAthlete" class="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            :class="{ 'disabled:cursor-default disabled:bg-whiter dark:focus:border-primary dark:disabled:bg-primary opacity-50' : selectedEntryCategories == 0}">
                Inscribirse
            </button>
        </div>
    </div>
    
</template>