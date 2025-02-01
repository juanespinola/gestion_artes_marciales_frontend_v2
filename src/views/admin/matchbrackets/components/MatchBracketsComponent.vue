<script>
import CardComponent from "@/components/Card/CardComponent.vue";
import { ref, computed, onMounted, watch } from 'vue';
import useData from '@/composables/useData';

export default {
    components: {
        CardComponent
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
        const { isLoading, error, create } = useData();
        const obj = ref({
            entry_category_id: '',
            event_id: '',
        })

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

        onMounted(() => {
            obj.value.event_id = props.eventid
            obj.value.entry_category_id = props.entrycategoryid

            fetchData()
        })

        return {
            data,
            checkFromBye
        }

    }
}
</script>


<template>
    <CardComponent>
        <div class="border-b border-stroke px-4 py-4 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">Llaves de Combate</h3>
        </div>
        <div class="flex mr-3 ">
            <ol class="flex flex-1 flex-col justify-around mr-5 matchbracket h-auto" v-for="(matchbracket, index) of data"
                :class="{ 'ml-5': index > 0 }" :key="index">
                <div class="border-b border-stroke px-4 py-4 dark:border-strokedark">
                    <h3 class="font-medium text-black dark:text-white"> {{ matchbracket.phase }} {{
                        matchbracket.number_phase }} {{ data.length }}</h3>
                </div>
                <div class="flex flex-1 flex-col justify-center h-auto justify-around">
                    <li v-for="(match, matchIndex) in matchbracket.matches" :key="matchIndex"
                        class="flex flex-col justify-center  m-2 p-1 leading-relaxed bg-gray-600 text-gray-300 relative with-connector"
                        :class="{
                            'with-bye': match.athlete_one && !match.athlete_two,
                            'from-bye': checkFromBye(matchbracket.number_phase, match.athlete_one),
                            'round-winner': matchbracket.number_phase == data.length
                        }">
                        <div>
                            <div v-if="match.athlete_one" class="border-b border-stroke">
                                <span class="w-6 h-6 ml-1 mr-1 inline-block bg-gray-300 rounded-full"></span>
                                {{ match.athlete_one.name }}
                            </div>
                            <div v-if="match.athlete_two">
                                <span class="w-6 h-6 ml-1 mr-1 inline-block bg-gray-300 rounded-full"></span>
                                {{ match.athlete_two.name }}
                            </div>
                            <div v-if="!match.athlete_one && !match.athlete_two && match.bracket.status == 'pendiente' && matchbracket.number_phase > 1">
                                <span class="w-6 h-6 ml-1 mr-1 inline-block bg-gray-300 rounded-full"></span>
                                Ganador Fase {{ matchbracket.number_phase - 1 }}
                            </div>
                            <div v-else-if="match.athlete_one && !match.athlete_two">
                                <span class="w-6 h-6 ml-1 mr-1 inline-block bg-gray-300 rounded-full"></span>
                                Bye
                            </div>
                        </div>
                    </li>
                </div>
            </ol>
        </div>

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
    height: 45px;
}

.matchbracket:nth-child(2) .with-connector:after {
    height: 80px;
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
    top: 60%;
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
</style>