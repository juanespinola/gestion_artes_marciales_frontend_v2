<script>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import useData from '@/composables/useData'
import SelectComponent from '@/components/Select/SelectComponent.vue';


export default {
    components: {
        SelectComponent
    },
    props: {
        id: { // en caso de querer actualizar la entry category
            type: String,
            required: false,
        },
        eventid: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const { find, update, create, fetchAll } = useData();
        const collection = 'entrycategories';
        const obj = ref({
            name: '',
            min_age: '',
            max_age: '',
            min_weight: '',
            max_weight: '',
            belt_id: '',
            gender: '',
            clothes: '',
            event_id: ''
        });
        const error = ref(null);
        const router = useRouter();
        const route = useRoute();
        const isEditing = computed(() => !!props.id);
        const belts = ref([])

        // Función para obtener los datos si estamos en edición
        const fetchProduct = async () => {

            if (isEditing.value) {
                const response = await find(collection, props.id);
                if (response.success) {
                    obj.value = response.data;
                }
            }
        };

        // Función para obtener los datos si estamos en edición
        const fetchBelts = async () => {
            const response = await fetchAll('belt');
            if (response.success) {
                belts.value = response.data;
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
        onMounted(() => {
            obj.value.event_id = props.eventid

            if (route.query.beltid) {
                obj.value.belt_id = route.query.beltid
            }

            fetchBelts();
            if (isEditing.value) fetchProduct();
        });

        watch(() => props.id, (newId) => {
            fetchBelts();
            if (newId) fetchProduct();
        });

        const handleBeltSelected = (itemSelected) => {
            obj.value.belt_id = (itemSelected.id)
        }

        const handleGenderSelected = (itemSelected) => {
            obj.value.gender = (itemSelected.id)
        }

        const handleClotheSelected = (itemSelected) => {
            obj.value.clothes = (itemSelected.id)
        }


        return {
            obj,
            isEditing,
            saveData,
            error,
            validateForm,
            belts,
            handleBeltSelected,
            handleGenderSelected,
            handleClotheSelected
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
                        <SelectComponent :data="belts" :title="'Cinturón'" :selectedOption="obj.belt_id"
                            @obj-selected="handleBeltSelected" :isDisabled="$route.query.beltid" />
                    </div>
                </div>
                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full sm:w-1/2">
                        <SelectComponent
                            :data="[{ id: 'masculino', name: 'Masculino' }, { id: 'femenino', name: 'Femenino' },]"
                            :title="'Género'" :selectedOption="obj.gender" @obj-selected="handleGenderSelected" />
                    </div>
                    <div class="w-full sm:w-1/2">
                        <SelectComponent :data="[{ id: 'gi', name: 'GI' }, { id: 'noGi', name: 'noGi' },]"
                            :title="'Indumentaria'" :selectedOption="obj.clothes"
                            @obj-selected="handleClotheSelected" />
                    </div>
                </div>
                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full sm:w-1/2">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="name">Nombre de
                            Categoria</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text" name="name" id="name" v-model="obj.name">
                    </div>

                </div>
                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full sm:w-1/2">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="min_age">Edad
                            Minima</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="number" name="min_age" id="min_age" v-model="obj.min_age">
                    </div>
                    <div class="w-full sm:w-1/2">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="max_age">Edad
                            Máxima</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="number" name="max_age" id="max_age" v-model="obj.max_age">
                    </div>
                </div>
                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full sm:w-1/2">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="min_weight">Peso
                            Minimo</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="number" name="min_weight" id="min_weight" v-model="obj.min_weight">
                    </div>
                    <div class="w-full sm:w-1/2">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="max_weight">Peso
                            Máximo</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="number" name="max_weight" id="max_weight" v-model="obj.max_weight">
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
            </form>
        </div>
    </div>

</template>
