<script>
import useData from '@/composables/useData'
import { ref, onMounted, computed, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import SelectComponent from '@/components/Select/SelectComponent.vue';

export default {
    components: {
        SelectComponent
    },
    props: {
        isOpen: {
            type: Boolean,
            required: true
        },  // Controla si el modal está abierto
        title: {
            type: String,    // Título del modal
            required: true
        },
        data: {
            required: true
        },  // Mensaje dentro del modal
    },
    emits: ['close'], // Define el evento para cerrar el modal
    setup(props, { emit }) {
        const isEditing = computed(() => !!props.data.id);
        const obj = ref({
            match_bracket_id: "",
            score_one_athlete: "",
            score_two_athlete: "",
            athlete_id_winner: "",
            athlete_id_loser: "",
            match_timer: "",
            quadrilateral: "",
            victory_type_id: ""
        })
        const typesvictories = ref([])
        const collection = 'matchbracket/nextphase';
        const { create, fetchAll } = useData();
        const target = ref(null);
        // Función para obtener los datos si estamos en edición
        const fetchProduct = async () => {
            if (isEditing.value) {
                obj.value.match_bracket_id = props.data.bracket.match_bracket_id
                obj.value.score_one_athlete = props.data.score_one_athlete
                obj.value.score_two_athlete = props.data.score_two_athlete
                obj.value.athlete_id_winner = props.data.athlete_id_winner
                obj.value.athlete_id_loser = props.data.athlete_id_loser
                obj.value.match_timer = props.data.match_timer
                obj.value.quadrilateral = props.data.quadrilateral
                obj.value.victory_type_id = props.data.victory_type_id
            }
        };

        const fetchTypesVictories = async () => {
            const response = await fetchAll('typevictory');
            if (response.success) {
                typesvictories.value = response.data
            }
        };


        // Función para guardar los datos (actualizar)
        const saveData = async () => {
            try {
                if (isEditing.value) {
                    const response = await create(collection, obj.value);
                    if (response.success) {
                        console.log('Producto actualizado:', obj.value);
                        emit('close')
                    }
                }
            } catch (err) {
                console.error('Error al guardar el registro:', err.message);
            }
        };

        const handleTypeVictorySelected = (itemSelected) => {
            obj.value.victory_type_id = (itemSelected.id)
        }

        const handleAthleteWinner = (athlete_id_winner, athlete_id_loser) => {
            if(!athlete_id_winner && !athlete_id_loser){
                obj.value.athlete_id_winner = null
                obj.value.athlete_id_loser = null
                return;
            }
            obj.value.athlete_id_winner = athlete_id_winner
            obj.value.athlete_id_loser = athlete_id_loser
        }

        onMounted(() => {
            fetchTypesVictories()
            if (isEditing.value) fetchProduct();
        });

        watch(() => props.data.id, (newId) => {
            fetchTypesVictories()
            if (newId) fetchProduct();
        });

        // Click fuera para cerrar el dropdown
        onClickOutside(target, () => {
            emit('close')
        });

        return {
            obj,
            saveData,
            fetchProduct,
            target,
            typesvictories,
            handleTypeVictorySelected,
            handleAthleteWinner
        }
    },
};
</script>

<template>
    <div v-if="isOpen"
        class="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5">
        <div ref="target" class="w-full max-w-270  rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark">
            <form @submit.prevent="saveData">
                <h3 class="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                    {{ data?.athlete_one?.name }} VS {{ data?.athlete_two?.name }}
                </h3>
                <span class="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
                
                <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white">Puntaje Atleta Uno
                        </label>
                        <input type="number" v-model="obj.score_one_athlete"
                            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                    </div>
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white">Puntaje Atleta Dos
                        </label>
                        <input type="number" v-model="obj.score_two_athlete"
                            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                    </div>
                </div>

                <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white">Cuadrilatero
                        </label>
                        <input type="number" v-model="obj.quadrilateral"
                            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                    </div>
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white">Tiempo Finalizado
                        </label>
                        <input type="number" v-model="obj.match_timer"
                            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                    </div>
                    <div class="w-full">
                        <SelectComponent :data="typesvictories" :title="'Tipo de Victoria'"
                            :selectedOption="obj.victory_type_id" @obj-selected="handleTypeVictorySelected" />
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4 my-4">
                    <div @click="handleAthleteWinner(data.athlete_one.id, data?.athlete_two?.id)" v-if="data.athlete_one"
                        class="rounded-sm border border-stroke py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark"  
                        :class="{ 
                            'dark:bg-meta-3 bg-meta-3': obj.athlete_id_winner == data.athlete_one.id,
                            'dark:bg-meta-1 bg-meta-1': obj.athlete_id_loser == data.athlete_one.id,
                            
                        }">
                        <div class="mt-4 flex items-center">
                            <div>
                                <h4 class="text-title-md font-bold text-black dark:text-white">Ganador {{ data.athlete_one.name }}</h4>
                            </div>
                        </div>
                    </div>
                    
                    <div @click="handleAthleteWinner(data.athlete_two.id, data.athlete_one.id)" v-if="data.athlete_two"
                        class="rounded-sm border border-stroke py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark"
                        :class="{ 
                            'dark:bg-meta-3 bg-meta-3': obj.athlete_id_winner == data.athlete_two.id,
                            'dark:bg-meta-1 bg-meta-1': obj.athlete_id_loser == data.athlete_two.id,
                        }">
                        <div class="mt-4 flex items-center">
                            <div>
                                <h4 class="text-title-md font-bold text-black dark:text-white">Ganador {{ data.athlete_two.name }}</h4>
                            </div>
                        </div>
                    </div>

                    <div @click="handleAthleteWinner()"
                        class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div class="mt-4 flex items-center">
                            <div>
                                <h4 class="text-title-md font-bold text-black dark:text-white">Ninguno</h4>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="-mx-3 flex flex-wrap gap-y-4">
                    <div class="w-full px-3 2xsm:w-1/2">
                        <button
                            class="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                            @click="$emit('close')">
                            Cancel
                        </button>
                    </div>
                    <div class="w-full px-3 2xsm:w-1/2">
                        <button type="submit"
                            class="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                            :class="{ 'disabled:cursor-default disabled:bg-whiter dark:focus:border-primary dark:disabled:bg-black opacity-50' : !obj.athlete_id_winner}">
                            Aceptar
                        </button>
                    </div>
                </div>
            </form>
        </div>

    </div>
</template>