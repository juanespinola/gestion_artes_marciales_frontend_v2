<script>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import useData from '@/composables/useData';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import GroupActionButtonsComponent from './GroupActionButtonsComponent.vue'
import ModalWeightFormComponent from './ModalWeightFormComponent.vue';

export default {
    components: {
        DataTable,
        Column,
        GroupActionButtonsComponent,
        ModalWeightFormComponent
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
        const expandedRows = ref({});

        const isModalOpen = ref(false)
        const modalData = ref({})

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
            if (response.success) {
                await fetchData(props.eventid); // Recargar datos después de eliminar
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
            if (response.success) {
                await fetchData(props.eventid); // Recargar datos después de eliminar
            }
        };

        const changeWeightData = (data) => {
            console.log(data)
            openModal(data)
        }
        const openModal = (data) => {
            modalData.value = data
            isModalOpen.value = true;
        }
        const closeModal = () => {
            isModalOpen.value = false;
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
            modalData
        };
    },
}
</script>

<template>
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
            <DataTable :value="data.tariff_inscription.inscriptions" dataKey="id" rowGroupMode="subheader">
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
                        {{ slotProps.event_weight ? slotProps.event_weight : 'Sin Peso' }}
                    </template>
                </Column>

                <Column header="Acciones" headerStyle="text-align: center"
                    bodyStyle="text-align: center; overflow: visible">
                    <template #body="{data}">
                        <GroupActionButtonsComponent 
                            @changeWeightData="changeWeightData(data)"
                            :isPayment="true" 
                            :weightValid="true" />

                        <ModalWeightFormComponent 
                            :isOpen="isModalOpen" 
                            :title="'Cargar Peso'" 
                            :data="modalData"
                            @close="closeModal" 
                        />
                    </template>
                </Column>

                <template #groupfooter="slotProps">
                    <div class="flex justify-start w-full">
                        <div class="flex justify-between w-full ">
                            <div class="flex items-center">
                                <span class="font-bold mr-2">Total Inscriptos:</span>
                                <span>{{ data.tariff_inscription.inscriptions.length }} Atleta/s</span>
                            </div>
                            <button
                                class="inline-flex items-center justify-center gap-2.5 py-2 px-3 text-center font-medium hover:bg-opacity-90 bg-meta-3 text-white rounded-full">
                                Generar Llaves
                            </button>
                        </div>
                    </div>
                </template>

            </DataTable>
        </template>

    </DataTable>

</template>
