<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import { FilterMatchMode } from '@primevue/core/api';
import CardComponent from '@/components/Card/CardComponent.vue';
import GroupActionButtonsComponent from './GroupActionButtonsComponent.vue';
import { onMounted, ref } from 'vue'

export default {
    components: { CardComponent, DataTable, Column, GroupActionButtonsComponent, IconField, InputIcon, InputText, FilterMatchMode },
    
    props: {
        data: [],
        columns: [],
        newData: { type: Function, required: true },
        editData: { type: Function, required: true },
        deleteData: { type: Function, required: true },
        isActiveSearchGlobal: false
    },
    setup(props) {
        const filters = ref({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        })

        const capitalizeFirstLetter = (word) => {
            if (!word) return ''; // Maneja casos donde la palabra sea null, undefined o vacía
            return word.charAt(0).toUpperCase() + word.slice(1);
        };

        const setStatusText = (status) => {
            if (typeof status === 'boolean') {
                return status ? 'Activo' : 'Inactivo';
            }

            // Si no es booleano, devuelve el texto tal cual
            return capitalizeFirstLetter(status) || 'Estado desconocido';
        };

        return {
            setStatusText,
            filters,
            // globalFilter
        };
    },
}
</script>


<template>
    <CardComponent>
        <DataTable v-model:filters="filters" :value="data" tableStyle="min-width: 50rem" :paginator="true" :rows="10" dataKey="id"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Datos"
            
            >
            <template #header>
                <div class="flex justify-between">
                    <div>
                        <IconField v-if="isActiveSearchGlobal">
                            <InputIcon class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Buscar" />
                        </IconField>
                    </div>
                    <!-- <button
                        class="inline-flex items-center justify-center gap-2.5 py-2 px-3 text-center font-medium hover:bg-opacity-90 bg-black text-white rounded-full">Exportar</button> -->
                    <button @click="newData"
                        class="inline-flex items-center justify-center gap-2.5 py-2 px-3 text-center font-medium hover:bg-opacity-90 bg-meta-3 text-white rounded-full">Nuevo</button>
                </div>
            </template>
            <Column header="#" headerStyle="width:3rem">
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" style="width: 60%;">
                <template #body="slotProps">
                    <div v-if="col.field == 'status'">
                        <!-- Renderizar algo diferente si el campo es 'status' -->
                        <span>
                            {{ setStatusText(slotProps.data.status) }}
                        </span>
                    </div>
                    <div v-else>
                        <!-- Renderizar el valor normal para otras columnas -->
                        {{ slotProps.data[col.field] }}
                    </div>
                </template>
            </Column>


            <Column header="Acciones" headerStyle="width: 5rem; text-align: center"
                bodyStyle="text-align: center; overflow: visible">
                <template #body="slotProps">
                    <GroupActionButtonsComponent @editData="editData(slotProps.data.id)"
                        @deleteData="deleteData(slotProps.data.id)" />
                </template>
            </Column>

            <!-- <template #paginatorcontainer="{ first, last, page, pageCount, prevPageCallback, nextPageCallback, totalRecords }"  >
                <div class="flex items-center gap-4 border border-primary bg-transparent rounded-full w-full py-1 px-2 justify-between dark:border-strokedark dark:bg-boxdark">
                    <Button icon="pi pi-chevron-left" rounded text @click="prevPageCallback" :disabled="page === 0" />
                    <div class="text-color font-medium">
                        <span class="hidden sm:block">Showing {{ first }} to {{ last }} of {{ totalRecords }}</span>
                        <span class="block sm:hidden">Page {{ page + 1 }} of {{ pageCount }}</span>
                    </div>
                    <Button icon="pi pi-chevron-right" rounded text @click="nextPageCallback" :disabled="page === pageCount - 1" />
                </div>
            </template> -->

        </DataTable>
    </CardComponent>
</template>
