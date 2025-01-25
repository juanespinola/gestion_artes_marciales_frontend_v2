<script>
import AdminLayout from '@/layouts/AdminLayout.vue';
import CardComponent from '@/components/Card/CardComponent.vue';
import useData from '@/composables/useData';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import BasicTableComponent from '@/components/BasicTable/BasicTableComponent.vue';

export default {
    components: { AdminLayout, CardComponent, BasicTableComponent },
    setup() {
        const collection = 'permission';
        const newDataRoute = 'NewPermission';
        const editDataRoute = 'EditPermission';
        const router = useRouter();
        const columns = [
            { field: 'name', header: 'Descripción' },
            { field: 'group_name', header: 'Grupo' },
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
            if (response.success) {
                await fetchData(); // Recargar datos después de eliminar
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
