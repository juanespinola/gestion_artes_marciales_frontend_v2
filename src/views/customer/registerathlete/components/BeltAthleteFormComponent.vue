<script>

import { useRouter } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import useData from '@/composables/useData'
import SelectComponent from '@/components/Select/SelectComponent.vue';
import { useUserStore } from '@/stores/user';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import CardComponent from '@/components/Card/CardComponent.vue';

export default {
    components: {
        SelectComponent,
        DataTable,
        Column,
        CardComponent
    },
    props: {
        id: {
            type: String,
            required: false,
        },
    },
    setup(props) {
        const { update, create, fetchAll } = useData();
        const collection = 'athlete/profile';
        const obj = ref({
            academy_id: '',
            belt_id: '',
        });
        const error = ref(null);
        const router = useRouter();
        const isEditing = computed(() => !!props.id);
        const userStore = useUserStore()
        const academies = ref([])
        const belts = ref([])
        const beltshistory = ref([])
        const expandedRows = ref({});


        // datos para el modal
        const isModalBeltHistoryOpen = ref(false)
        const modalBeltHistoryData = ref({});

        // Función para obtener los datos si estamos en edición
        const fetchProduct = async () => {
            const response = await fetchAll(collection);
            if (response.success) {
                obj.value = response.data
            }
        };

        const fetchAcademies = async () => {
            const response = await fetchAll('athlete/academies');
            if (response.success) {
                academies.value = response.data
            }
        };


        const fetchBelts = async () => {
            const response = await create('athlete/belts', { federation_id: 1 });
            if (response.success) {
                belts.value = response.data
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
                router.push({ name: "Profile" }); // Redirige a la lista después de guardar
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
            fetchAcademies()
            fetchBelts()
        });

        watch(() => props.id, (newId) => {
         
        });

        const handleAcademySelected = (itemSelected) => {
            obj.value.academy_id = (itemSelected.id)
        }

        const handleBeltSelected = (itemSelected) => {
            obj.value.belt_id = (itemSelected.id)
        }

        const newBeltHistory = () => {
            router.push({ name: "NewBeltHistory" })
        }

        const editBeltHistory = (id) => {
            router.push({ name: "EditBeltHistory", params: { id } })
        }



        return {
            obj,
            isEditing,
            saveData,
            error,
            validateForm,
            academies,
            belts,
            beltshistory,
            handleAcademySelected,
            handleBeltSelected,
            expandedRows,
            isModalBeltHistoryOpen,
            modalBeltHistoryData,
            newBeltHistory,
            editBeltHistory,

        };
    }
}
</script>

<template>
    <div class="grid grid-cols-5 gap-8">
        <div class="col-span-5 xl:col-span-5">
            <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
                    <h3 class="font-medium text-black dark:text-white">{{ 'Cinturón y Academia' }}</h3>
                </div>
                <div class="p-7">
                    <form @submit.prevent="saveData">
                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <SelectComponent :data="academies" :title="'Academia'" :selectedOption="obj.academy_id"
                                    @obj-selected="handleAcademySelected" />
                            </div>

                        </div>

                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <SelectComponent :data="belts" :title="'Cinturón'" :selectedOption="obj.belt_id"
                                    @obj-selected="handleBeltSelected" />
                            </div>

                        </div>

                        <div class="flex justify-end gap-4.5">
                            <!-- <button
                                class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                type="button" @click="$router.go(-1)">Cancelar</button> -->
                            <button
                                class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                                type="submit"> Guardar </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </div>

</template>
