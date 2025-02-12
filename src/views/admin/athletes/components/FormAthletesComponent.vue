<script>
import AdminLayout from '@/layouts/AdminLayout.vue';
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import useData from '@/composables/useData'
import MultiSelectComponent from '@/components/MultiSelect/MultiSelectComponent.vue';


/*
* TODO: nos enfrentamos al problema que en el back end no almacena un nuevo array luego de haber eliminado 
* los permisos que sacamos al admin
*/
export default {
    components: {
        AdminLayout,
        MultiSelectComponent
    },
    props: {
        id: {
            type: String,
            required: false,
        },
    },
    setup(props) {
        const { find, update, create, fetchAll } = useData();
        const collection = 'athlete';
        const obj = ref({
            name: '',
            email: '',
            rol: [],
        });
        const error = ref(null);
        const router = useRouter();
        const isEditing = computed(() => !!props.id);
        const roles = ref([])

        // Función para obtener los datos si estamos en edición
        const fetchProduct = async () => {
            if (isEditing.value) {
                const response = await find(collection, props.id);
                if (response.success) {
                    obj.value.name = response.data.name;
                    obj.value.email = response.data.email;
                    obj.value.rol = response.data.roles;
                }
            }
        };

        // Función para obtener los datos si estamos en edición
        const fetchRoles = async () => {
            const response = await fetchAll('rol');
            if (response.success) {
                roles.value = response.data;
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
            fetchRoles();
            if (isEditing.value) fetchProduct();
        });

        watch(() => props.id, (newId) => {
            fetchRoles();
            if (newId) fetchProduct();
        });

        const togglePermission = (permission) => {
            const index = obj.value?.rol.findIndex((per) => per.id === permission.id);
            if (index === -1) {
                // Agregar permiso si no está en la lista
                obj.value.rol.push(permission);
            } else {
                // Eliminar permiso si ya está en la lista
                obj.value.rol.splice(index, 1);
            }
        };

        const isSelected = (permission) => {
            return obj.value?.rol?.some((per) => per.id === permission.id)
        };

        return { obj, isEditing, saveData, error, validateForm, roles, isSelected, togglePermission };
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
                            for="name">Nombre</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text" name="name" id="name" placeholder="Destornillador Blanco" v-model="obj.name">
                    </div>
                </div>
                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                            for="email">E-mail</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text" name="email" id="email" placeholder="Destornillador Blanco" v-model="obj.email">
                    </div>
                </div>

                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <!-- <MultiSelectComponent :selected="obj.rol" :data="roles" :title="'Roles'" model="rol"/> -->
                        <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div class="w-full">
                                <label class="mb-3 block text-sm font-medium text-black dark:text-white">Roles</label>
                                <div class="grid grid-cols-4 gap-4">
                                    <div v-for="(row, index) in roles" :key="row.id">
                                        <label class="flex cursor-pointer select-none items-center my-2">
                                            <input type="checkbox" :id="row.id" :value="row.id"
                                                :checked="isSelected(row)" @change="togglePermission(row)"
                                                class="mr-2" />
                                            <div>{{ row.name }}</div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
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
