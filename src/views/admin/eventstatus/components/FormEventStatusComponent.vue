<script>

import { useRouter } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import useData from '@/composables/useData'
import { useNotificationStore } from '@/stores/notification';



export default {
    components: {
        
    },
    props: {
        id: {
            type: String,
            required: false,
        },
    },
    setup(props) {
        const notificationStore = useNotificationStore()
        const {
            // object,
            find,
            update,
            create,
        } = useData();
        let collection = 'statusevent';
        const obj = ref({
            description: '',
        });
        const error = ref(null);
        const router = useRouter();
        const isEditing = computed(() => !!props.id);

        const fetchProduct = async () => {
            if (isEditing.value) {
                const response = await find(collection, props.id); // Espera a que la función `find` termine
                if (response.success) {
                    obj.value = response.data
                }
            }
        };

        const saveData = async () => {
            // if (!validateForm()) return; // Detén el proceso si la validación falla
            try {
                if (isEditing.value) {
                    const response = await update(collection, props.id, obj.value);
                    if (!response.success) {
                        Object.keys(response?.message).forEach((key) => {
                            notificationStore.error("Error!", response?.message[key][0])
                        });
                        return;
                    }
                    notificationStore.success("Correcto!", response?.data?.messages)
                    router.go(-1); // Redirige a la lista después de guardar

                } else {
                    const response = await create(collection, obj.value);
                    if (!response.success) {
                        Object.keys(response?.message).forEach((key) => {
                            notificationStore.error("Error!", response?.message[key][0])
                        });
                        return;
                    }
                    notificationStore.success("Correcto!", response?.data?.messages)
                    router.go(-1); // Redirige a la lista después de guardar
                }
            } catch (err) {
                console.error('Error al guardar el registro:', err.message);

            }
        };

        const validateForm = () => {
            const { name, sku, purchasePrice, stock } = obj.value;
            if (!name || !sku || !purchasePrice || !stock) {
                error.value = "Todos los campos son obligatorios.";
                return false;
            }
            if (isNaN(purchasePrice) || isNaN(stock)) {
                error.value = "El precio de compra y el stock deben ser números válidos.";
                return false;
            }
            return true;
        };

        onMounted(() => {
            // if (isEditing.value) {
            //     fetchProduct();
            // }
            if (isEditing.value) fetchProduct();
        });

        watch(() => props.id, (newId) => {
            if (newId) fetchProduct();
        });

        return { obj, isEditing, saveData, error };
    }
}
</script>

<template>
    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">{{ isEditing ? 'Editar' : 'Nuevo'
                }}</h3>
        </div>
        <div class="p-7">
            <form @submit.prevent="saveData">
                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                            for="description">Descripción</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text" name="description" id="description" v-model="obj.description">
                    </div>
                </div>

                <div class="flex justify-end gap-4.5">
                    <button
                        class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                        type="button" @click="$router.go(-1)"> Cancelar </button>
                    <button
                        class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                        type="submit"> Guardar </button>
                </div>
            </form>
        </div>
    </div>
</template>
