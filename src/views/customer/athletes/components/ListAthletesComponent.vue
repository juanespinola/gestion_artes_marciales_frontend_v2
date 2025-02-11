<script>
import useData from '@/composables/useData';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import ListAthletesGoldMedalWinComponent from './ListAthletesGoldMedalWinComponent.vue';
import ListAthletesWinLoseDifferenceComponent from './ListAthletesWinLoseDifferenceComponent.vue'
import ListAthletesMostActiveComponent from './ListAthletesMostActiveComponent.vue';

export default {
    components: {
        ListAthletesGoldMedalWinComponent,
        ListAthletesWinLoseDifferenceComponent,
        ListAthletesMostActiveComponent,
    },
    setup() {
        const userStore = useUserStore()
        const collection = `athleteswinmedals`;
        const newDetailDataRoute = 'NewsAthleteDetail';
        const router = useRouter();
        const data = ref([]);
        const winLoseDifference = ref([])
        const athletesMostActive = ref([])
        const { isLoading, error, fetchAll } = useData();

        const fetchData = async () => {
            const response = await fetchAll(collection);
            if (response.success) {
                data.value = response.data;
            }
        };


        const fetchWinLoseDifferenceData = async () => {
            const response = await fetchAll('athleteswinlosedifference');
            if (response.success) {
                winLoseDifference.value = response.data;
            }
        };


        const fetchMostActiveData = async () => {
            const response = await fetchAll('athletesmostactive');
            if (response.success) {
                athletesMostActive.value = response.data;
            }
        };

        const newDetailData = (id) => {
            router.push({ name: newDetailDataRoute, params: { id } });
        };


        onMounted(() => {
            fetchData(); // Cargar los datos al montar el componente
            fetchWinLoseDifferenceData()
            fetchMostActiveData()
        });

        return {
            data,
            winLoseDifference,
            athletesMostActive,
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
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-semibold text-black dark:text-white">Top 10 Atletas</h2>
        <div></div>
    </div>
    <div class="grid grid-cols-1 gap-9 md:grid-cols-3">
        
        <ListAthletesGoldMedalWinComponent :data="data"/>
        <ListAthletesWinLoseDifferenceComponent :data="winLoseDifference"/>
        <ListAthletesMostActiveComponent :data="athletesMostActive"/>
        

        
    </div>
</template>