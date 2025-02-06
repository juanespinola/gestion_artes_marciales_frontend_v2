<script>

import { useRouter } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import useData from '@/composables/useData'
import { useUserStore } from '@/stores/user';

/*
* TODO: nos enfrentamos al problema que en el back end no almacena un nuevo array luego de haber eliminado 
* los permisos que sacamos al admin
*/
export default {
    components: {

    },
    props: {
       
    },
    setup(props) {
        const userStore = useUserStore()
        const { create, fetchAll } = useData();
        const collection = 'minor_authorization/uploaddocument';
        const obj = ref({
            minor_verified: '',
        });
        const error = ref(null);
        const router = useRouter();
        const formData = new FormData()


        const fetchProduct = async () => {
            const response = await fetchAll('athlete/minor_authorization')
            if(response.success){
                obj.value.minor_verified = response.data.minor_verified
            }
        }

        // Función para guardar los datos (crear o actualizar)
        const saveData = async () => {
            try {
                await create(collection, formData);
                router.push({ name:"Profile" }); // Redirige a la lista después de guardar
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
            fetchProduct()
            // if (isEditing.value) fetchProduct();
        });

        watch(() => props.id, (newId) => {
            // if (newId) fetchProduct();
        });

        const handleFileChange = async (option) => {
            formData.append('file', option.target.files[0])
            formData.append('federation_id', userStore.user.federation.id)
        }



        return {
            obj,
            saveData,
            error,
            validateForm,
            handleFileChange,
            userStore,
        };
    }
}
</script>

<template>
    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">{{ 'Permiso de Menor' }}</h3>
        </div>

        <div class="p-7" v-if="!obj.minor_verified">
            <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div class="w-full">
                    <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="academy_id">Descarga
                        el documento, verifica todo lo indicado y vuelve a subirlo para su verificación</label>
                    <div
                        class="flex justify-between gap-2.5 py-3 px-6 hover:bg-gray-2 dark:hover:bg-meta-4 sm:items-center sm:justify-start">
                        <div class="flex items-center gap-5.5 sm:w-5/12 xl:w-3/12">
                            <div
                                class="hidden h-14 w-full max-w-14 items-center justify-center rounded-full border border-stroke bg-gray text-black-2 dark:border-strokedark dark:bg-graydark dark:text-white sm:flex">
                                <svg class="fill-current" width="28" height="29" viewBox="0 0 28 29" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M4.72659 3.36759C5.32314 2.77105 6.13222 2.43591 6.97585 2.43591H16.2295L16.2299 2.43591L16.2303 2.43591C16.4817 2.43591 16.7081 2.54281 16.8665 2.71363L23.7604 9.6075C23.9312 9.76594 24.0381 9.99231 24.0381 10.2437C24.0381 10.2568 24.0378 10.2699 24.0372 10.2828V24.1241C24.0372 24.9677 23.7021 25.7768 23.1055 26.3733C22.509 26.9699 21.6999 27.305 20.8563 27.305H6.97585C6.13222 27.305 5.32313 26.9699 4.72659 26.3733C4.13005 25.7768 3.79492 24.9677 3.79492 24.1241V5.61684C3.79492 4.77321 4.13005 3.96413 4.72659 3.36759ZM6.97585 4.17097H15.3628V10.2437C15.3628 10.7228 15.7512 11.1112 16.2303 11.1112H22.3022V24.1241C22.3022 24.5075 22.1498 24.8753 21.8787 25.1465C21.6075 25.4176 21.2397 25.57 20.8563 25.57H6.97585C6.59238 25.57 6.22462 25.4176 5.95346 25.1465C5.68231 24.8753 5.52997 24.5075 5.52997 24.1241V5.61684C5.52997 5.23337 5.68231 4.86561 5.95346 4.59445C6.22462 4.3233 6.59238 4.17097 6.97585 4.17097ZM17.0979 5.3987L21.0753 9.37613H17.0979V5.3987ZM9.2896 15.1596C8.81048 15.1596 8.42208 15.548 8.42208 16.0271C8.42208 16.5062 8.81048 16.8946 9.2896 16.8946H18.5432C19.0223 16.8946 19.4107 16.5062 19.4107 16.0271C19.4107 15.548 19.0223 15.1596 18.5432 15.1596H9.2896ZM8.42208 20.654C8.42208 20.1749 8.81048 19.7865 9.2896 19.7865H18.5432C19.0223 19.7865 19.4107 20.1749 19.4107 20.654C19.4107 21.1332 19.0223 21.5216 18.5432 21.5216H9.2896C8.81048 21.5216 8.42208 21.1332 8.42208 20.654ZM9.2896 10.5328C8.81048 10.5328 8.42208 10.9212 8.42208 11.4003C8.42208 11.8795 8.81048 12.2679 9.2896 12.2679H11.603C12.0821 12.2679 12.4705 11.8795 12.4705 11.4003C12.4705 10.9212 12.0821 10.5328 11.603 10.5328H9.2896Z"
                                        fill=""></path>
                                </svg>
                            </div>
                            <p class="font-medium text-black dark:text-white">Permiso de Menor</p>
                        </div>
                        <div class="hidden w-5/12 xl:block">
                            <p class="font-medium text-black dark:text-white">Subido el: 25 Nov, 2025</p>
                        </div>
                        <div class="text-right sm:w-8/12 xl:w-4/12"><button
                                class="inline-flex rounded bg-primary py-1 px-3 font-medium text-white hover:bg-opacity-90 sm:py-2.5 sm:px-6">
                                Download </button></div>
                    </div>
                </div>

            </div>
            <form @submit.prevent="saveData">


                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white"> Adjuntar Archivo
                        </label>
                        <input type="file" @change="handleFileChange($event)"
                            class="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary">
                    </div>
                </div>

                <div class="flex justify-end gap-4.5">
                    <!-- <button
                        class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                        type="button" @click="$router.push({name:'profile'})"> Cancel </button> -->
                    <button
                        class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                        type="submit"> Guardar </button>
                </div>
            </form>
        </div>
        <div v-else>
                        
            <div class="p-7">
                Tu permiso de Menor ha sido Aprobado
            </div>
        </div>
    </div>

</template>
