<script>
import useData from '@/composables/useData'
import { ref, onMounted, computed, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useNotificationStore } from '@/stores/notification';


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
        const notificationStore = useNotificationStore()
        const isEditing = computed(() => !!props.data.id);
        const obj = ref({
            event_weight: ''
        })
        const collection = 'requestautorization';
        const { create } = useData();
        const target = ref(null);
        // Función para obtener los datos si estamos en edición
        const fetchProduct = async () => {
            if (isEditing.value) {
                obj.value.event_weight = props.data.event_weight
            }
        };


        // Función para guardar los datos (actualizar)
        const saveData = async () => {
            try {
                const response = await create(collection, props.data);
                if (response.success) {
                    if(response.data.data == 'membresia_activa'){
                        notificationStore.warn("Atención!", response?.data?.messages)
                        emit('close')
                    } else {
                        notificationStore.success(null, response?.data?.messages)
                        emit('close')
                    }
                }
                if(!response.success){
                    Object.keys(response?.message).forEach((key) => {
                        notificationStore.error("Error!",response?.message[key][0])
                    });
                    return;
                } 
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

        
        onClickOutside(target, () => {
            emit('close')
        });

        return {
            obj,
            saveData,
            fetchProduct,
            target
        }
    },
};
</script>

<template>
    <div v-if="isOpen" class="fixed top-0 left-0 z-100 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5">
        <div ref="target" class="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
            <form @submit.prevent="saveData">
                <h3 class="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                    Deseas Solicitar membresia?
                </h3>
                <span class="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <p>Tenga en cuenta que se le generaran unas cuotas mensuales por año</p>
                    </div>
                </div>

                <div class="-mx-3 flex flex-wrap gap-y-4">
                    <div class="w-full px-3 2xsm:w-1/2">
                        <button
                            class="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                            @click="$emit('close')">
                            Cancelar
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