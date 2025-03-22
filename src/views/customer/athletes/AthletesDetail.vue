<script>
import moment from 'moment'
import { onMounted, ref } from 'vue';
import useData from '@/composables/useData';
export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const data = ref({});
        const { isLoading, error, fetchAll, destroy } = useData();
        const fetchData = async () => {
            const response = await fetchAll(`athleteallprofile/${props.id}`);
            if (response.success) {
                data.value = response.data;
            }
        };
        onMounted(async () => await fetchData());

        const getAge = (birthdate) => {
            return moment().diff(birthdate, 'years')
        }

        const getColor = (color) => {
            let bg_color = '';
            switch (color?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"")) {
                case "blanco":
                    bg_color = 'bg-white'
                break;
                case "azul":
                    bg_color = 'bg-blue-700'
                break;
                case "lila":
                    bg_color = 'bg-purple-700'
                break;
                case "marron":
                    bg_color = 'bg-[#7C4700]'
                break;
                default:
                    bg_color = 'bg-black'
                break;
            
               
            }
            return bg_color;
        }

        const capitalizeWord = (texto) => {
            if (typeof texto !== "string" || texto.length === 0) return "";
            return texto[0]?.toUpperCase() + texto.slice(1)
        }

        return {
            data,
            isLoading,
            error,
            fetchData,
            getAge,
            getColor,
            capitalizeWord,
            props
        }
    }
}
</script>

<template>
    <div
        class="overflow-hidden rounded-2xl border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark lg:p-6">
        <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Perfil</h3>
        <div>
            <div class="p-5 mb-6 border border-stroke rounded-2xl bg-gray dark:border-strokedark dark:bg-meta-4 lg:p-6">
                <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div class="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <!-- Imagen de perfil -->
                        <div class="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                            <img :src="data?.profile_image ? data?.profile_image : 'https://i.pinimg.com/550x/a8/0e/36/a80e3690318c08114011145fdcfa3ddb.jpg'"
                                alt="user" class="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center">
                        </div>

                        <!-- Información del usuario y cinturón en responsive -->
                        <div
                            class="flex flex-col items-center order-3 gap-4 xl:order-2 xl:flex-row xl:items-center xl:w-full">
                            <!-- Información del usuario -->
                            <div class="w-3/6">
                                <h4
                                    class="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                    {{ capitalizeWord(data?.name) || data?.name }}
                                </h4>
                                <div
                                    class="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Edad: {{ getAge(data?.birthdate)
                                        }}</p>
                                    <div class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Pais: {{ data?.country }}</p>
                                </div>
                            </div>

                            <!-- Cinturón -->
                            <div class="flex items-center order-2 gap-2 xl:order-3 xl:justify-end w-full">
                                <div class="rounded-2xl bg-gray dark:border-strokedark dark:bg-meta-4">
                                    <div
                                        class="relative flex items-center justify-center w-56 h-6 bg-gray-900 rounded-lg">
                                        <div class="absolute w-full h-full rounded-md " :class="getColor(data?.belt)"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div><!---->
        </div>
        <div>
            <div class="p-5 mb-6 border border-stroke rounded-2xl bg-gray dark:border-strokedark dark:bg-meta-4 lg:p-6"
                v-for="inscription of data?.inscriptions">
                <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div class="w-full">
                        <div class="border-b border-gray-300 py-4 px-7 dark:border-gray-600">
                            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <h4 class="text-lg text-gray-800 dark:text-white/90"> {{ inscription.event.description
                                    }}
                                </h4>
                                <h3 class="text-lg text-gray-800 dark:text-white/90">
                                    {{ inscription.event.initial_date }}
                                </h3>
                            </div>
                        </div>
                        <div class="mt-6">
                            <div class="grid grid-cols-2 gap-4 lg:gap-7 2xl:gap-x-32">
                                <div>
                                    <div class="mb-5">
                                        <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                            {{ inscription.event.entry_category.name }} | {{
                                                inscription.event.entry_category.gender }}
                                        </h4>
                                        <div v-for="matchbracket of inscription?.event.entry_category?.match_bracket">
                                            <div>
                                                <label class="flex items-center my-2">
                                                    <span
                                                        class="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium capitalize text-sm text-white dark:text-white mr-2"
                                                        :class="{
                                                            'bg-green-400': matchbracket.athlete_id_winner == props.id,
                                                            'bg-red-400': matchbracket.athlete_id_loser == props.id
                                                        }">
                                                        {{ matchbracket.athlete_id_winner == props.id ? 'Ganador' :
                                                            'Perdedor' }}
                                                    </span>
                                                    vs {{ matchbracket.athlete_id_winner == props.id ?
                                                        matchbracket.athlete_loser : matchbracket.athlete_winner }}
                                                    <p class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                                        Tipo de victoria
                                                    </p>
                                                </label>
                                            </div>
                                            <div v-if="matchbracket?.bracket.phase == 'Final' && matchbracket?.athlete_id_winner == props.id"
                                                class="flex border-y border-gray-300 py-2 dark:border-gray-600 mt-5">
                                                <span
                                                    class="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium capitalize text-sm text-white dark:text-white mr-2 bg-yellow-500">oro</span>
                                            </div>
                                            <div v-if="matchbracket?.bracket.phase == 'Final' && matchbracket?.athlete_id_loser == props.id"
                                                class="flex border-y border-gray-300 py-2 dark:border-gray-600 mt-5">
                                                <span      
                                                    class="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium capitalize text-sm text-white dark:text-white mr-2 bg-slate-400">plata</span>
                                            </div>
                                            <div v-if="matchbracket?.bracket.phase == 'Semifinal' && matchbracket?.athlete_id_loser == props.id"
                                                class="flex border-y border-gray-300 py-2 dark:border-gray-600 mt-5">
                                                <span      
                                                    class="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium capitalize text-sm text-white dark:text-white mr-2 bg-yellow-700">Bronce</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="relative z-20 h-35 md:h-65 border-b border-stroke dark:border-strokedark dark:bg-boxdark">
                                    <img :src="data?.media_event?.route_file ? data?.media_event?.route_file : 'https://cloudfront-us-east-1.images.arcpublishing.com/metroworldnews/DR4BZQ466JFDFPWA5R3J5LTIY4.jpg'"
                                        alt="profile cover"
                                        class="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>