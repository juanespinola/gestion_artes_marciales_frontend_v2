<script>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import useData from '@/composables/useData'
import SelectComponent from '@/components/Select/SelectComponent.vue';
import DatePicker from 'primevue/datepicker';
import { useNotificationStore } from '@/stores/notification';

export default {
    components: {
        SelectComponent,
        DatePicker
    },
    props: {
        eventid: {
            type: String,
            required: false,
        },
    },
    setup(props) {
        const notificationStore = useNotificationStore()
        const { find, update, create, fetchAll } = useData();
        const collection = 'event';
        const obj = ref({
            description: '',
            location_id: '',
            initial_date: '',
            final_date: '',
            initial_time: '',
            final_time: '',
            type_event_id: '',
            status_event_id: '',
            inscription_fee: '',
            total_participants: '',
            available_slots: '',
            quantity_quadrilateral: '',
            content: '',

        });
        const error = ref(null);
        const router = useRouter();
        const isEditing = computed(() => !!props.eventid);
        const locations = ref([]);
        const eventstypes = ref([]);
        const statusevent = ref([]);

        // Función para obtener los datos si estamos en edición
        const fetchProduct = async () => {
            if (isEditing.value) {
                const response = await find(collection, props.eventid);
                if (response.success) {
                    // obj.value = response.data;
                    obj.value.description = response.data.description;
                    obj.value.location_id = response.data.location_id;
                    obj.value.initial_date = response.data.initial_date;
                    obj.value.final_date = response.data.final_date;
                    obj.value.initial_time = response.data.initial_time;
                    obj.value.final_time = response.data.final_time;
                    obj.value.type_event_id = response.data.type_event_id;
                    obj.value.status_event_id = response.data.status_event_id;
                    obj.value.inscription_fee = response.data.inscription_fee;
                    obj.value.total_participants = response.data.total_participants;
                    obj.value.available_slots = response.data.available_slots;
                    obj.value.quantity_quadrilateral = response.data.quantity_quadrilateral;
                    obj.value.content = response.data.content;
                }
            }
        };

        // Función para obtener los datos si estamos en edición
        const fetchEventsTypes = async () => {
            const response = await fetchAll('typesevent');
            if (response.success) {
                eventstypes.value = response.data
            }
        };

        const fetchEventsStatus = async () => {
            const response = await fetchAll('statusevent');
            if (response.success) {
                statusevent.value = response.data
            }
        };

        const fetchLocations = async () => {
            const response = await fetchAll('location');
            if (response.success) {
                locations.value = response.data
            }
        };


        // Función para guardar los datos (crear o actualizar)
        const saveData = async () => {
            try {
                if (isEditing.value) {
                    const response = await update(collection, props.eventid, obj.value);
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
            if (isEditing.value) await fetchProduct();
            fetchLocations()
            fetchEventsTypes()
            fetchEventsStatus()
        });

        watch(() => props.eventid, async (newId) => {
            if (newId) await fetchProduct();
            fetchLocations()
            fetchEventsTypes()
            fetchEventsStatus()
        });

        const handleEventTypeSelected = (itemSelected) => {
            obj.value.type_event_id = (itemSelected.id)
        }

        const handleLocationSelected = (itemSelected) => {
            obj.value.location_id = (itemSelected.id)
        }

        const handleEventStatusSelected = (itemSelected) => {
            obj.value.status_event_id = (itemSelected.id)
        }


        return {
            obj,
            isEditing,
            saveData,
            error,
            validateForm,
            locations,
            eventstypes,
            statusevent,
            handleEventTypeSelected,
            handleLocationSelected,
            handleEventStatusSelected,

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
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                            for="description">Descripcion</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text" name="description" id="description" v-model="obj.description">
                    </div>

                </div>

                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <SelectComponent :data="eventstypes" :title="'Tipo de Evento'"
                            :selectedOption="obj.type_event_id" @obj-selected="handleEventTypeSelected" />
                    </div>
                    <div class="w-full">
                        <SelectComponent :data="statusevent" :title="'Estado de Evento'"
                            :selectedOption="obj.status_event_id" @obj-selected="handleEventTypeSelected" />
                    </div>
                </div>

                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="email">Fecha
                            Inicio</label>
                        <!-- <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text" name="email" id="email" v-model="obj.initial_date"> -->
                        <DatePicker v-model="obj.initial_date" showIcon fluid iconDisplay="input" />
                    </div>
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="email">Fecha
                            Fin</label>
                        <!-- <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text" name="email" id="email" v-model="obj.final_date"> -->
                        <DatePicker v-model="obj.final_date" showIcon fluid iconDisplay="input" />
                    </div>
                </div>

                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="email">Hora
                            Inicio</label>
                        <!-- <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text" name="email" id="email" v-model="obj.initial_time"> -->
                        <DatePicker v-model="obj.initial_time" showIcon fluid iconDisplay="input" timeOnly>
                            <template #inputicon="slotProps">
                                <i class="pi pi-clock" @click="slotProps.clickCallback" />
                            </template>
                        </DatePicker>
                    </div>
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="email">Hora
                            Fin</label>
                        <!-- <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text" name="email" id="email" v-model="obj.final_time"> -->
                        <DatePicker v-model="obj.final_time" showIcon fluid iconDisplay="input" timeOnly>
                            <template #inputicon="slotProps">
                                <i class="pi pi-clock" @click="slotProps.clickCallback" />
                            </template>
                        </DatePicker>
                    </div>
                </div>

                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full ">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="email">Costo de
                            Evento (0 si es
                            Torneo)</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="number" name="email" id="email" v-model="obj.inscription_fee">
                    </div>
                    <div class="w-full ">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="email">Cantidad
                            Disponibles</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="number" name="email" id="email" v-model="obj.available_slots">
                    </div>
                    <div class="w-full ">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="email">Cantidad
                            Cuadrilateros</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="number" name="email" id="email" v-model="obj.quantity_quadrilateral">
                    </div>
                    <div class="w-full ">
                        <SelectComponent :data="locations" :title="'Lugar del Evento'" :selectedOption="obj.location_id"
                            @obj-selected="handleLocationSelected" />
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

</template>
