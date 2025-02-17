<script>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import useData from '@/composables/useData';
import SelectComponent from '@/components/Select/SelectComponent.vue';
import { useNotificationStore } from '@/stores/notification';

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
        const notificationStore = useNotificationStore()
        const { find, update, create, fetchAll } = useData();
        const collection = 'location';
        const obj = ref({
            description: '',
            city_id: '',
            address: '',
            country_id: '',
        });
        const error = ref(null);
        const router = useRouter();
        const isEditing = computed(() => !!props.id);
        const countries = ref([]);
        const cities = ref([]);

        const fetchCountries = async () => {
            const response = await create('athlete/countries', {});
            if (response.success) {
                countries.value = response.data
            }
        };

        const fetchCities = async (country_id = null, city_id = null) => {
            if(country_id){
                const response = await create('athlete/cities', { country_id });
                if (response.success) {
                    cities.value = response.data
                }
            }
            if(city_id){
                const response = await create('athlete/cities', { city_id: props.city_id });
                if (response.success) {
                    cities.value = response.data
                }
            }
        };



        // Función para obtener los datos si estamos en edición
        const fetchProduct = async () => {
            if (isEditing.value) {
                const response = await find(collection, props.id);
                if (response.success) {
                    obj.value.description = response.data.description;
                    obj.value.city_id = response.data.city_id;
                    obj.value.address = response.data.address;           
                    obj.value.country_id = response.data.city.country_id;           
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
            if (isEditing.value) {
                await fetchProduct();
                await fetchCountries(obj.value.city_id)
            }
            await fetchCities(null, obj.value.city_id)
        });

        watch(() => props.id, async (newId) => {
            if (newId) {
                await fetchProduct();
                await fetchCountries(obj.value.city_id)
            }
            await fetchCities(null, obj.value.city_id)
        });


        const handleCountrySelected = (itemSelected) => {
            obj.value.country_id = (itemSelected.id)
            fetchCities(itemSelected.id)
        }


        const handleCitySelected = (itemSelected) => {
            obj.value.city_id = (itemSelected.id)
        }

        return { 
            obj, 
            isEditing, 
            saveData, 
            error, 
            validateForm,
            countries,
            cities,
            handleCountrySelected,
            handleCitySelected
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
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="description">Descripción</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text" name="description" id="description" v-model="obj.description">
                    </div>
                </div>

                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full sm:w-1/2">
                        <SelectComponent :data="countries" :title="'Pais'" :selectedOption="obj.country_id"
                        @obj-selected="handleCountrySelected" />
                    </div>
                    <div class="w-full sm:w-1/2">
                        <SelectComponent :data="cities" :title="'Ciudad'" :selectedOption="obj.city_id"
                        @obj-selected="handleCitySelected" />
                    </div>
                </div>

                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="address">Dirección</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text" name="address" id="address" v-model="obj.address">
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
