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
        SelectComponent
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
        const collection = 'eventcontent';
        const obj = ref({
            title: '',
            content: '',
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
        onMounted(() => {
            if (isEditing.value) fetchProduct();
        });

        watch(() => props.id, (newId) => {
            if (newId) fetchProduct();
        });

        const handleFileChange = async (option, type) => {
            const formData = new FormData()
            formData.append('file', option.target.files[0])
            formData.append('type', type)
            formData.append('new_id', props.id)

            // TODO: nos da error porque falta el magik plugin instalar en el servidor de PHP
            const response = await create('medianew', formData);
            if(response.success){
                console.log('Imagen guardada correctamente')
            }
        }

        const handleStatusSelected = (itemSelected) => {
            obj.value.status = (itemSelected.id)
        }

        const deletePhoto = () => {
            // TODO: necesitamos hacer la accion de eliminar
        }

        return { obj, isEditing, saveData, error, validateForm, handleFileChange, deletePhoto, handleStatusSelected };
    }
}
</script>

<template>
    <div class="grid grid-cols-5 gap-8">
        <div class="col-span-5 xl:col-span-3">
            <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

                <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
                    <h3 class="font-medium text-black dark:text-white">{{ isEditing ? 'Editar' : 'Nuevo' }}</h3>
                </div>
                <div class="p-7">
                    <form @submit.prevent="saveData">
                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                    for="title">Titulo</label>
                                <input
                                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="text" name="title" id="title" v-model="obj.title">
                            </div>
                        </div>

                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                    for="content">Contenido</label>
                                <Editor v-model="obj.content" editorStyle="height: 300px" />
                            </div>
                        </div>

                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <SelectComponent
                                    :data="[
                                            { id: 'pendiente', name: 'Pendiente' }, 
                                            { id: 'activo', name: 'Activo' }, 
                                            { id: 'inactivo', name: 'Inactivo' }
                                        ]"
                                    :title="'Estado'" :selectedOption="obj.status"
                                    @obj-selected="handleStatusSelected" />
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
        </div>
        <div class="col-span-5 xl:col-span-2 ">
            <div
                class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-5">
                <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
                    <h3 class="font-medium text-black dark:text-white">Cargar</h3>
                </div>
                <div class="p-7">
                   
                    <form @submit.prevent="handlePhotoSubmit">
                        <!-- User Photo Section -->
                        <div class="mb-4 flex items-center gap-3">
                            <div class="h-14 w-14 rounded-full">
                                <img :src="userPhoto" alt="User" />
                            </div>
                            <div>
                                <span class="mb-1.5 font-medium text-black dark:text-white">Banner de Cabecera</span>
                                <span class="flex">
                                    <button class="text-sm font-medium hover:text-primary" @click="deletePhoto">
                                        Eliminar
                                    </button>
                                </span>
                            </div>
                        </div>

                        <!-- File Upload Section -->
                        <div id="FileUpload"
                            class="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5">
                            <input type="file" accept="image/*"
                                class="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                @change="handleFileChange($event, 'banner_new_detail')" name="file" id="file"/>
                            <div class="flex flex-col items-center justify-center space-y-3">
                                <span
                                    class="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                            fill="#3C50E0" />
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                            fill="#3C50E0" />
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                            fill="#3C50E0" />
                                    </svg>
                                </span>
                                <p class="text-sm font-medium">
                                    <span class="text-primary">Click to cargar</span> or drag and drop
                                </p>
                                <p class="mt-1.5 text-sm font-medium">SVG, PNG, JPG or GIF</p>
                                <p class="text-sm font-medium">(max, 800 X 800px)</p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div class="p-7">
                    <form >
                        <!-- User Photo Section -->
                        <div class="mb-4 flex items-center gap-3">
                            <div class="h-14 w-14 rounded-full">
                                <img :src="userPhoto" alt="User" />
                            </div>
                            <div>
                                <span class="mb-1.5 font-medium text-black dark:text-white">Banner de Lista</span>
                                <span class="flex gap-2.5">
                                    <button class="text-sm font-medium hover:text-primary" @click="deletePhoto">
                                        Eliminar
                                    </button>
                                </span>
                            </div>
                        </div>

                        <!-- File Upload Section -->
                        <div id="FileUpload"
                            class="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5">
                            <input type="file" accept="image/*"
                                class="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                @change="handleFileChange($event, 'banner_new_list')" />
                            <div class="flex flex-col items-center justify-center space-y-3">
                                <span
                                    class="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                            fill="#3C50E0" />
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                            fill="#3C50E0" />
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                            fill="#3C50E0" />
                                    </svg>
                                </span>
                                <p class="text-sm font-medium">
                                    <span class="text-primary">Click to cargar</span> or drag and drop
                                </p>
                                <p class="mt-1.5 text-sm font-medium">SVG, PNG, JPG or GIF</p>
                                <p class="text-sm font-medium">(max, 800 X 800px)</p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
