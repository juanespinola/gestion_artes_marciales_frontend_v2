<script>
import useData from '@/composables/useData';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

export default {

    props: {
        id: {
            type: String,
            required: true,
        }
    },
    setup(props) {
        const collection = `news/${props.id}/newdetail`;
        const data = ref({});
        const { isLoading, error, fetchAll, destroy } = useData();
        const router = useRouter();
        const fetchData = async () => {
            const response = await fetchAll(collection);
            console.log(response)
            if (response.success) {
                data.value = response?.data;
            }
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
        };
    }
}
</script>

<template>
    <div
        class="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="relative z-20 h-35 md:h-65 border-b border-stroke dark:border-strokedark dark:bg-boxdark">
            <img :src="data?.media_new_detail?.route_file" alt="profile cover"
                class="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center">

        </div>
        <div class="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <div class="mt-4">
                <h3 class="my-5 text-2xl font-medium text-black dark:text-white">{{ data?.title }}</h3>
                <div class="flex items-center justify-between">
                    <p class="font-medium">{{ data?.created_at }}</p>
                    <h4 class="font-medium text-black dark:text-white">Categoria: {{ data?.category_new?.description }}</h4>
                </div>
                <div class="mt-10">
                    <p class="mt-4.5 text-sm font-normal"> {{ data?.content }}</p>
                </div>
                
            </div>
        </div>
    </div>
</template>