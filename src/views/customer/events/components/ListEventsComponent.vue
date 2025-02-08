<script>
import useData from '@/composables/useData';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';

export default {
    components: {},
    setup() {
        const userStore = useUserStore()
        const collection = `federations/${userStore.federation.id}/events`;
        const EventDetailDataRoute = 'EventsAthleteDetail';
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

        const EventDetailData = (id) => {
            router.push({ name: EventDetailDataRoute, params: { id } });
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
            EventDetailData,

        };
    },

}
</script>

<template>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-semibold text-black dark:text-white">Eventos</h2>
        <div></div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7.5">
        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
            v-for="event of data" @click="EventDetailData(event.id)">
            <div class="p-8">
                <div class="flex items-center justify-between">
                    <span>{{ event.type_event.description }}</span>
                    <span>{{ event.status_event.description }}</span>
                </div>
                <div class="router-link-active router-link-exact-active block px-4 pt-4">
                    <!-- <img :src="event.media_event[0] " alt="Cards"> -->
                </div>
                <h4 class="my-5 text-xl font-semibold text-black dark:text-white">
                    <div class="router-link-active router-link-exact-active">{{ event.description }}
                    </div>
                </h4>
                <div
                    class="mx-auto mt-5 grid grid-cols-2 rounded-md border border-stroke shadow-1 dark:border-strokedark dark:bg-[#37404F]">
                    <div
                        class="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                        <span class="font-semibold text-black dark:text-white">Fecha: </span>
                        <span class="text-sm">{{ event.initial_date }}</span>
                    </div>
                    <div
                        class="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                        <span class="font-semibold text-black dark:text-white">Cupos Disp: </span>
                        <span class="text-sm">{{ event.available_slots }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>