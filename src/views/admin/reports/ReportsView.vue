<script>
import SelectComponent from '@/components/Select/SelectComponent.vue';
import useData from '@/composables/useData';
import { useUserStore } from '@/stores/user';
import { ref, computed, onMounted, watch } from 'vue'
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
    setup(props) {
        const { create, fetchAll, } = useData();
        const userStore = useUserStore()
        const collection = 'getreports';
        const obj = ref({
            federation_id: userStore.user.federation_id,
            association_id: '',
            type_report: '',
        });
        const data = ref([])
        const error = ref({});
        const associations = ref([])
        const columns = ref([]);


        // Función para obtener los datos si estamos en edición
        const fetchProduct = async () => {
            const response = await create(collection, obj.value);
            if (response.success) {
                data.value = response.data;
            }
        };

        // Llamar a fetchProduct cuando el componente se monta o cuando cambia el id
        onMounted(async () => {
            await fetchAssociations(userStore.user.federation_id)
        });

        const fetchAssociations = async (federation_id) => {
            const response = await fetchAll(`athlete/associations/${federation_id}`);
            if (response.success) {
                associations.value = response.data
            }
        };

        const handleAssociationSelected = (itemSelected) => {
            obj.value.association_id = (itemSelected.id)
        }

        const handleTypeReportSelected = (itemSelected) => {
            obj.value.type_report = (itemSelected.id)
            console.log(itemSelected)
            if (itemSelected.id == 'getTotalAthleteInEventWithPrice') {

                columns.value = [
                    { field: 'total_atletas_inscriptos', header: 'Total Inscriptos' },
                    { field: 'total_ganancia', header: 'Ganancias' },
                    { field: 'categoria', header: 'Categorias' },
                    { field: 'evento', header: 'Eventos' },
                ];
            } else {
                columns.value = [
                    { field: 'total_atletas_inscriptos', header: 'Total Inscriptos' },
                    { field: 'evento', header: 'Eventos' },
                ];
            }
        }

        return {
            obj,
            error,
            associations,
            handleAssociationSelected,
            handleTypeReportSelected,
            fetchProduct,
            data,
            columns
        }
    },

}
</script>

<template>
    <div class="grid grid-cols-5 gap-8">
        <div class="col-span-5 xl:col-span-5">
            <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
                    <h3 class="font-medium text-black dark:text-white">{{ 'Reporteria' }}</h3>
                </div>
                <div class="p-7">
                    <form @submit.prevent="fetchProduct">

                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <SelectComponent :data="[
                                    { id: 'getTotalAthleteInEventWithPrice', description: 'Ganancias por Evento' },
                                    { id: 'getTotalAthleteInEvent', description: 'Inscriptos por Evento' },
                                ]" :title="'Tipo de Reporte'" :selectedOption="obj.type_report"
                                    @obj-selected="handleTypeReportSelected" />
                            </div>
                        </div>

                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <SelectComponent :data="associations" :title="'Asociaciones'"
                                    :selectedOption="obj.association_id" @obj-selected="handleAssociationSelected" />
                            </div>
                        </div>

                        <div class="flex justify-end gap-4.5">
                            <button
                                class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                                type="submit"> Confirmar </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-5 gap-8 mt-5" v-if="data.length > 0">
        <div class="col-span-5 xl:col-span-5">
            <CardComponent>
                <DataTable :value="data" tableStyle="min-width: 50rem" :paginator="true" :rows="10" dataKey="id"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Datos">
                    <template #header>
                        <div class="flex justify-between">
                            <div></div>
                            <button
                                class="inline-flex items-center justify-center gap-2.5 py-2 px-3 text-center font-medium hover:bg-opacity-90 bg-black text-white rounded-full">Exportar</button>
                        </div>
                    </template>
                    <Column header="#" headerStyle="width:3rem">
                        <template #body="slotProps">
                            {{ slotProps.index + 1 }}
                        </template>
                    </Column>
                    <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">

                    </Column>
                </DataTable>
            </CardComponent>
        </div>
    </div>
</template>