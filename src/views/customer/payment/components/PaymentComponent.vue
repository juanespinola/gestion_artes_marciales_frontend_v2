<script>
import { useRoute } from "vue-router"
import { onMounted, ref } from 'vue';
export default {
    props: {
        id: {
            type: String,
            required: true,
        }
    },
    setup(props){
        const route = useRoute()


        onMounted(() => {
            console.log(route)
        })

        return {
            route
        }
    }

}
</script>

<template>
    <div v-if="route.query.payment_gateway == 'vpos'">
        aca tenemos que armar el iframe de barcard
    </div>
    <div v-if="route.query.payment_gateway == 'transferencia'">
        aca va el componente de transferencia
    </div>
</template>