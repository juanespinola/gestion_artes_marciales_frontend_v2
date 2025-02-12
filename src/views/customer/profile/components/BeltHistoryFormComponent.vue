<script>

import { useRouter } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import useData from '@/composables/useData'
import SelectComponent from '@/components/Select/SelectComponent.vue';
import { useUserStore } from '@/stores/user';
import DatePicker from 'primevue/datepicker';

export default {
    components: {
        SelectComponent,
        DatePicker
    },
    props: {
        id: {
            type: String,
            required: false,
        },
    },
    setup(props) {
        const { update, create, find } = useData();
        const collection = 'athlete/belthistory';
        const obj = ref({
            belt_id: '',
            athlete_id: '',
            federation_id: '',
            achieved: '',
            promoted_by: '',
        });
        const error = ref(null);
        const router = useRouter();
        const isEditing = computed(() => !!props.id);
        const belts = ref([])
        const userStore = useUserStore()
        // Función para obtener los datos si estamos en edición
        const fetchProduct = async () => {
            const response = await find(collection, props.id);
            if (response.success) {
                obj.value = response.data
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
            if (isEditing.value) await fetchProduct();
            fetchBelts()
            obj.value.athlete_id = userStore.user.id
            obj.value.federation_id = userStore.user.federation.id
            
        });

        watch(() => props.id, async (newId) => {
            if (newId) await fetchProduct();
            fetchBelts()
        });


        const handleBeltSelected = (itemSelected) => {
            obj.value.belt_id = (itemSelected.id)
        }



        return {
            obj,
            isEditing,
            saveData,
            error,
            validateForm,
            belts,
            handleBeltSelected
        };
    }
}
</script>

<template>

    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">{{ 'Perfil del Atleta' }}</h3>
        </div>
        <div class="p-7">
            <form @submit.prevent="saveData">
                {{ obj }}
                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-3/4">
                        <SelectComponent :data="belts" :title="'Cinturón'" :selectedOption="obj.belt_id"
                            @obj-selected="handleBeltSelected" />
                    </div>

                    <div>
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="name">Fecha de
                            obtención</label>
                        <DatePicker v-model="obj.achieved" size="large" />
                    </div>

                </div>

                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                            for="promoted_by">Otorgado Por</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text" name="promoted_by" id="promoted_by" v-model="obj.promoted_by">
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
