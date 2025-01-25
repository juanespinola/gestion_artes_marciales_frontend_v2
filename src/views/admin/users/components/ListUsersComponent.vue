<script>
import AdminLayout from '@/layouts/AdminLayout.vue';
import CardComponent from '@/components/Card/CardComponent.vue';
import useData from '@/composables/useData'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import GroupActionButtonsComponent from '@/components/BasicTable/GroupActionButtonsComponent.vue';




export default {
    components: { AdminLayout, CardComponent, DataTable, Column, GroupActionButtonsComponent },
    setup() {
        const collection = 'user';
        const newDataRoute = 'NewUser';
        const editDataRoute = 'EditUser';
        const router = useRouter();
        const columns = [
            { field: 'name', header: 'Descripción' },
            { field: 'email', header: 'Email' },
            // { field: 'roles', header: 'Roles' },
        ];
        const data = ref([]);
        const { isLoading, error, fetchAll, destroy } = useData();
        const expandedRows = ref({});
        
        const fetchData = async () => {
            const response = await fetchAll(collection);
            if (response.success) {
                data.value = response.data;
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
            if (response.success) {
                await fetchData(); // Recargar datos después de eliminar
            }
        };

        onMounted(() => {
            fetchData(); // Cargar los datos al montar el componente
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
            newData,
            editData,
            deleteData,
            expandedRows,

        };
    },
};
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
                    <button
                        class="inline-flex items-center justify-center gap-2.5 py-2 px-3 text-center font-medium hover:bg-opacity-90 bg-black text-white rounded-full">Exportar</button>
                    <button @click="newData"
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
                    <GroupActionButtonsComponent @editData="editData(slotProps.data.id)"
                        @deleteData="deleteData(slotProps.data.id)" />
                </template>
            </Column>
            <template #expansion="slotProps">
                <div class="p-4">
                    <h5>Roles y Permisos</h5>
                    <DataTable :value="slotProps.data.roles">
                        <Column header="#" headerStyle="width:3rem">
                            <template #body="slotProps">
                                {{ slotProps.index + 1 }}
                            </template>
                        </Column>
                        <Column field="name" header="Roles"></Column>
                    </DataTable>
                </div>
            </template>

        </DataTable>
    </CardComponent>
</template>