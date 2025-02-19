<script>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import useData from '@/composables/useData';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import GroupActionButtonsComponent from './GroupActionButtonsComponent.vue'
import ModalWeightFormComponent from './ModalWeightFormComponent.vue';
import GenerateMatchBracketsModalFormComponent from './GenerateMatchBracketsModalFormComponent.vue';

import CardComponent from '@/components/Card/CardComponent.vue';
import { useNotificationStore } from '@/stores/notification';

export default {
    components: {
        DataTable,
        Column,
        GroupActionButtonsComponent,
        ModalWeightFormComponent,
        GenerateMatchBracketsModalFormComponent,
        CardComponent
    },
    props: {
        eventid: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const collection = 'inscription';
        const newDataRoute = 'NewEntryCategory';
        const editDataRoute = 'EditEntryCategory';
        const router = useRouter();
        const columns = [];
        const data = ref([]);
        const { isLoading, error, create, destroy } = useData();
        const notificationStore = useNotificationStore()
        const expandedRows = ref({});

        const isModalOpen = ref(false)
        const isGenerateMatchBracketModalOpen = ref(false)

        const modalData = ref({})
        const modalGenerateMatchBracketsData = ref({})


        const fetchData = async (eventid) => {
            // const response = await fetchAll(`${collection}/event/${eventid}`);
            const response = await create(`${collection}`, { event_id: eventid })
            if (response.success) {
                data.value = response.data
            }

        };

        const newEntryCategoryData = () => {
            router.push({ name: newDataRoute, params: { eventid: props.eventid } });
        };

        // aca tiene que estar sin el cinturon, porque crearias una categoria en el cinturon
        const editEntryCategoryData = (data) => {
            router.push({ name: editDataRoute, params: { id: data.categories.id, eventid: props.eventid } });
        };

        const deleteEntryCategoryData = async (id) => {
            const response = await destroy(collection, id);
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
            if (response.success) {
                await fetchData(props.eventid); // Recargar datos después de eliminar
                notificationStore.success("Correcto!",response?.data?.messages)
            }
        };

        const newCategoryData = (data) => {
            router.push({ name: newDataRoute, params: { eventid: props.eventid }, query: { beltid: data.cinturon.id } });
        };

        // aca debemos pasar el color del cinturon para que se cree la categoria
        const editCategoryData = (id) => {
            router.push({ name: editDataRoute, params: { id, eventid: props.eventid } });
        };

        const deleteCategoryData = async (id) => {
            const response = await destroy(collection, id);
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
            if (response.success) {
                await fetchData(props.eventid); // Recargar datos después de eliminar
                notificationStore.success("Correcto!",response?.data?.messages)
            }
        };

        const changeWeightData = (data) => {
            openModal(data)
        }
        const openModal = (data) => {
            modalData.value = data
            isModalOpen.value = true;
        }
        const closeModal = () => {
            isModalOpen.value = false;
            fetchData(props.eventid)
        }

        const generateMatchBrackets = (data) => {
            openGenerateMatchBracketModal(data)
        }

        const openGenerateMatchBracketModal = (data) => {
            modalGenerateMatchBracketsData.value = data
            isGenerateMatchBracketModalOpen.value = true;
        }
        const closeGenerateMatchBracketModal = () => {
            isGenerateMatchBracketModalOpen.value = false;
            fetchData(props.eventid)
        }


        const detailsMatchBrackets = (data) => {
            router.push({ name: "ListMatchbracket", params: { eventid: props.eventid, entrycategoryid: data.id }})
        }

        const textWeightField = (data) => {
            if (!data.data.event_weight && !data.data.valid_weight) {
                return "Sin peso";
            }

            if (data.data.event_weight && data.data.valid_weight) {
                return `${data.data.event_weight} Kg`
            }

            if (data.data.event_weight && !data.data.valid_weight) {
                return "Fuera de Peso"
            }
        }

        onMounted(() => {
            fetchData(props.eventid); // Cargar los datos al montar el componente
        });

        return {
            data,
            isLoading,
            error,
            columns,
            collection,
            newDataRoute,
            editDataRoute,
            router,
            fetchData,
            newEntryCategoryData,
            editEntryCategoryData,
            deleteEntryCategoryData,
            newCategoryData,
            editCategoryData,
            deleteCategoryData,
            expandedRows,
            changeWeightData,
            openModal,
            closeModal,
            isModalOpen,
            modalData,
            textWeightField,

            modalGenerateMatchBracketsData,
            openGenerateMatchBracketModal,
            closeGenerateMatchBracketModal,
            isGenerateMatchBracketModalOpen,
            generateMatchBrackets,

            detailsMatchBrackets
        };
    },
}
</script>

<template>
    <CardComponent>
        <DataTable :value="data" tableStyle="min-width: 50rem" dataKey="id" v-model:expandedRows="expandedRows">

            <Column expander style="width: 1rem" />
            <Column header="Division" headerStyle="width:20rem">
                <template #body="{ data }">
                    {{ data.minor_category ? "Menores" : "Mayores" }}
                </template>
            </Column>
            <Column header="Genero" headerStyle="width:20rem">
                <template #body="{ data }">
                    {{ data.gender }}
                </template>
            </Column>
            <Column header="Categoria" headerStyle="width:20rem">
                <template #body="{ data }">
                    {{ data.name }}
                </template>
            </Column>
            <Column header="Cinturón" headerStyle="width:20rem">
                <template #body="{ data }">
                    {{ data.belt.color }}
                </template>
            </Column>


            <template #expansion="{ data, index }">
                <DataTable :value="data.tariff_inscription.inscriptions" dataKey="index" rowGroupMode="subheader">
                    <Column header="#" headerStyle="width:3rem">
                        <template #body="slotProps">
                            {{ slotProps.index + 1 }}
                        </template>
                    </Column>
                    <Column field="athlete.name" header="Atleta"></Column>
                    <Column field="athlete.birthdate" header="Edad"></Column>
                    <Column field="athlete" header="Equipo / Academia">
                        <template #body="slotProps">
                            {{ slotProps.academy_id ? slotProps.academy_id : "Sin Academia" }}
                        </template>
                    </Column>
                    <Column header="Peso en Torneo">
                        <template #body="slotProps">
                            {{ textWeightField(slotProps) }}
                        </template>
                    </Column>

                    <Column header="Acciones" headerStyle="text-align: center"
                        bodyStyle="text-align: center; overflow: visible; ">
                        <template #body="{ data }">
                                <GroupActionButtonsComponent 
                                    @changeWeightData="changeWeightData(data)" 
                                    :isPayment="data.status == 'pagado'"
                                    :weightValid="data.valid_weight"/>
                            
                        </template>
                    </Column>

                    <template #groupfooter="slotProps">
                        <div class="flex justify-start w-full">
                            <div class="flex justify-between w-full ">
                                <div class="flex items-center">
                                    <span class="font-bold mr-2">Total Inscriptos:</span>
                                    <span>{{ data.tariff_inscription.inscriptions.length }} Atleta/s</span>
                                </div>
                                <button v-if="data.match_bracket.length == 0" @click="generateMatchBrackets(data)"
                                    class="inline-flex items-center justify-center gap-2.5 py-2 px-3 text-center font-medium hover:bg-opacity-90 bg-meta-3 text-white rounded-full">
                                    Generar Llaves
                                </button>
                                <button v-if="data.match_bracket.length > 0" @click="detailsMatchBrackets(data)"
                                    class="inline-flex items-center justify-center gap-2.5 py-2 px-3 text-center font-medium hover:bg-opacity-90 bg-meta-3 text-white rounded-full">
                                    Ver Llaves
                                </button>
                            </div>
                        </div>
                    </template>
                </DataTable>
            </template>
        </DataTable>


        <ModalWeightFormComponent 
            :isOpen="isModalOpen" 
            :title="'Cargar Peso'" 
            :data="modalData"
            @close="closeModal" />

        <GenerateMatchBracketsModalFormComponent 
            :isOpen="isGenerateMatchBracketModalOpen"
            :title="'Generar Llaves de Combate'" 
            :data="modalGenerateMatchBracketsData"
            @close="closeGenerateMatchBracketModal" />
    </CardComponent>
</template>
