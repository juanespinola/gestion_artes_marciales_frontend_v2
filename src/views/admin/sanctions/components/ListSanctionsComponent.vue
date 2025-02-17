<script>
import useData from '@/composables/useData';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import BasicTableComponent from '@/components/BasicTable/BasicTableComponent.vue';
import { useNotificationStore } from '@/stores/notification';

export default {
    components: { BasicTableComponent },
    props: {
        athleteid: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const notificationStore = useNotificationStore()
        const collection = 'sanction';
        const newDataRoute = 'NewSanction';
        const editDataRoute = 'EditSanction';
        const router = useRouter();
        const columns = [
            { field: 'description', header: 'Descripción' },
            // { field: 'comments', header: 'Motivos' },
        ];
        const data = ref([]);
        const { isLoading, error, fetchAll, destroy } = useData();

        const fetchData = async (athleteid) => {
            const response = await fetchAll(`sanction/${athleteid}/athletes`);
            if (response.success) {
                data.value = response.data;
            }
        };

        const newData = () => {
            router.push({ name: newDataRoute, params: { athleteid: props.athleteid} });
        };

        const editData = (id) => {
            router.push({ name: editDataRoute, params: { id:id, athleteid: props.athleteid } });
        };

        const deleteData = async (id) => {
            const response = await destroy(collection, id);
            if (response.success) {
                await fetchData(); // Recargar datos después de eliminar
                notificationStore.success(null, response?.data.messages)
            }
        };

        onMounted(() => {
            fetchData(props.athleteid); // Cargar los datos al montar el componente
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
