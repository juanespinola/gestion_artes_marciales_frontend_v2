<script>

import { useRouter } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import useData from '@/composables/useData'
import SelectComponent from '@/components/Select/SelectComponent.vue';
import { useUserStore } from '@/stores/user';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import CardComponent from '@/components/Card/CardComponent.vue';

export default {
    components: {
        SelectComponent,
        DataTable,
        Column,
        CardComponent
    },
    props: {
        obj: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const {  create, fetchAll } = useData();
        const collection = 'athlete/profile';
        const error = ref(null);
        const router = useRouter();
        const isEditing = computed(() => !!props.id);
        const userStore = useUserStore()
        const academies = ref([])
        const belts = ref([])
        const federations = ref([])
        const associations = ref([])
        const beltshistory = ref([])
        const expandedRows = ref({});


        // datos para el modal
        const isModalBeltHistoryOpen = ref(false)
        const modalBeltHistoryData = ref({});

        
        const fetchAcademies = async () => {
            const response = await fetchAll('athlete/academies');
            if (response.success) {
                academies.value = response.data
            }
        };


        const fetchBelts = async (federation_id) => {
            const response = await create('athlete/belts', { federation_id });
            if (response.success) {
                belts.value = response.data
            }
        };

        const fetchFederations = async () => {
            const response = await fetchAll('athlete/federations');
            if (response.success) {
                federations.value = response.data
            }
        };

        const fetchAssociations = async (federation_id) => {
            const response = await fetchAll(`athlete/associations/${federation_id}`);
            if (response.success) {
                associations.value = response.data
            }
        };


    


        // Llamar a fetchProduct cuando el componente se monta o cuando cambia el id
        onMounted(async () => {
            fetchAcademies()
            fetchFederations()
            // fetchBelts()
        });

        watch(() => props.id, (newId) => {
         
        });

        const handleFederationSelected = (itemSelected) => {
            props.obj.federation_id = (itemSelected.id)
            fetchAssociations(itemSelected.id)
            fetchBelts(itemSelected.id)
        }
        const handleAssociationSelected = (itemSelected) => {
            props.obj.association_id = (itemSelected.id)
        }
        const handleAcademySelected = (itemSelected) => {
            props.obj.academy_id = (itemSelected.id)
        }

        const handleBeltSelected = (itemSelected) => {
            props.obj.belt_id = (itemSelected.id)
        }

        const newBeltHistory = () => {
            router.push({ name: "NewBeltHistory" })
        }

        const editBeltHistory = (id) => {
            router.push({ name: "EditBeltHistory", params: { id } })
        }



        return {
            isEditing,
            error,
            academies,
            belts,
            federations,
            associations,
            beltshistory,
            handleAcademySelected,
            handleBeltSelected,
            handleFederationSelected,
            handleAssociationSelected,
            expandedRows,
            isModalBeltHistoryOpen,
            modalBeltHistoryData,
            newBeltHistory,
            editBeltHistory,

        };
    }
}
</script>

<template>
    <div class="grid grid-cols-5 gap-8">
        <div class="col-span-5 xl:col-span-5">
            <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
                    <h3 class="font-medium text-black dark:text-white">{{ 'Cinturón y Academia' }}</h3>
                </div>
                <div class="p-7">
                    <form @submit.prevent="saveData">
                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <SelectComponent :data="federations" :title="'Federaciones'" :selectedOption="obj.federation_id"
                                    @obj-selected="handleFederationSelected" />
                            </div>
                        </div>
                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <SelectComponent :data="associations" :title="'Asociaciones'" :selectedOption="obj.association_id"
                                    @obj-selected="handleAssociationSelected" />
                            </div>
                        </div>
                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <SelectComponent :data="academies" :title="'Academia'" :selectedOption="obj.academy_id"
                                    @obj-selected="handleAcademySelected" />
                            </div>
                        </div>

                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <SelectComponent :data="belts" :title="'Cinturón'" :selectedOption="obj.belt_id"
                                    @obj-selected="handleBeltSelected" />
                            </div>

                        </div>

                        <!-- <div class="flex justify-end gap-4.5">
                          
                            <button
                                class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                                type="submit"> Guardar </button>
                        </div> -->
                    </form>
                </div>
            </div>
        </div>

    </div>

</template>
