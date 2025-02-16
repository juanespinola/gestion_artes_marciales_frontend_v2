<script>

import { useRouter } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import useData from '@/composables/useData'
import SelectComponent from '@/components/Select/SelectComponent.vue';

export default {
    components: {
        SelectComponent
    },
    props: {
        obj: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const { update, create, fetchAll } = useData();
        const collection = 'athlete/profile';

        const error = ref(null);
        const router = useRouter();
        const isEditing = computed(() => !!props.id);
        const countries = ref([]);
        const cities = ref([]);
        const typesdocuments = ref([]);


        const fetchCountries = async () => {
            const response = await create('athlete/countries', {});
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

        const fetchTypesDocuments = async () => {
            const response = await fetchAll('athlete/typesdocument');
            if (response.success) {
                typesdocuments.value = response.data
            }
        };


    

      

        // Llamar a fetchProduct cuando el componente se monta o cuando cambia el id
        onMounted(async () => {

            fetchTypesDocuments()
            fetchCountries()
            fetchCities(props.obj.country_id)

        });

        watch(() => props.id, (newId) => {
            // if (newId) fetchProduct();
        });

        const handleCountrySelected = (itemSelected) => {
            props.obj.country_id = (itemSelected.id)
            fetchCities(itemSelected.id)
        }


        const handleCitySelected = (itemSelected) => {
            props.obj.city_id = (itemSelected.id)
        }

        const handleGenderSelected = (itemSelected) => {
            props.obj.gender = (itemSelected.id)
        }

        const handleTypeDocumentSelected = (itemSelected) => {
            props.obj.type_document_id = (itemSelected.id)
        }



        return {
            isEditing,
            error,
            handleCountrySelected,
            handleCitySelected,
            handleGenderSelected,
            handleTypeDocumentSelected,
            fetchCountries,
            fetchCities,
            countries,
            cities,
            typesdocuments,
        };
    }
}
</script>

<template>
    <div class="grid grid-cols-5 gap-8">
        <div class="col-span-5 xl:col-span-5">
            <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
                    <h3 class="font-medium text-black dark:text-white">{{ 'Perfil del Atleta' }}</h3>
                </div>
                <div class="p-7">
                    <form @submit.prevent="saveData">

                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="phone">Nro
                                    de Teléfono</label>
                                <input
                                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    type="text" name="phone" id="phone" v-model="obj.phone">
                            </div>
                        </div>
                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <SelectComponent :data="countries" :title="'Pais'" :selectedOption="obj.country_id"
                                    @obj-selected="handleCountrySelected" />
                            </div>
                        </div>

                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <SelectComponent :data="cities" :title="'Ciudad'" :selectedOption="obj.city_id"
                                    @obj-selected="handleCitySelected" />
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>

    </div>

</template>
