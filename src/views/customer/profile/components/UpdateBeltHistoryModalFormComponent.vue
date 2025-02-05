<script>
import useData from '@/composables/useData'
import { ref, onMounted, computed, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import SelectComponent from '@/components/Select/SelectComponent.vue';
import DatePicker from 'primevue/datepicker';
import { useUserStore } from '@/stores/user';

export default {
    components: {
        SelectComponent, DatePicker
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
            required: false
        },  // Mensaje dentro del modal
    },
    emits: ['close'], // Define el evento para cerrar el modal
    setup(props, { emit }) {
        const isEditing = computed(() => !!props.data.id);
        const userStore = useUserStore()
        const obj = ref({
            id:'',
            belt_id: '',
            athlete_id: '',
            federation_id: '',
            achieved: '',
            promoted_by: '',
        })
        const collection = 'athlete/belthistory';
        const { create, fetchAll } = useData();
        const target = ref(null);
        const belts = ref([])
        // Función para obtener los datos si estamos en edición
        const fetchProduct = async () => {
            if (isEditing.value) {
                obj.value.belt_id = props.data.belt_id
                // obj.value.athlete_id = props.data.athlete_id
                // obj.value.federation_id = props.data.federation_id
                
                obj.value.id = props.data.id
                obj.value.achieved =  props.data.achieved
                obj.value.promoted_by = props.data.promoted_by
            }
        };

        // Función para guardar los datos (actualizar)
        const saveData = async () => {
            try {
                if (isEditing.value) {
                    const response = await create(collection, obj.value);
                    if (response.success) {
                        console.log('Producto actualizado:', obj.value);
                        emit('close')
                    }
                }
            } catch (err) {
                console.error('Error al guardar el registro:', err.message);
            }
        };

        const fetchBelts = async () => {
            const response = await create('athlete/belts', { federation_id: userStore.user.federation.id });
            if (response.success) {
                belts.value = response.data
            }
        };



        onMounted(async () => {
            fetchBelts()
            await fetchProduct();
        });

        watch(() => props.data.id, async (newId) => {
            if (newId) {
                fetchBelts()
                await fetchProduct();
            } else {
                obj.value.belt_id = null
                obj.value.athlete_id = userStore.user.id
                obj.value.federation_id = userStore.user.federation.id
                obj.value.achieved = ''
                obj.value.promoted_by = ''
            }
        });


        // Click fuera para cerrar el dropdown
        onClickOutside(target, () => {
            emit('close')
        });

        const handleBeltSelected = (itemSelected) => {
            obj.value.belt_id = (itemSelected.id)
        }


        return {
            obj,
            saveData,
            fetchProduct,
            target,
            belts,
            handleBeltSelected
        }
    },
};
</script>

<template>
    <div v-if="isOpen"
        class="fixed top-0 left-0 z-99 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5">
        <div ref="target" class="w-full max-w-150  rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark">
            <form @submit.prevent="saveData">
                <h3 class="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                    Historial de Cinturón
                </h3>
                <span class="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>

                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <SelectComponent :data="belts" :title="'Cinturón'" :selectedOption="obj.belt_id"
                            @obj-selected="handleBeltSelected" :isDisabled="obj.belt_id !== ''"/>
                    </div>
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="name">Fecha de
                            obtención</label>
                        <DatePicker v-model="obj.achieved" size="large" />
                    </div>
                </div>


                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                            for="promoted_by">Otorgado Por</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text" name="promoted_by" id="promoted_by" v-model="obj.promoted_by">
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
                            class="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                            :class="{ 'disabled:cursor-default disabled:bg-whiter dark:focus:border-primary dark:disabled:bg-black opacity-50': !obj.athlete_id_winner }">
                            Aceptar
                        </button>
                    </div>
                </div>
            </form>
        </div>

    </div>
</template>