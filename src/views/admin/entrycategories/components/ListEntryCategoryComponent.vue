<script>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import useData from '@/composables/useData';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import GroupActionButtonsComponent from './GroupActionButtonsComponent.vue'
import CardComponent from '@/components/Card/CardComponent.vue';
import { useNotificationStore } from '@/stores/notification';

export default {
    components: {
        DataTable,
        Column,
        GroupActionButtonsComponent,
        CardComponent
    },
    props: {
        eventid: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const notificationStore = useNotificationStore()
        const collection = 'entrycategories';
        const newDataRoute = 'NewEntryCategory';
        const editDataRoute = 'EditEntryCategory';
        const router = useRouter();
        const columns = [
            { field: 'cinturon.color', header: 'Cinturón' },
        ];
        const data = ref([]);
        const { isLoading, error, fetchAll, destroy } = useData();
        const expandedRows = ref({});

        const fetchData = async (eventid) => {
            const response = await fetchAll(`${collection}/event/${eventid}`);
            if (response.success) {
                data.value = response.data;
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
                notificationStore.success(null, response?.data.messages)
            }
        };

        const newCategoryData = (data) => {
            router.push({ name: newDataRoute, params: { eventid: props.eventid }, query: { beltid: data.cinturon.id } });
        };

        // aca debemos pasar el color del cinturon para que se cree la categoria
        const editCategoryData = (id) => {
            router.push({ name: editDataRoute, params: { id, eventid: props.eventid } });
        };


        const tariffCategoryData = (data) => {
            console.log(data)
            router.push({ name: 'NewTariffCategory', params: { id:data.id, eventid: props.eventid } });
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
                notificationStore.success(null, response?.data.messages)
            }
        };


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
            tariffCategoryData,
            expandedRows,
        };
    },
}
</script>

<template>
    <CardComponent>
        <DataTable :value="data" tableStyle="min-width: 50rem" :paginator="true" :rows="10" dataKey="id"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Datos"
            v-model:expandedRows="expandedRows">
            <template #header>
                <div class="flex justify-between">
                    <div></div>
                    <button @click="newEntryCategoryData"
                        class="inline-flex items-center justify-center gap-2.5 py-2 px-3 text-center font-medium hover:bg-opacity-90 bg-meta-3 text-white rounded-full">Nuevo</button>
                </div>
            </template>
            <Column expander style="width: 5rem" />
            <Column header="#" headerStyle="width:3rem">
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" style="width: 60%">
            </Column>
            <Column header="Acciones" headerStyle="width: 5rem; text-align: center"
                bodyStyle="text-align: center; overflow: visible">
                <template #body="slotProps">
                    <GroupActionButtonsComponent @newData="newCategoryData(slotProps.data)" />
                </template>
            </Column>
            <template #expansion="slotProps">
                <DataTable :value="slotProps.data.categories">
                    <Column header="#" headerStyle="width:3rem">
                        <template #body="slotProps">
                            {{ slotProps.index + 1 }}
                        </template>
                    </Column>
                    <Column field="name" header="Categoria"></Column>
                    <Column header="Peso">
                        <template #body="slotProps">
                            Entre {{ slotProps.data.min_weight }} | {{ slotProps.data.max_weight }} Kg.
                        </template>
                    </Column>
                    <Column field="gender" header="Genero"></Column>
                    <Column header="Edad">
                        <template #body="slotProps">
                            Entre {{ slotProps.data.min_age }} | {{ slotProps.data.max_age }} Años.
                        </template>
                    </Column>
                    <Column field="clothes" header="Indumentaria"></Column>
                    <Column header="Acciones" headerStyle="width: 5rem; text-align: center"
                        bodyStyle="text-align: center; overflow: visible">
                        <template #body="{data}">
                            <GroupActionButtonsComponent 
                                @editData="editCategoryData(data.id)"
                                @deleteData="deleteCategoryData(data.id)"
                                @tariffCategoryData="tariffCategoryData(data)" 
                                :hasTariffToPayment="data.tariff_inscription"/>
                        </template>
                    </Column>
                </DataTable>

            </template>

        </DataTable>
    </CardComponent>
</template>
