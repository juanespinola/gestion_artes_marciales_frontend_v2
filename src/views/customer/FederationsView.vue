<script>
import CardComponent from '@/components/Card/CardComponent.vue';
import useData from '@/composables/useData'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user';

export default {
    components: {
        CardComponent
    },
    setup() {
        const userStore = useUserStore()
        let collection = 'federations';
        const data = ref([])
        const router = useRouter()
        const {
            // data,
            isLoading,
            error,
            fetchAll,
        } = useData();
        onMounted(async () => {
            // if(Object.keys(userStore.federation).length > 0) {
            //     router.push({ name:"FederationCards" })
            // }

            // Cargar los datos al montar el componente
            const response = await fetchAll(collection)
            if(response.success){
                data.value = response.data
            }
        });
        return {
            data,
            isLoading,
            error,
            userStore,
            router
        }
    },
    methods: {
        federationSelected(federation) {
            this.userStore.federation = { id:federation.id, description:federation.description };
            this.router.push({ name: 'FederationCards' })
        }

    }

}
</script>

<template>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardComponent v-for="(row) of data" :key="row.id" v-show="row.status" @click="federationSelected(row)">
            <div class="border-b border-stroke p-5 px-7.5 dark:border-strokedark" >
                <h4 class="text-xl font-semibold text-black dark:text-white">
                    {{ row.description }}
                </h4>
            </div>
        </CardComponent>
    </div>
</template>