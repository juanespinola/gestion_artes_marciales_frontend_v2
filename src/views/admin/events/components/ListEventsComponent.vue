<script>
import CardComponent from '@/components/Card/CardComponent.vue';
import useData from '@/composables/useData'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import { FilterMatchMode } from '@primevue/core/api';
import GroupActionButtonsComponent from './GroupActionButtonsComponent.vue';
import { useNotificationStore } from '@/stores/notification';


export default {
    components: { CardComponent, DataTable, Column, GroupActionButtonsComponent, IconField, InputIcon, InputText, FilterMatchMode },
    setup() {
        const notificationStore = useNotificationStore()
        const collection = 'event';
        const newDataRoute = 'NewEvent';
        const editDataRoute = 'EditEvent';
        const router = useRouter();
        const columns = [
            { field: 'description', header: 'Descripción' },
            { field: 'initial_date', header: 'Fecha Inicial' },
            { field: 'final_date', header: 'Fecha Final' },
            { field: 'type_event.description', header: 'Tipo de Evento' },
            { field: 'status_event.description', header: 'Estado' },
        ];
        const data = ref([]);
        const { isLoading, error, fetchAll, destroy } = useData();
        const expandedRows = ref({});
        const filters = ref({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        })

        const fetchData = async () => {
            const response = await fetchAll(collection);
            if (response.success) {
                data.value = response.data;
            }
        };

        const updateRanking = async () => {
            const response = await fetchAll('ranking/update');
            if (response.success) {
                notificationStore.success(null, response?.data.messages)
            }
        };

        const newData = () => {
            router.push({ name: newDataRoute });
        };

        const editData = (id) => {
            router.push({ name: editDataRoute, params: { id } });
        };

        const deleteData = async (id) => {
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
                await fetchData(); // Recargar datos después de eliminar
                notificationStore.success(null, response?.data.messages)
            }
        };

        const handleSanctionsData = (id) => {
            router.push({ name: "ListSanctions", params: { athleteid: id } });
        }

        onMounted(() => {
            fetchData(); // Cargar los datos al montar el componente
        });

        return {
            data,
            isLoading,
            error,
            columns,
            collection,
            filters,
            newDataRoute,
            editDataRoute,
            router,
            fetchData,
            newData,
            editData,
            deleteData,
            expandedRows,
            handleSanctionsData,
            updateRanking
        };
    },
};
</script>

<template>
    <CardComponent>
        <DataTable v-model:filters="filters" :value="data" tableStyle="min-width: 50rem" :paginator="true" :rows="10"
            dataKey="id"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Datos"
            v-model:expandedRows="expandedRows" :globalFilterFields="['description']">
            <template #header>
                <div class="flex justify-between">
                    <IconField>
                        <InputIcon class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Buscar" />
                    </IconField>
                    <!-- <button
                        class="inline-flex items-center justify-center gap-2.5 py-2 px-3 text-center font-medium hover:bg-opacity-90 bg-black text-white rounded-full">Exportar</button> -->
                    <button @click="newData"
                        class="inline-flex items-center justify-center gap-2.5 py-2 px-3 text-center font-medium hover:bg-opacity-90 bg-meta-3 text-white rounded-full">Nuevo</button>
                </div>
            </template>
            <!-- <Column expander style="width: 5rem" /> -->
            <Column header="#" headerStyle="width:3rem">
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" style="width: 30%">
            </Column>
            <Column header="Actualizar Ranking">
                <template #body="{ data }">
                    <button @click="updateRanking" class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90" v-if="data?.status_event?.description.toLowerCase() == 'finalizado' && data?.type_event.description.toLowerCase() == 'torneo'">Actualizar</button>
                </template>
            </Column>
            <Column header="Acciones" headerStyle="width: 40%; text-align: center"
                bodyStyle="text-align: center; overflow: visible">
                <template #body="slotProps">
                    <GroupActionButtonsComponent @editData="editData(slotProps.data.id)"
                        @deleteData="deleteData(slotProps.data.id)" />
                </template>
            </Column>
        </DataTable>
    </CardComponent>
</template>