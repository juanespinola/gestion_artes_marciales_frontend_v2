<script>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import useData from '@/composables/useData';
import Editor from 'primevue/editor'

import DatePicker from 'primevue/datepicker';
import SelectComponent from '@/components/Select/SelectComponent.vue';
import FloatLabel from 'primevue/floatlabel';
import { useUserStore } from '@/stores/user';
import { useNotificationStore } from '@/stores/notification';

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
        const notificationStore = useNotificationStore()
        const { find, update, create } = useData();
        const collection = 'requestautorization';
        const obj = ref({
            request_text: '',
            response_text: '',
            date_response: '',
            federation_id: '',
            association_id: '',
            athlete_id: '',
            status: '',
            approved_by:'',
            rejected_by:''
        });

        const userStore = useUserStore()


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
        onMounted(() => {
            if (isEditing.value) fetchProduct();
        });

        watch(() => props.id, (newId) => {
            if (newId) fetchProduct();
        });

        

        const handleStatusSelected = (itemSelected) => {
            obj.value.status = (itemSelected.id)
            console.log(userStore.user.id)
            if(obj.value.status == 'aprobado'){
                obj.approved_by = userStore.user.id
                obj.rejected_by = null
                
            } else if(obj.value.status == 'rechazado'){
                obj.rejected_by = userStore.user.id
                obj.approved_by = null
            }
        }

        return { obj, isEditing, saveData, error, validateForm, handleStatusSelected };
    }
}
</script>

<template>
    <div class="grid grid-cols-1 gap-8">
        <div class="col-span-5 xl:col-span-3">
            <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <form @submit.prevent="saveData">
                    <div class="border-b border-stroke py-4 px-7 dark:border-strokedark flex justify-between">
                        <h3 class="font-medium text-black dark:text-white">{{ isEditing && `Solicitud #${obj.id}` }}</h3>
                        <h3 class="font-medium text-black dark:text-white">{{ obj.approved_by_user ? `Aprobado por ${obj.approved_by_user.name}` : `Rechazado por ${obj?.rejected_by_user?.name}` }}</h3>
                    </div>
                    <div class="p-7">

                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                    for="requested_by">Solicitado Por</label>
                                <input
                                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    :class="{'disabled:cursor-default disabled:bg-whiter dark:focus:border-primary dark:disabled:bg-black opacity-50': obj.requested_by }"
                                    type="text" name="requested_by" id="requested_by" v-model="obj.requested_by" :disabled="obj.requested_by">
                            </div>
                            <div class="w-full">
                                <SelectComponent :data="[
                                    { id: 'pendiente', name: 'Pendiente' },
                                    { id: 'respuesta', name: 'Respuesta' },
                                    { id: 'aprobado', name: 'Aprobado' },
                                    { id: 'rechazado', name: 'Rechazado' },
                                ]" :title="'Estado'" :selectedOption="obj.status"
                                    @obj-selected="handleStatusSelected" />
                            </div>

                            <div class="w-full">
                                <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                    for="date_request">Fecha Solicitud</label>
                                    <DatePicker v-model="obj.date_request" showIcon iconDisplay="input" variant="filled" />
                            </div>
                            <div class="w-full">
                                <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                    for="date_response">Fecha Respuesta</label>
                                    <DatePicker v-model="obj.date_response" showIcon iconDisplay="input" variant="filled" />
                            </div>
                        </div>

                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                    for="request_text">Solicitud</label>
                                <Editor v-model="obj.request_text" editorStyle="height: 325px" readonly>
                                    <template v-slot:toolbar>
                                        <div class="ql-formats"></div>
                                    </template>
                                </Editor>
                            </div>
                            <div class="w-full">
                                <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                    for="response_text">Respuesta</label>
                                <Editor v-model="obj.response_text" editorStyle="height: 300px" />
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
