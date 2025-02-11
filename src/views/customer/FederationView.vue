<script>
import CustomerLayout from '@/layouts/CustomerLayout.vue';
import NewsView from './news/NewsView.vue';
import { onMounted, ref } from 'vue';
import {useRouter} from 'vue-router'
export default {
    components: {
        CustomerLayout,
        NewsView,
    },
    setup() {
        const router = useRouter()
        const options = ref([
            {
                id: 1,
                description: "Noticias",
                route: 'ListAthleteNews',
            },
            {
                id: 2,
                description: "Eventos",
                route: "ListAthleteEvents",
            },
            {
                id: 3,
                description: "Información",
                route: "federation/news",
            },
            {
                id: 4,
                description: "Atletas",
                route: "ListAthlete",
            },
            {
                id: 5,
                description: "Ranking",
                route: "federation/news",
            },
        ]);


        const handleSelectOption = (route) => {
            router.push({ name: route })
        }

        return {
            options,
            handleSelectOption
        }
    }
}
</script>

<template>
    <CustomerLayout>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <div v-for="option of options" @click="handleSelectOption(option.route)"
                class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                    {{ option.id }}
                </div>
                <div class="mt-4 flex items-end justify-between">
                    <div>
                        <h4 class="text-title-md font-bold text-black dark:text-white">{{ option.description }}</h4>
                        <!-- <span class="text-sm font-medium">Total views</span> -->
                    </div>
                    <!-- <span class="flex items-center gap-1 text-sm font-medium text-meta-3">0.43% </span> -->
                </div>
            </div>
        </div>
    </CustomerLayout>
</template>