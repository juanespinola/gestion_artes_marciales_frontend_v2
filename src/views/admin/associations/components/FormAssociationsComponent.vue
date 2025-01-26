<script>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import useData from '@/composables/useData'
import CardComponent from '@/components/Card/CardComponent.vue';
import SelectComponent from '@/components/Select/SelectComponent.vue';


/*
* TODO: nos enfrentamos al problema que en el back end no almacena un nuevo array luego de haber eliminado 
* los permisos que sacamos al admin
*/
export default {
    components: {
        SelectComponent
    },
    props: {
        id: {
            type: String,
            required: false,
        },
    },
    setup(props) {
        const { find, update, create } = useData();
        const collection = 'association';
        const obj = ref({
            description: '',
            status: '',
            email: '',
            phone_number: '',
            president: '',
            vice_president: '',
            treasurer: '',
            facebook: '',
            whatsapp: '',
            twitter: '',
            instagram: '',
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
                    await update(collection, props.id, obj.value);
                    console.log('Producto actualizado:', obj.value);
                } else {
                    await create(collection, obj.value);
                    console.log('Producto creado:', obj.value);
                }
                router.go(-1); // Redirige a la lista después de guardar
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

        const handleStatusSelected = (itemSelected) => {
            obj.value.status = JSON.parse(itemSelected.id)
        }


        // Llamar a fetchProduct cuando el componente se monta o cuando cambia el id
        onMounted(() => {
            if (isEditing.value) fetchProduct();
        });

        watch(() => props.id, (newId) => {
            if (newId) fetchProduct();
        });

        return { obj, isEditing, saveData, error, validateForm, handleStatusSelected };
    }
}
</script>

<template>
    <form @submit.prevent="saveData" class="grid grid-cols-5 gap-8">
        <div class="col-span-5 xl:col-span-3">
            <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

                <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
                    <h3 class="font-medium text-black dark:text-white">{{ isEditing ? 'Editar' : 'Nuevo' }}</h3>
                </div>
                <div class="p-7">
                    <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div class="w-full">
                            <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                for="description">Nombre</label>
                            <input
                                class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text" name="description" id="description" v-model="obj.description">
                        </div>
                    </div>

                    <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div class="w-full sm:w-1/2">
                            <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                for="email">E-mail</label>
                            <input
                                class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text" name="email" id="email" v-model="obj.email">
                        </div>
                        <div class="w-full sm:w-1/2">
                            <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                for="phone_number">Nro Teléfono</label>
                            <input
                                class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text" name="phone_number" id="phone_number" v-model="obj.phone_number">
                        </div>
                    </div>


                    <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div class="w-full">
                            <SelectComponent :data="[{ id: 'true', name: 'Activo' }, { id: 'false', name: 'Inactivo' }]"
                                :title="'Estado'" :selectedOption="obj.status" @obj-selected="handleStatusSelected" />
                        </div>
                    </div>

                    <div class="flex justify-end gap-4.5">
                        <button
                            class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                            type="button" @click="$router.go(-1)"> Cancel </button>
                        <button
                            class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                            type="submit"> Save </button>
                    </div>

                </div>
            </div>
        </div>
        <div class="col-span-5 xl:col-span-2 ">
            <div
                class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
                <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
                    <h3 class="font-medium text-black dark:text-white">Autoridades</h3>
                </div>
                <div class="p-7">
                    <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div class="w-full">
                            <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                for="president">Presidente</label>
                            <input
                                class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text" name="president" id="president" v-model="obj.president">
                        </div>
                    </div>
                    <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div class="w-full">
                            <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                for="vice_president">Vice Presidente</label>
                            <input
                                class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text" name="vice_president" id="vice_president" v-model="obj.vice_president">
                        </div>
                    </div>
                    <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div class="w-full">
                            <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                for="treasurer">Tesorero</label>
                            <input
                                class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text" name="treasurer" id="treasurer" v-model="obj.treasurer">
                        </div>
                    </div>
                </div>
            </div>
            <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
                    <h3 class="font-medium text-black dark:text-white">Redes Sociales</h3>
                </div>
                <div class="p-7">
                    <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div class="w-full">
                            <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                for="facebook">Facebook</label>
                            <input
                                class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text" name="facebook" id="facebook" v-model="obj.facebook">
                        </div>
                        <div class="w-full">
                            <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                for="whatsapp">Whatsapp</label>
                            <input
                                class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text" name="whatsapp" id="whatsapp" v-model="obj.whatsapp">
                        </div>
                    </div>
                    <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div class="w-full">
                            <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                for="twitter">X</label>
                            <input
                                class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text" name="twitter" id="twitter" v-model="obj.twitter">
                        </div>
                        <div class="w-full">
                            <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                for="instagram">Instagram</label>
                            <input
                                class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text" name="instagram" id="instagram" v-model="obj.instagram">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>
