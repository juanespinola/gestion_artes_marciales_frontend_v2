<script>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import useData from '@/composables/useData';
import { useNotificationStore } from '@/stores/notification';

export default {
    components: {
        
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
        const collection = 'rol';
        const permissionsbygroup = ref([])

        const obj = ref({
            permissions:[]
        });

        const error = ref(null);
        const router = useRouter();
        const isEditing = computed(() => !!props.id);

        const switcherToggle = ref(false)

        // Función para obtener los datos si estamos en edición
        const fetchProduct = async () => {
            if (isEditing.value) {
                const response = await find(collection, props.id);
                if (response.success) {
                    obj.value = response.data.roles
                    // obj.value.permissions = response.data.permissions.map((p) => p.id);
                }
            }
        };

        const fetchPermissions = async () => {
            const response = await fetchAll('permissionsbygroup')
            if (response.success) {
                permissionsbygroup.value = response.data
            }
        }

        // Función para guardar los datos (crear o actualizar)
        const saveData = async () => {
            try {
                if (isEditing.value) {
                    const response = await update(collection, props.id, { 
                        name: obj.value.name, 
                        rolePermissionArray: [...obj.value.permissions.map((p) => p.name)]	 
                    });
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

        const togglePermission = (permission) => {
            const index = obj.value?.permissions.findIndex((per) => per.id === permission.id);
            if (index === -1) {
                // Agregar permiso si no está en la lista
                obj.value.permissions.push(permission);
            } else {
                // Eliminar permiso si ya está en la lista
                obj.value.permissions.splice(index, 1);
            }
        };

        const isSelected = (permission) => {
            return obj.value?.permissions?.some((per) => per.id === permission.id)
        };


        // Llamar a fetchProduct cuando el componente se monta o cuando cambia el id
        onMounted(async () => {
            if (isEditing.value) await fetchProduct();
            await fetchPermissions()

        });

        watch(() => props.id, async (newId) => {
            if (newId) {
                await fetchProduct();
            }
        },
            { immediate: true });

        return {
            obj,
            isEditing,
            saveData,
            error,
            validateForm,
            switcherToggle,
            permissionsbygroup,
            isSelected,
            togglePermission
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
                            for="name">Descripción</label>
                        <input
                            class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text" name="name" id="name" v-model="obj.name">
                    </div>
                </div>

                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white">Lista
                            de Permisos</label>
                        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                            <div v-for="(permission, index) in permissionsbygroup" :key="permission.id">
                                <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">
                                    {{ permission.group_name.toUpperCase() }}
                                </h4>
                                <div v-for="(row, index) in permission.permissions" :key="row.id">
                                    <label class="flex cursor-pointer select-none items-center my-2">
                                        <input type="checkbox" 
                                            :id="row.id" 
                                            :value="row.id"
                                            :checked="isSelected(row)" 
                                            @change="togglePermission(row)"
                                            class="mr-2" />
                                        <div>{{ row.name }}</div>
                                    </label>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <!-- <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                            <div v-for="(row, index) in obj.permissions" :key="row.id">
                                <label class="flex cursor-pointer select-none items-center my-2">
                                    <input type="checkbox" :id="row.id" :value="row.id"
                                        :checked="isSelected(row.id)" @change="togglePermission(row.id)"
                                        class="mr-2" />
                                    <div>{{ row.name }}</div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div> -->

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
