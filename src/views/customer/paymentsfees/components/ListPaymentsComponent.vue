<script>
import AdminLayout from '@/layouts/AdminLayout.vue';
import CardComponent from '@/components/Card/CardComponent.vue';
import useData from '@/composables/useData';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useUserStore } from '@/stores/user';

export default {
    components: { AdminLayout, CardComponent, DataTable, Column },
    setup() {
        const collection = 'athlete/getPayments';
        const newDataRoute = 'NewRequest';
        const editDataRoute = 'EditRequest';
        const router = useRouter();
        const userStore = useUserStore()

        const obj = ref({
            athlete_id: userStore.user.id,
            federation_id: userStore.user.federation.id,
            association_id: userStore.user.federation.association.id,
        });

        const data = ref([]);
        const { isLoading, error, create, destroy } = useData();

        const fetchData = async () => {
            const response = await create(collection, obj.value);
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
            collection,
            newDataRoute,
            editDataRoute,
            router,
            fetchData,
            newData,
            editData,
            deleteData,
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
            <!-- <template #header>
                <div class="flex justify-between">
                    <div></div>
                    <button @click="newData"
                        class="inline-flex items-center justify-center gap-2.5 py-2 px-3 text-center font-medium hover:bg-opacity-90 bg-meta-3 text-white rounded-full">Nuevo</button>
                </div>
            </template> -->
            <Column header="#" headerStyle="width:3rem">
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>

            <Column header="Motivo de Pago">
                <template #body="{ data }">
                    {{ data.membership ? "Pago de Membresia" : "Pago de Inscripción" }}
                </template>
            </Column>

            <Column header="Método de Pago">
                <template #body="{ data }">
                    {{ data.payment_gateway }}
                </template>
            </Column>


            <Column header="Precio">
                <template #body="{ data }">
                    {{ data.membership ? data.membership.amount_fee	: data.inscription.tariff_inscription.price }} Gs.
                </template>
            </Column>

            <Column field="status" header="Estado">
                <template #body="{ data }">
                    {{ data.status }}
                </template>
            </Column>

            <!-- <Column header="Acciones" headerStyle="width:3rem; text-align: center"
                bodyStyle="text-align: center; overflow: visible">
                <template #body="slotProps">
                    <button @click="editData(slotProps.data.id)"
                        class="inline-flex items-center justify-center gap-2.5 py-2 px-4 text-center font-medium hover:bg-opacity-90 text-white rounded-full bg-[#817363]">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M12 2v20" />
                                <path d="M16 6H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H8" />
                            </svg>
                        </span>
                        Pagar
                    </button>
                </template>
            </Column> -->
        </DataTable>
    </CardComponent>
</template>
