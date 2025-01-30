<script>
import useData from '@/composables/useData'
import { ref, onMounted, computed, watch } from 'vue'

export default {
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
    setup(props, {emit}) {
        const isEditing = computed(() => !!props.id);
        const obj = ref({
            event_weight: ''
        })
        const collection = 'inscription';
        const { update } = useData();

        // Función para obtener los datos si estamos en edición
        const fetchProduct = async () => {

            if (isEditing.value) {
                const response = await find(collection, props.id);
                if (response.success) {
                    obj.value = response.data;
                }
            }
        };


        // Función para guardar los datos (crear o actualizar)
        const saveData = async () => {
            try {
                // if (isEditing.value) {
                    const response = await update(collection, props.data.id, obj.value);
                    if (response.success) {
                        console.log('Producto actualizado:', obj.value);
                        emit('close')
                    }
                // }
            } catch (err) {
                console.error('Error al guardar el registro:', err.message);
            }
        };


        onMounted(() => {
            if (isEditing.value) fetchProduct();
        });

        watch(() => props.data.id, (newId) => {
            if (newId) fetchProduct();
        });

        return {
            obj,
            saveData,
            fetchProduct
        }
    },
};
</script>

<template>
    <div v-if="isOpen" class="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 px-4">
        <div class="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
            <form @submit.prevent="saveData">

                <h3 class="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                    Cargar Peso del Atleta
                </h3>
                <span class="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <!-- <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="event_weight">
                            Cargar Peso del Atleta
                        </label> -->
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="number" name="event_weight" id="event_weight" v-model="obj.event_weight">
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