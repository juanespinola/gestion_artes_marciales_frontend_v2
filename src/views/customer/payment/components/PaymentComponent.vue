<script>
import { useRoute } from "vue-router"
import { onMounted, ref } from 'vue';
export default {
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const route = useRoute()


        onMounted(() => {
            if (window.Bancard && window.Bancard.Checkout) {
                if (route.query.response_bancard) {
                    window.Bancard.Checkout.createForm('iframe-container', route.query.response_bancard, {})
                } else if (route.query.response_bancard?.data_error) {
                    response_payment = route.query.response_bancard.data_error
                }
            } else {
                console.error('Bancard Checkout library is not loaded');
            }
        })

        return {
            route
        }
    }

}
</script>

<template>
    <div v-if="route.query.payment_gateway == 'vpos'">
        <div id="iframe-container" class="d-flex h-100"></div>
    </div>
    <div v-if="route.query.payment_gateway == 'transferencia'">
        aca va el componente de transferencia
    </div>
</template>