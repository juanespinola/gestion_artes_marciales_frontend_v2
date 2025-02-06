<script>

import { useRouter } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import useData from '@/composables/useData'
import SelectComponent from '@/components/Select/SelectComponent.vue';
import { useUserStore } from '@/stores/user';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import UpdateBeltHistoryModalFormComponent from './UpdateBeltHistoryModalFormComponent.vue'

export default {
    components: {
        SelectComponent,
        DataTable,
        Column,
        UpdateBeltHistoryModalFormComponent
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

        const fetchBeltHistory = async () => {
            const response = await fetchAll('athlete/belthistory');
            if (response.success) {
                beltshistory.value = response.data
            }
        };

        const fetchBelts = async () => {
            const response = await create('athlete/belts', { federation_id: userStore.user.federation.id });
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
                router.push({ name: "Profile"}); // Redirige a la lista después de guardar
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
            await fetchProduct();
            fetchBeltHistory()
            fetchAcademies()
            fetchBelts()
            // if (isEditing.value) fetchProduct();
        });

        watch(() => props.id, (newId) => {
            // if (newId) fetchProduct();
        });

        const handleAcademySelected = (itemSelected) => {
            obj.value.academy_id = (itemSelected.id)
        }

        const handleBeltSelected = (itemSelected) => {
            obj.value.belt_id = (itemSelected.id)
        }

        const newBeltHistory = () => {
            router.push({ name: "NewBeltHistory"})
        }
        
        const editBeltHistory = (id) => {
            router.push({ name: "EditBeltHistory", params: { id }})
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
        <div class="col-span-5 xl:col-span-3">
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


                        <!-- <div class="p-4 sm:p-6 xl:p-9">
                    <div class="min-w-[370px] max-w-max rounded-md border border-stroke py-1 dark:border-strokedark">
                        <ul class="flex flex-col">
                            <li v-for="belthistory of beltshistory"
                                class="flex items-center justify-between gap-2.5 border-b border-stroke px-5 py-3 last:border-b-0 dark:border-strokedark">

                                <div class="flex items-center gap-2">
                                    <span
                                        :class="['flex h-6.5 w-6.5 items-center justify-center rounded-full text-white', `bg-[${belthistory.belt.color_hexadecimal}]`]"></span>
                                    <span>{{ belthistory.belt.color }}</span>
                                </div>

                                <div class="icon-container p-2 rounded-full">
                                    <svg class="fill-current text-white" width="20" height="20" viewBox="0 0 20 20"
                                        fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g opacity="0.8" clip-path="url(#clip0_88_10224)">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M1.56524 3.23223C2.03408 2.76339 2.66997 2.5 3.33301 2.5H9.16634C9.62658 2.5 9.99967 2.8731 9.99967 3.33333C9.99967 3.79357 9.62658 4.16667 9.16634 4.16667H3.33301C3.11199 4.16667 2.90003 4.25446 2.74375 4.41074C2.58747 4.56702 2.49967 4.77899 2.49967 5V16.6667C2.49967 16.8877 2.58747 17.0996 2.74375 17.2559C2.90003 17.4122 3.11199 17.5 3.33301 17.5H14.9997C15.2207 17.5 15.4326 17.4122 15.5889 17.2559C15.7452 17.0996 15.833 16.8877 15.833 16.6667V10.8333C15.833 10.3731 16.2061 10 16.6663 10C17.1266 10 17.4997 10.3731 17.4997 10.8333V16.6667C17.4997 17.3297 17.2363 17.9656 16.7674 18.4344C16.2986 18.9033 15.6627 19.1667 14.9997 19.1667H3.33301C2.66997 19.1667 2.03408 18.9033 1.56524 18.4344C1.0964 17.9656 0.833008 17.3297 0.833008 16.6667V5C0.833008 4.33696 1.0964 3.70107 1.56524 3.23223Z"
                                                fill=""></path>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M16.6664 2.39884C16.4185 2.39884 16.1809 2.49729 16.0056 2.67253L8.25216 10.426L7.81167 12.188L9.57365 11.7475L17.3271 3.99402C17.5023 3.81878 17.6008 3.5811 17.6008 3.33328C17.6008 3.08545 17.5023 2.84777 17.3271 2.67253C17.1519 2.49729 16.9142 2.39884 16.6664 2.39884ZM14.8271 1.49402C15.3149 1.00622 15.9765 0.732178 16.6664 0.732178C17.3562 0.732178 18.0178 1.00622 18.5056 1.49402C18.9934 1.98182 19.2675 2.64342 19.2675 3.33328C19.2675 4.02313 18.9934 4.68473 18.5056 5.17253L10.5889 13.0892C10.4821 13.196 10.3483 13.2718 10.2018 13.3084L6.86847 14.1417C6.58449 14.2127 6.28409 14.1295 6.0771 13.9225C5.87012 13.7156 5.78691 13.4151 5.85791 13.1312L6.69124 9.79783C6.72787 9.65131 6.80364 9.51749 6.91044 9.41069L14.8271 1.49402Z"
                                                fill=""></path>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_88_10224">
                                                <rect width="20" height="20" fill="white"></rect>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div> -->


                        <div class="flex justify-end gap-4.5">
                            <!-- <button
                                class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                type="button" @click="$router.go(-1)"> Cancel </button> -->
                            <button
                                class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                                type="submit"> Guardar </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="col-span-5 xl:col-span-2">
            <DataTable :value="beltshistory" tableStyle="width: 100%" dataKey="id" v-model:expandedRows="expandedRows">
                <template #header>
                    <div class="flex justify-between">
                        <div></div>
                        <button @click="newBeltHistory"
                            class="inline-flex items-center justify-center gap-2.5 py-1 px-2 text-center font-medium hover:bg-opacity-90 bg-meta-3 text-white rounded-full">Cargar Historial</button>
                    </div>
                </template>
                <Column expander style="width: 1rem" />
                <Column field="belt.color" header="Historial de Cinturón" />
                <Column header="Acciones" headerStyle="width: 1rem; text-align: center"
                    bodyStyle="text-align: center; overflow: visible">
                    <template #body="{data}">
                        <div class="icon-container p-2 rounded-full" @click="editBeltHistory(data.id)">
                            <svg class="fill-current text-white" width="20" height="20" viewBox="0 0 20 20" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <g opacity="0.8" clip-path="url(#clip0_88_10224)">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M1.56524 3.23223C2.03408 2.76339 2.66997 2.5 3.33301 2.5H9.16634C9.62658 2.5 9.99967 2.8731 9.99967 3.33333C9.99967 3.79357 9.62658 4.16667 9.16634 4.16667H3.33301C3.11199 4.16667 2.90003 4.25446 2.74375 4.41074C2.58747 4.56702 2.49967 4.77899 2.49967 5V16.6667C2.49967 16.8877 2.58747 17.0996 2.74375 17.2559C2.90003 17.4122 3.11199 17.5 3.33301 17.5H14.9997C15.2207 17.5 15.4326 17.4122 15.5889 17.2559C15.7452 17.0996 15.833 16.8877 15.833 16.6667V10.8333C15.833 10.3731 16.2061 10 16.6663 10C17.1266 10 17.4997 10.3731 17.4997 10.8333V16.6667C17.4997 17.3297 17.2363 17.9656 16.7674 18.4344C16.2986 18.9033 15.6627 19.1667 14.9997 19.1667H3.33301C2.66997 19.1667 2.03408 18.9033 1.56524 18.4344C1.0964 17.9656 0.833008 17.3297 0.833008 16.6667V5C0.833008 4.33696 1.0964 3.70107 1.56524 3.23223Z"
                                        fill=""></path>
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M16.6664 2.39884C16.4185 2.39884 16.1809 2.49729 16.0056 2.67253L8.25216 10.426L7.81167 12.188L9.57365 11.7475L17.3271 3.99402C17.5023 3.81878 17.6008 3.5811 17.6008 3.33328C17.6008 3.08545 17.5023 2.84777 17.3271 2.67253C17.1519 2.49729 16.9142 2.39884 16.6664 2.39884ZM14.8271 1.49402C15.3149 1.00622 15.9765 0.732178 16.6664 0.732178C17.3562 0.732178 18.0178 1.00622 18.5056 1.49402C18.9934 1.98182 19.2675 2.64342 19.2675 3.33328C19.2675 4.02313 18.9934 4.68473 18.5056 5.17253L10.5889 13.0892C10.4821 13.196 10.3483 13.2718 10.2018 13.3084L6.86847 14.1417C6.58449 14.2127 6.28409 14.1295 6.0771 13.9225C5.87012 13.7156 5.78691 13.4151 5.85791 13.1312L6.69124 9.79783C6.72787 9.65131 6.80364 9.51749 6.91044 9.41069L14.8271 1.49402Z"
                                        fill=""></path>
                                </g>
                                <defs>
                                    <clipPath id="clip0_88_10224">
                                        <rect width="20" height="20" fill="white"></rect>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </template>
                </Column>
                <template #expansion="{ data }">
                    <div class="p-4">
                        <div class="flex items-center gap-2">
                            <h5 class="font-medium text-black dark:text-white">Fecha de obtención:</h5>
                            <span>{{ data.achieved ? data.achieved : 'Sin Fecha' }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <h5 class="font-medium text-black dark:text-white">Otorgado por:</h5>
                            <span>{{ data.promoted_by ? data.promoted_by : 'Desconocido' }}</span>
                        </div>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>

    <UpdateBeltHistoryModalFormComponent 
        :isOpen="isModalBeltHistoryOpen" 
        :title="'Historial de Cinturones'" 
        :data="modalBeltHistoryData"
        @close="closeBeltHistoryModal" 
    />


</template>
