<script>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import useData from '@/composables/useData';
import Editor from 'primevue/editor'

import DatePicker from 'primevue/datepicker';
import SelectComponent from '@/components/Select/SelectComponent.vue';
import FloatLabel from 'primevue/floatlabel';
import { useUserStore } from '@/stores/user';

export default {
    components: {
        Editor,
        SelectComponent,
        DatePicker,
        FloatLabel
    },
    props: {
        id: {
            type: String,
            required: false,
        },
    },
    setup(props) {
        const { find, update, create } = useData();
        const collection = 'minor_authorization';
        const obj = ref({
            route_file: '',
            authorized: '',
        });

        const userStore = useUserStore()

        const error = ref(null);
        const router = useRouter();
        const isEditing = computed(() => !!props.id);

        // Función para obtener los datos si estamos en edición
        const fetchProduct = async () => {
            const response = await find(collection, props.id);
            if (response.success) {
                obj.value.route_file = response.data.route_file;
                obj.value.authorized = response.data.authorized;
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


        return { 
            obj, 
            isEditing, 
            saveData, 
            error, 
            validateForm 
        };
    }
}
</script>

<template>
    <div class="grid grid-cols-1 gap-8">
        <div class="col-span-5 xl:col-span-3">
            <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <form @submit.prevent="saveData">
                    <div class="border-b border-stroke py-4 px-7 dark:border-strokedark flex justify-between">
                        <h3 class="font-medium text-black dark:text-white">{{ isEditing && `Autorizacion Menor para
                            ${obj?.athlete?.name}` }}
                        </h3>
                    </div>

                    <div class="p-7">
                        <div class="p-4 sm:p-6 xl:p-10">
                            <div class="relative">
                                <div id="pane" class="overflow-hidden" style="cursor: ew-resize;">
                                    <iframe title="PDF Document" width="900" height="600" :src="obj.route_file">
                                    </iframe>
                                </div>
                                <div id="ghostpane" class="absolute left-0 top-0 duration-300 ease-in-out"></div>
                            </div>
                        </div>

                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <label for="authorized" class="flex cursor-pointer select-none items-center">
                                    <div class="relative">
                                        <input type="checkbox" id="authorized" class="sr-only" v-model="obj.authorized">
                                        <div class="mr-4 flex h-5 w-5 items-center justify-center rounded border"
                                            :class="{
                                                'border-primary bg-gray dark:bg-transparent': obj.authorized
                                            }">
                                            <span class="opacity-100" :class="{ 'hidden' : !obj.authorized }">
                                                <svg width="11" height="8" viewBox="0 0 11 8" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                                        fill="#3056D3" stroke="#3056D3" stroke-width="0.4"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div> Autorizado
                                </label>
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
                    </div>

                </form>
            </div>
        </div>
    </div>
</template>
