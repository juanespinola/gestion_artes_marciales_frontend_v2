<script>
import useData from '@/composables/useData';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import TabsDetailEventsComponent from './TabsDetailEventsComponent.vue';
import { useUserStore } from '@/stores/user';

export default {
    components: {
        TabsDetailEventsComponent
    },
    props: {
        id: {
            type: String,
            required: true,
        }
    },
    setup(props) {
        const collection = `events/${props.id}/eventdetail`;
        const data = ref({});
        const { isLoading, error, fetchAll, destroy } = useData();
        const router = useRouter();
        const fetchData = async () => {
            const response = await fetchAll(collection);
            if (response.success) {
                data.value = response.data;
            }
        };
        const userStore = useUserStore()

        onMounted(async () => {
            await fetchData(); // Cargar los datos al montar el componente
        });

        
        const handleAthleteInscription = () => {
            if(!userStore.isOnline){
                router.push({ name: "Login"})
                return;
            }
            router.push({ name: "NewRegisterEvent"})
        }

        return {
            data,
            isLoading,
            error,
            router,
            fetchData,
            handleAthleteInscription,
            
        };
    }
}
</script>

<template>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-semibold text-black dark:text-white">{{ data.description }}</h2>
        <button
            @click="handleAthleteInscription"
            class="inline-flex items-center justify-center gap-2.5 py-2 px-3 text-center font-medium hover:bg-opacity-90 bg-primary text-white">
            Inscripcion
        </button>
    </div>

    <div class="">

        <!-- <div
        class="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">-->
        <div class="relative z-20 h-35 md:h-65 border-b border-stroke dark:border-strokedark dark:bg-boxdark">
            <img :src="data?.media_event?.route_file ? data?.media_event?.route_file : 'https://cloudfront-us-east-1.images.arcpublishing.com/metroworldnews/DR4BZQ466JFDFPWA5R3J5LTIY4.jpg'"
                alt="profile cover" class="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center">
        </div>


        <div class="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <div class="mt-4">
                <h3 class="my-5 text-2xl font-medium text-black dark:text-white">Evento: {{
                    data?.type_event?.description
                    }} | Estado: {{ data?.status_event?.description }}</h3>
                <div class="flex items-center justify-between">
                    <!-- <p class="font-medium">{{ data.created_at }}</p> -->
                    <!-- <h4 class="font-medium text-black dark:text-white">Categoria: {{ data.category_new.description }}
                    </h4> -->
                </div>

                <div class="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
                    <div
                        class="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
                            <div
                                class="flex items-center justify-center gap-2 last:border-b-0 border-b border-stroke pb-5 last:pb-0 dark:border-strokedark xl:border-b-0 xl:border-r last:xl:border-r-0 xl:pb-0">
                                <div>
                                    <h4 class="mb-0.5 text-xl font-medium text-black dark:text-white md:text-title-lg">
                                        {{ data.initial_date }} | {{ data.initial_time }}</h4>
                                    <!-- <p class="font-medium">{{ data.initial_date	}} | {{ data.initial_time	}}</p> -->
                                </div>
                            </div>
                            <div
                                class="flex items-center justify-center gap-2 last:border-b-0 border-b border-stroke pb-5 last:pb-0 dark:border-strokedark xl:border-b-0 xl:border-r last:xl:border-r-0 xl:pb-0">
                                <div>
                                    <h4 class="mb-0.5 text-xl font-medium text-black dark:text-white md:text-title-lg">
                                        {{ data?.location?.description }}</h4>
                                    <!-- <p class="text-sm font-medium">{{ data.location.description }}</p> -->
                                </div>

                            </div>
                            <div
                                class="flex items-center justify-center gap-2 last:border-b-0 border-b border-stroke pb-5 last:pb-0 dark:border-strokedark xl:border-b-0 xl:border-r last:xl:border-r-0 xl:pb-0">
                                <div>
                                    <h4 class="mb-0.5 text-xl font-medium text-black dark:text-white md:text-title-lg">
                                        {{
                                            data?.location?.city.country.description }} | {{
                                        data?.location?.city.description }}
                                    </h4>
                                    <!-- <p class="text-sm font-medium">{{ data.location.city.country.description }} | {{ data.location.city.description }}</p> -->
                                </div>

                            </div>
                            <div
                                class="flex items-center justify-center gap-2 last:border-b-0 border-b border-stroke pb-5 last:pb-0 dark:border-strokedark xl:border-b-0 xl:border-r last:xl:border-r-0 xl:pb-0">
                                <div>
                                    <h4 class="mb-0.5 text-xl font-medium text-black dark:text-white md:text-title-lg">
                                        {{ data?.entry_category?.length > 0 ? "Precio en Categorías" :
                                        data?.inscription_fee + " Gs" }}
                                    </h4>
                                    <!-- <p class="text-sm font-medium">Costo</p> -->
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <TabsDetailEventsComponent :data="data" />
                
            </div>
        </div>
    </div>
    <!-- </div> -->


</template>