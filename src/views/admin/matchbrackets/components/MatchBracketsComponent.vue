<script>
import CardComponent from "@/components/Card/CardComponent.vue";
import { ref, computed, onMounted, watch } from 'vue';
import useData from '@/composables/useData';
import { useRouter, useRoute } from 'vue-router'
import UpdateMatchModalFormComponent from "./UpdateMatchModalFormComponent.vue";

export default {
    components: {
        CardComponent,
        UpdateMatchModalFormComponent
    },
    props: {
        eventid: {
            type: String,
            required: true,
        },
        entrycategoryid: {
            type: String,
            required: true,
        }
    },
    setup(props) {
        const collection = 'matchbracket';
        const data = ref([]);
        const router = useRouter();
        const { isLoading, error, create } = useData();
        const obj = ref({
            entry_category_id: '',
            event_id: '',
        })

        const isModalMatchOpen = ref(false)
        const modalMatchData = ref({});


        const fetchData = async () => {
            const response = await create(collection, obj.value);
            if (response.success) {
                data.value = response.data;
            }
        };


        const checkFromBye = (phase, athlete) => {
            if (!athlete) return false;
            return data.value.some(bracket =>
                bracket.number_phase === phase + 1 &&
                bracket.matches.some(match => match.athlete_one?.id === athlete.id || match.athlete_two?.id === athlete.id)
            );
        }

        const openMatchModal = (data) => {
            modalMatchData.value = data
            isModalMatchOpen.value = true;
        }

        const closeMatchModal = () => {
            isModalMatchOpen.value = false;
            fetchData()
        }

        onMounted(() => {
            obj.value.event_id = props.eventid
            obj.value.entry_category_id = props.entrycategoryid

            fetchData()
        });

        const formatAthleteOne = (data) => {

            if (!data.athlete_one && data.bracket.number_phase > 1) {
                return "Atleta"
            }

            if (!data.athlete_one && !data.athlete_two) {
                return "Atleta"
            }

            return data.athlete_one.name
        }

        const formatAthleteTwo = (data) => {

            if (!data.athlete_two && data.bracket.number_phase > 1) {
                return "Atleta"
            }

            if (!data.athlete_one && !data.athlete_two) {
                return "Atleta"
            }

            if (data.athlete_one && !data.athlete_two) {
                return 'Bye'
            }

            return data.athlete_two.name
        }

        return {
            data,
            checkFromBye,
            router,
            openMatchModal,
            closeMatchModal,
            modalMatchData,
            isModalMatchOpen,
            formatAthleteOne,
            formatAthleteTwo,
        }

    }
}
</script>


<template>
    <CardComponent>
        <div class="border-b border-stroke px-4 py-4 dark:border-strokedark flex justify-between items-center">
            <h3 class="font-medium text-black dark:text-white">Llaves de Combate</h3>
            <button
                class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white bg-meta-3"
                @click="router.go(-1)">Inscriptos</button>
        </div>
        <div class="flex mr-30">
            <ol class="flex flex-1 flex-col justify-around mr-5 matchbracket h-auto"
                v-for="(matchbracket, index) of data" :class="{ 'ml-5': index > 0 }" :key="index">
                <div class="border-b border-stroke px-4 py-4 dark:border-strokedark">
                    <h2 class="font-medium text-black dark:text-white"> {{ matchbracket.phase }}</h2>
                </div>
                <div class="flex flex-1 flex-col justify-center h-auto justify-around">
                    <li v-for="(match, matchIndex) in matchbracket.matches" :key="matchIndex"
                        class="flex flex-col justify-center m-2 p-1 leading-relaxed bg-gray-600 text-gray-300 relative with-connector"
                        :class="{
                            'with-bye': match.athlete_one && !match.athlete_two && match.bracket.number_phase == 1,
                            'from-bye': checkFromBye(matchbracket.number_phase, match.athlete_one),
                            'round-winner': matchbracket.number_phase == data.length
                        }">

                        <div @click="openMatchModal(match)" class="relative group inline-block">


                            <div class="relative">
                                <!-- Contenedor del Tooltip -->
                                <div
                                    class="absolute left-full top-1/2 -translate-y-[30%] p-3 max-w-xs min-w-[150px] w-auto bg-gray-300 text-black rounded shadow-md hidden group-hover:flex flex-col space-y-1 z-10">
                                    <!-- Flecha del Tooltip -->
                                    <div
                                        class="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-full w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-gray-300">
                                    </div>

                                    <span class="font-semibold">Combate #{{ match.id }}</span>
                                    <span><label class="font-semibold">Estado: </label>{{ match.bracket.status }}</span>
                                    <span>
                                        <label class="font-semibold">Puntaje:</label> {{ match.score_one_athlete ?? 0 }}
                                        - {{ match.score_two_athlete ?? 0 }}
                                    </span>
                                    <span v-if="match.bracket.status == 'finalizado'">
                                        <label class="font-semibold">Ganador:</label> {{ match.athlete_id_winner ===
                                            match.athlete_one.id ?
                                            match.athlete_one.name : match.athlete_two.name }}
                                    </span>
                                    <span class="text-sm text-gray-600">{{ match.bracket.match_time }}</span>
                                </div>
                            </div>

                            <div class="border-b border-stroke flex items-center py-1">
                                <span class="w-6 h-6 mx-1 inline-block rounded-full bg-gray-300" :class="{
                                    'dark:bg-meta-3 bg-meta-3': match.athlete_id_winner && match.athlete_id_winner === (match.athlete_one ? match.athlete_one.id : null),
                                    'dark:bg-meta-1 bg-meta-1': match.athlete_id_loser && match.athlete_id_loser === (match.athlete_one ? match.athlete_one.id : null)
                                }"></span>
                                {{ formatAthleteOne(match) }}
                            </div>

                            <div class="flex items-center py-1">
                                <span class="w-6 h-6 mx-1 inline-block rounded-full bg-gray-300" :class="{
                                    'dark:bg-meta-3 bg-meta-3': match.athlete_id_winner && match.athlete_id_winner === (match.athlete_two ? match.athlete_two.id : null),
                                    'dark:bg-meta-1 bg-meta-1': match.athlete_id_loser && match.athlete_id_loser === (match.athlete_two ? match.athlete_two.id : null)
                                }"></span>
                                {{ formatAthleteTwo(match)}}
                            </div>

                        </div>
                    </li>
                </div>
            </ol>
        </div>

        <UpdateMatchModalFormComponent :isOpen="isModalMatchOpen" :title="'Actualizar Combate'" :data="modalMatchData"
            @close="closeMatchModal" />

    </CardComponent>



</template>


<style>
.with-connector:after {
    content: ' ';
    position: absolute;
    left: calc(100% + 0.5rem);
    width: 1.25rem;
    border: 2px solid #e2e8f0;
    border-left: none;
}

.with-connector:nth-child(odd):after {
    top: 50%;
    border-bottom: none;
}

.with-connector:nth-child(even):after {
    bottom: 50%;
    border-top: none;
}


.matchbracket:nth-child(1) .with-connector:after {
    height: 50px;
}

.matchbracket:nth-child(2) .with-connector:after {
    height: 100px;
}

.matchbracket .round-winner.with-connector:after {
    width: 0;
    height: 0;
}

/*
  Incoming connector
 */
.matchbracket+.matchbracket .with-connector:before {
    content: ' ';
    position: absolute;
    left: -1.75rem;
    top: 61%;
    width: 1.25rem;
    border-top: 2px solid #e2e8f0;
}

/* 
  Byes
*/

.with-connector.with-bye {
    margin-top: 37px;
    margin-bottom: 37px;
}

.matchbracket .with-connector.with-bye:after {
    height: 0;
}

.with-connector.with-bye+.with-connector {
    display: none;
}

.bracket-match-dropdown-container {
    display: none;
    position: absolute;
    left: 50%;
    transform: translateX(50%) translateY(-25%);
    padding: 10px;
    z-index: 4;
}

.bracket-match-dropdown {
    display: flex;
    flex-direction: column;
    gap: calc(2 / 15 * 1rem);
    padding: calc(8 / 15 * 1rem) calc(12 / 15 * 1rem);
    border-radius: calc(4 / 15 * 1rem);
    background: #cecfd3;
    color: #000000;
}

.actions {
    display: flex;
    flex-direction: column;
    gap: calc(4 / 15 * 1rem);
}

.arrow-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: auto;
    width: calc(10 / 15 * 1rem);
}

.arrow {
    height: 50px;
    width: 100%;
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
    border-right: 50px solid #cecfd3;
}
</style>