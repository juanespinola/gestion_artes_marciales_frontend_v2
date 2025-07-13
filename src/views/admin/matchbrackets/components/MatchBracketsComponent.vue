<script>
import CardComponent from "@/components/Card/CardComponent.vue";
import { ref, computed, onMounted, watch } from 'vue';
import useData from '@/composables/useData';
import { useRouter, useRoute } from 'vue-router'
import UpdateMatchModalFormComponent from "./UpdateMatchModalFormComponent.vue";
import MatchBracketImparComponent from "./MatchBracketImparComponent.vue";
import MatchBracketParComponent from "./MatchBracketParComponent.vue";

export default {
    components: {
        CardComponent,
        UpdateMatchModalFormComponent,
        MatchBracketImparComponent,
        MatchBracketParComponent
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
            console.log(response)
            if (response.success) {
                data.value = response?.data;

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

        onMounted(async () => {
            obj.value.event_id = props.eventid
            obj.value.entry_category_id = props.entrycategoryid

            await fetchData()
        });

       

        return {
            data,
            checkFromBye,
            router,
            openMatchModal,
            closeMatchModal,
            modalMatchData,
            isModalMatchOpen,
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
       
        <div v-if="data.count_match % 2 == 0">
            <MatchBracketParComponent :node="data.matches" @openMatchModal="openMatchModal"/>
        </div>
        <div v-if="data.count_match % 2 != 0">
            <MatchBracketImparComponent :node="data.matches" @openMatchModal="openMatchModal"/>
        </div>
       
        <UpdateMatchModalFormComponent :isOpen="isModalMatchOpen" :title="'Actualizar Combate'" :data="modalMatchData"
            @close="closeMatchModal" />

    </CardComponent>



</template>


<style>




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