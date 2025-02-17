<script>
import useData from '@/composables/useData';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import BasicTableComponent from '@/components/BasicTable/BasicTableComponent.vue';
import { useNotificationStore } from '@/stores/notification';

export default {
    components: { BasicTableComponent },
    props: {
        countryId: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const notificationStore = useNotificationStore()
        const collection = 'city';
        const newDataRoute = 'NewCity';
        const editDataRoute = 'EditCity';
        const router = useRouter();
        const columns = [
            { field: 'description', header: 'Descripción' },
        ];
        const data = ref([]);
        const { isLoading, error, fetchAll, destroy } = useData();

        const fetchData = async (countryId) => {
            const response = await fetchAll(`city/bycountry/${countryId}`);
            if (response.success) {
                data.value = response.data;
            }
        };

        const newData = () => {
            router.push({ name: newDataRoute, params: { countryId: props.countryId } });
        };

        const editData = (id) => {
            router.push({ name: editDataRoute, params: { id, countryId:props.countryId } });
        };

        const deleteData = async (id) => {
            const response = await destroy(collection, id);
            if (response.success) {
                await fetchData(); // Recargar datos después de eliminar
                notificationStore.success(null, response?.data.messages)
            }
        };

        onMounted(() => {
            fetchData(props.countryId); // Cargar los datos al montar el componente
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
