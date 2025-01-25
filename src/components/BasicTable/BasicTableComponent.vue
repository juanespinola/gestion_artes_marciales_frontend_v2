<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import CardComponent from '@/components/Card/CardComponent.vue';
import GroupActionButtonsComponent from './GroupActionButtonsComponent.vue';

export default {
    components: { CardComponent, DataTable, Column, GroupActionButtonsComponent },
    props: {
        data: [],
        columns: [],
        newData: { type: Function, required: true},
        editData: { type: Function, required: true},
        deleteData: { type: Function, required: true},
    },
    setup(){
     
    },
}
</script>


<template>
    <CardComponent>
        <DataTable :value="data" tableStyle="min-width: 50rem" :paginator="true" :rows="10" dataKey="id"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Datos">
            <template #header>
                <div class="flex justify-between">
                    <button
                        class="inline-flex items-center justify-center gap-2.5 py-2 px-3 text-center font-medium hover:bg-opacity-90 bg-black text-white rounded-full">Exportar</button>
                    <button @click="newData"
                        class="inline-flex items-center justify-center gap-2.5 py-2 px-3 text-center font-medium hover:bg-opacity-90 bg-meta-3 text-white rounded-full">Nuevo</button>
                </div>
            </template>
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
                    <GroupActionButtonsComponent 
                        @editData="editData(slotProps.data.id)" 
                        @deleteData="deleteData(slotProps.data.id)"
                    />
                </template>
            </Column>

        </DataTable>
    </CardComponent>
</template>