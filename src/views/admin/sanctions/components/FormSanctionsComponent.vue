<script>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import useData from '@/composables/useData';
import Editor from 'primevue/editor'
import SelectComponent from '@/components/Select/SelectComponent.vue';
import { useNotificationStore } from '@/stores/notification';

export default {
    components: {
        Editor,
        SelectComponent,
    },
    props: {
        id: {
            type: String,
            required: false,
        },
        athleteid: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const notificationStore = useNotificationStore()
        const { find, update, create } = useData();
        const collection = 'sanction';
        const obj = ref({
            description: '',
            comments: '',
            athlete_id: props.athleteid,
            status: '',
        });
        const error = ref(null);
        const router = useRouter();
        const isEditing = computed(() => !!props.id);

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

        // Función de validación
        const validateForm = () => {
            const { description } = obj.value;
            if (!description) {
                error.value = "La descripción es obligatoria.";
                return false;
            }
            return true;
        };

        // Llamar a fetchProduct cuando el componente se monta o cuando cambia el id
        onMounted(async () => {
            if (isEditing.value) await fetchProduct();
        });

        watch(() => props.id, async (newId) => {
            if (newId) await fetchProduct();
        });

        const handleDescriptionSelected = (itemSelected) => {
            obj.value.description = (itemSelected.id)
        }

        const handleStatusSelected = (itemSelected) => {
            obj.value.status = JSON.parse(itemSelected.id)
        }

        return { 
            obj, 
            isEditing, 
            saveData, 
            error, 
            validateForm, 
            handleDescriptionSelected,
            handleStatusSelected,
        };
    }
}
</script>

<template>
    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">{{ isEditing ? 'Editar' : 'Nuevo' }}</h3>
        </div>
        <div class="p-7">
            <form @submit.prevent="saveData">

                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <SelectComponent :data="[
                                { id: 'falta_cometida', name: 'Falta Cometida' }, 
                                { id: 'falta_economica', name: 'Falta Económica' }
                            ]"
                            :title="'Tipo de Sanción'" :selectedOption="obj.description" @obj-selected="handleDescriptionSelected" />
                    </div>
                </div>

                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <SelectComponent :data="[{ id: 'true', name: 'Activo' }, { id: 'false', name: 'Inactivo' }]"
                            :title="'Estado'" :selectedOption="obj.status" @obj-selected="handleStatusSelected" />
                    </div>
                </div>

                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                            for="comments">Motivo</label>
                        <Editor v-model="obj.comments" editorStyle="height: 300px" />
                    </div>
                </div>

                <div class="flex justify-end gap-4.5">
                    <button
                        class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                        type="button" @click="$router.go(-1)">Cancelar</button>
                    <button
                        class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                        type="submit"> Guardar</button>
                </div>
            </form>
        </div>
    </div>
</template>
