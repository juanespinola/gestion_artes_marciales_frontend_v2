<script>
import CardComponent from '@/components/Card/CardComponent.vue';
import { onMounted, ref } from 'vue';
import {  useRoute } from 'vue-router';

export default {
    components: {
        CardComponent
    },
    props:{
        data: {
            
        }
    },
    setup(props) {
        const route = useRoute()
        onMounted(() => {
            console.log(route.params)
            console.log(props)
        })

    }
}
</script>


<template>
    <CardComponent>
        
    </CardComponent>
</template>