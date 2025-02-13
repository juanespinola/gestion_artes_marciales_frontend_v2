<script>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import useData from '@/composables/useData';
import SelectComponent from '@/components/Select/SelectComponent.vue';

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
        const { find, update, create, fetchAll } = useData();
        const collection = 'location';
        const obj = ref({
            description: '',
            city_id: '',
            address: '',
        });
        const error = ref(null);
        const router = useRouter();
        const isEditing = computed(() => !!props.id);
        const countries = ref([]);
        const cities = ref([]);

        const fetchCountries = async () => {
            const response = await fetchAll('athlete/countries');
            if (response.success) {
                countries.value = response.data
            }
        };

        const fetchCities = async (country_id) => {
            const response = await create('athlete/cities', { country_id });
            if (response.success) {
                cities.value = response.data
            }
        };



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

        // Llamar a fetchProduct cuando el componente se monta o cuando cambia el id
        onMounted(async () => {
            fetchCountries()
            fetchCities(obj.value.country_id)
            if (isEditing.value) await fetchProduct();
        });

        watch(() => props.id, async (newId) => {
            fetchCountries()
            fetchCities(obj.value.country_id)
            if (newId) await fetchProduct();
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
        {{ obj }}
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
