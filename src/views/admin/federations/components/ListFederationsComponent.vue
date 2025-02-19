<script>

import CardComponent from '@/components/Card/CardComponent.vue';
import useData from '@/composables/useData';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import BasicTableComponent from '@/components/BasicTable/BasicTableComponent.vue';
import { useNotificationStore } from '@/stores/notification';

export default {
    components: { CardComponent, BasicTableComponent },
    setup() {
        const notificationStore = useNotificationStore()
        const collection = 'federation';
        const newDataRoute = 'NewFederation';
        const editDataRoute = 'EditFederation';
        const router = useRouter();
        const columns = [
            { field: 'description', header: 'Descripción' },
            { field: 'status', header: 'Estado' },
        ];
        const data = ref([]);
        const { isLoading, error, fetchAll, destroy } = useData();

        const fetchData = async () => {
            const response = await fetchAll(collection);
            if (response.success) {
                data.value = response.data;
            }
        };

        const newData = () => {
            router.push({ name: newDataRoute });
        };

        const editData = (id) => {
            router.push({ name: editDataRoute, params: { id } });
        };

        const deleteData = async (id) => {
            const response = await destroy(collection, id);
            if (!response.success) {
                if (typeof response?.message === "string") {
                    notificationStore.error("Error!", response?.message);
                } else if (typeof response?.message === "object" && response?.message !== null) {
                    Object.values(response?.message).forEach((errors) => {
                        if (Array.isArray(errors)) {
                            errors.forEach((error) => notificationStore.error("Error!", error));
                        } else {
                            notificationStore.error("Error!", errors);
                        }
                    });
                } else {
                    notificationStore.error("Error!", "Ocurrió un error desconocido.");
                }
                return;
            }
            if (response.success) {
                await fetchData(); // Recargar datos después de eliminar
                notificationStore.success(null, response?.data.messages)
            }
        };

        onMounted(() => {
            fetchData(); // Cargar los datos al montar el componente
        });

        return {
            data,
            isLoading,
            error,
            columns,
            collection,
            newDataRoute,
            editDataRoute,
            router,
            fetchData,
            newData,
            editData,
            deleteData,
        };
    },
};
</script>

<template>
    <BasicTableComponent 
        :data="data" 
        :columns="columns"
        :newData="newData"
        :editData="editData"
        :deleteData="deleteData"
    />
</template>
