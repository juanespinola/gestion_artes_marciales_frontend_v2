<script>
import { onClickOutside } from '@vueuse/core'
import { ref, onMounted, computed, watch } from 'vue'

export default {
    props: {
        isOpen: {
            type: Boolean,
            required: true
        },
    }, // Controla si el modal está abierto
    emits: ['close', 'accept'], // Define el evento para cerrar el modal
    setup(props, { emit }) {
        const target = ref(null);
        // Click fuera para cerrar el dropdown
        onClickOutside(target, () => {
            emit('close')
        });

        const handleRouteMinorAuthorization = () => {
            emit('accept');
            emit('close')
        }

        return {
            handleRouteMinorAuthorization
        }
    }

}
</script>


<template>
    <div v-if="isOpen"
        class="fixed top-0 left-0 z-99 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5">
        <div ref="target" class="w-full max-w-150  rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark">
            <h3 class="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                Autorización de Menor
            </h3>
            <div class="-mx-3 flex flex-wrap gap-y-4">
                <div class="p-7">
                    Solicitamos un documento para la categoría menor de edad, desea presentar su Autorización?
                </div>

                <div class="w-full px-3 2xsm:w-1/2">
                    <button
                        class="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                        @click="$emit('close')">
                        Cancel
                    </button>
                </div>
                <div class="w-full px-3 2xsm:w-1/2">
                    <button @click="handleRouteMinorAuthorization"
                        class="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90">
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>