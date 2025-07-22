<script>
import useData from '@/composables/useData';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';

export default {
    components: {},
    setup() {
        const userStore = useUserStore()
        const collection = `federations/${userStore.federation.id}/news`;
        const newDetailDataRoute = 'NewsAthleteDetail';
        const router = useRouter();
        const data = ref([]);
        const { isLoading, error, fetchAll, destroy } = useData();

        const fetchData = async () => {
            const response = await fetchAll(collection);
            console.log(response)
            if (response.success) {
                data.value = response.data;
            }
        };

        const newDetailData = (id) => {
            router.push({ name: newDetailDataRoute , params: { id }});
        };


        onMounted(() => {
            fetchData(); // Cargar los datos al montar el componente
        });

        return {
            data,
            isLoading,
            error,
            router,
            fetchData,
            newDetailData,
            
        };
    },

}
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7.5">
        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
            v-for="notice of data"
            @click="newDetailData(notice.id)">
            <div
                class="router-link-active router-link-exact-active block px-4 pt-4">
                <img :src="notice?.media_new_list?.route_file ? notice?.media_new_list?.route_file : 'https://sapaf.gob.mx/images/titulos/NOTICIAS.png'" >
            </div>
            <div class="p-6">
                <h4 class="mb-3 text-xl font-semibold text-black dark:text-white">
                    <div
                        class="router-link-active router-link-exact-active">{{ notice.title }}
                    </div>
                </h4>
                <div class="flex items-center justify-between">
                    <span>{{ notice.category_new.description }}</span>
                    <span>{{ notice.created_at }}</span>
                </div>
            </div>
        </div>
    </div>
</template>