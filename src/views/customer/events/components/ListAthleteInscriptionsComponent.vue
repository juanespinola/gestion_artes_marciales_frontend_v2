<script>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import useData from '@/composables/useData';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';


export default {
    components: {
        DataTable,
        Column,
    },
    props: {
        data: {
            required: true,
        },
    },
    setup(props) {
        const collection = 'inscription';
        const router = useRouter();
        const columns = [];
        const data = ref([]);
        const { isLoading, error, create, destroy } = useData();
        const expandedRows = ref({});

       

        const fetchData = async () => {
            console.log(props.data)    
            const response = await create(`${collection}`, { event_id: props.data.id })
            if (response.success) {
                data.value = response.data
            }

        };


        const detailsMatchBrackets = (data) => {
            router.push({ name: "EventsAthleteMatchBracket", params: { id: props.data.id, entrycategoryid: data.id }})
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
            fetchData(); // Cargar los datos al montar el componente
        });

        return {
            data,
            isLoading,
            error,
            columns,
            collection,
            router,
            fetchData,
            expandedRows,
            textWeightField,
            detailsMatchBrackets,
        };
    },
}
</script>

<template>
    <div>
        <DataTable :value="data" tableStyle="min-width: 50rem" dataKey="id" v-model:expandedRows="expandedRows" :loading="isLoading">
            <template #loading> Cargando Datos. Favor espere... </template>
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
                <DataTable :value="data?.tariff_inscription?.inscriptions" dataKey="index" rowGroupMode="subheader">
                    <template #empty> Sin Inscriptos. </template>
                    
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

                    <template #groupfooter="slotProps">
                        <div class="flex justify-start w-full">
                            <div class="flex justify-between w-full ">
                                <div class="flex items-center">
                                    <span class="font-bold mr-2">Total Inscriptos:</span>
                                    <span>{{ data.tariff_inscription.inscriptions.length }} Atleta/s</span>
                                </div>
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

    </div>
</template>
