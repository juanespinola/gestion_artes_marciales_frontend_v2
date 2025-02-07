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

        return {}
    }

}
</script>

<template>
    aca tenemos que armar el iframe de barcard
</template>