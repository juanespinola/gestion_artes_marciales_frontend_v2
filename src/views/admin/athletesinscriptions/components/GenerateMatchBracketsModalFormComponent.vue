<script>
import useData from '@/composables/useData'
import { ref, onMounted, computed, watch } from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { onClickOutside } from '@vueuse/core'
import SelectComponent from '@/components/Select/SelectComponent.vue';
import { useNotificationStore } from '@/stores/notification';

export default {
    components: {
        DataTable,
        Column,
        SelectComponent,
    },
    props: {
        isOpen: {
            type: Boolean,
            required: true
        },  // Controla si el modal está abierto
        title: {
            type: String,    // Título del modal
            required: true
        },
        data: {
            required: true
        },  // Mensaje dentro del modal
    },
    emits: ['close'], // Define el evento para cerrar el modal
    setup(props, { emit }) {
        const notificationStore = useNotificationStore()
        const isEditing = computed(() => !!props.data.id);
        const obj = ref({
            athlete: [],
            type_bracket: '',
            event_id: '',
            quadrilateral: '',
            entry_category_id: '',
            match_timer: '',
        })
        const collection = 'matchbracket/generate';
        const { create } = useData();
        const target = ref(null);
        const listQuadrilateral = ref([]);


        // Función para obtener los datos si estamos en edición
        const fetchProduct = async () => {
            if (isEditing.value) {
                obj.value.athlete = props.data.tariff_inscription.inscriptions.filter((athlete) => athlete.valid_weight && (athlete.status == 'pagado') )
                obj.value.quadrilateral = props.data.tariff_inscription.quadrilateral;
                obj.value.entry_category_id = props.data.tariff_inscription.entry_category_id;
                obj.value.event_id = props.data.event_id;
                // obj.value.type_bracket = props.data.type_bracket;
                // obj.value.match_timer = props.data.match_timer;
            }        
        };


        // Función para guardar los datos (crear o actualizar)
        const saveData = async () => {
            try {
                if (isEditing.value) {
                    const response = await create(collection, obj.value);
                    if (response.success) {
                        console.log('Producto actualizado:', obj.value);
                        emit('close')
                    }
                    if(!response.success){
                        Object.keys(response?.message).forEach((key) => {
                            notificationStore.error("Error!",response?.message[key][0])
                        });
                        return;
                    }
                }
            } catch (err) {
                console.error('Error al guardar el registro:', err.message);
            }
        };


        onMounted(() => {
            generateRingMat(props.data.event?.quantity_quadrilateral)
            if (isEditing.value) fetchProduct();
        });

        watch(() => props.data.id, (newId) => {
            generateRingMat(props.data.event.quantity_quadrilateral)
            if (newId) fetchProduct();
        });

        // Click fuera para cerrar el dropdown
        onClickOutside(target, () => {
            emit('close')
        });

        const generateRingMat = (quantity_quadrilateral) => {    
            listQuadrilateral.value = Array.from({ length: quantity_quadrilateral }, (_, i) => {
                return { id: 1 + i, description: `Mat ${1 + i}` };
            });
        }

        const handleBracketTypeSelected = (itemSelected) => {
            obj.value.type_bracket = (itemSelected.id)
        }

        const handleQuantityQuadrilateralSelected = (itemSelected) => {
            obj.value.quadrilateral = (itemSelected.id)
        }

        return {
            obj,
            saveData,
            fetchProduct,
            target,
            handleBracketTypeSelected,
            handleQuantityQuadrilateralSelected,
            listQuadrilateral
        }
    },
};
</script>

<template>
    <div v-if="isOpen" class="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5">
        <div ref="target"  class="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
            <form @submit.prevent="saveData" >
                <h3 class="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                    Generar Llaves de Combate
                </h3>
                <DataTable :value="obj.athlete" dataKey="id" scrollable
                    scrollHeight="200px">
                    <Column header="#" headerStyle="width:3rem">
                        <template #body="slotProps">
                            {{ slotProps.index + 1 }}
                        </template>
                    </Column>
                    <Column field="athlete.name" header="Atleta"></Column>
                </DataTable>

                <div class="my-5.5 flex flex-col gap-5.5">
                    <div class="w-full">
                        <SelectComponent 
                            :data="listQuadrilateral" 
                            :title="'Nro de Cuadrilateros'" 
                            :selectedOption="obj.quadrilateral"
                            @obj-selected="handleQuantityQuadrilateralSelected" 
                        />
                    </div>
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="match_timer">Fecha
                            Tiempo de Combate</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="time" name="match_timer" id="match_timer" v-model="obj.match_timer">
                    </div>
                </div>


                <div class="my-5.5 flex flex-col gap-5.5">
                    <div class="w-full">
                        <SelectComponent 
                            :data="[
                                { id: 'single_elimination', name: 'Single Elimination' }
                            ]" 
                            :title="'Tipo de Llave'" 
                            :selectedOption="obj.type_bracket"
                            @obj-selected="handleBracketTypeSelected" 
                        />
                    </div>
                </div>


                <div class="-mx-3 flex flex-wrap gap-y-4">
                    <div class="w-full px-3 2xsm:w-1/2">
                        <button
                            class="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                            @click="$emit('close')">
                            Cancel
                        </button>
                    </div>
                    <div class="w-full px-3 2xsm:w-1/2">
                        <button type="submit"
                            class="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90">
                            Aceptar
                        </button>
                    </div>
                </div>
            </form>
        </div>

    </div>
</template>