<script>
import useData from '@/composables/useData';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    props: {

    },
    setup() {
        const collection = 'ranking'
        const router = useRouter()
        const data = ref([]);
        const { isLoading, error, fetchAll } = useData();

        const fetchData = async () => {
            const response = await fetchAll(collection);
            if (response.success) {
                data.value = response.data;
            }
        };

        onMounted(async () => {
            await fetchData()
        })


        return {
            data
        }
    }

}
</script>

<template>
    <div class="grid grid-cols-1 gap-9">
        <div v-if="data.length > 0"
            class="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                <div class="my-4" v-for="row of data">
                    <h3 class="mb-5 text-2xl font-medium text-black dark:text-white">Cinturón {{ row.belt_color }}</h3>

                    <div class="w-full rounded-md border border-stroke py-2.5 dark:border-strokedark"
                        v-for="category of row.categories">
                        <div class="flex flex-col">
                            Categoría {{ category.category_name }}

                            <div class="flex items-center justify-between p-4.5 hover:bg-[#F9FAFB] dark:hover:bg-meta-4"
                                v-for="item_athlete of category.athletes">
                                <div class="flex items-center">
                                    <div class="mr-4 h-[50px] overflow-hidden rounded-full w-full ">
                                        <img :src="item_athlete?.athlete?.profile_image ? item_athlete?.athlete?.profile_image : 'https://i.pinimg.com/550x/a8/0e/36/a80e3690318c08114011145fdcfa3ddb.jpg'"
                                            alt="user" class="max-w-10 h-10 rounded-full object-cover object-center">
                                    </div>
                                    <div class="text-start">
                                        <h5 class="font-sm text-black dark:text-white">{{ item_athlete?.athlete?.name }}
                                        </h5>
                                        <!-- <span class="text-sm">{{ item_athlete?.athlete }}</span> -->
                                        <span class="text-sm">{{ item_athlete?.athlete?.country }}</span>
                                    </div>
                                </div>

                                <div class="flex items-center flex-grow justify-end gap-6">
                                    <div class="h-12 w-12 flex flex-col items-center text-[#9D5425]">
                                        <span class="text-sm font-bold">{{ item_athlete.total_points }}</span>
                                        <span class="text-xs">Puntos</span>
                                    </div>
                                    <div class="h-12 w-12 flex flex-col items-center text-meta-3">
                                        <span class="text-sm font-bold">{{ item_athlete.total_victories }}</span>
                                        <span class="text-xs">Ganadas</span>
                                    </div>
                                    <div class="h-12 w-12 flex flex-col items-center text-meta-1">
                                        <span class="text-sm font-bold">{{ item_athlete.total_defeats }}</span>
                                        <span class="text-xs ">Perdidas</span>
                                    </div>
                                </div>

                                <div class="flex items-center flex-grow justify-end">
                                    <div class="h-12 w-12 flex flex-col items-center">
                                        <span class="text-sm font-bold">{{ item_athlete.gold_medals }}</span>
                                        <img src="@/assets/images/athletes/medals/gold-medal.svg" alt="medal"
                                            class="h-6 w-6 object-cover">
                                    </div>
                                    <div class="h-12 w-12 flex flex-col items-center">
                                        <span class="text-sm font-bold">{{ item_athlete.silver_medals }}</span>
                                        <img src="@/assets/images/athletes/medals/silver-medal.svg" alt="medal"
                                            class="h-6 w-6 object-cover">
                                    </div>
                                    <div class="h-12 w-12 flex flex-col items-center">
                                        <span class="text-sm font-bold">{{ item_athlete.bronze_medals }}</span>
                                        <img src="@/assets/images/athletes/medals/bronze-medal.svg" alt="medal"
                                            class="h-6 w-6 object-cover">
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            En proceso de conteo de registros
        </div>

    </div>
</template>