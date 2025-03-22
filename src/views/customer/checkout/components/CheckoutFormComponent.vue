<script>
import CardComponent from '@/components/Card/CardComponent.vue';
import useData from '@/composables/useData';
import { useUserStore } from '@/stores/user';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    components: {
        CardComponent
    },
    props: {
        membership_id: {
            type: String,
            required: false,
        },
        inscription_id: {
            type: String,
            required: false,
        }
    },
    setup(props) {
        const userStore = useUserStore()
        const obj = ref({
            athlete_id: userStore.user.id,
            payment_gateway: 'vpos',
            federation_id: userStore.user.federation.id,
            association_id: userStore.user.federation.association.id,
            membership_id: props.membership_id ? props.membership_id : "",
            inscription_id: props.inscription_id ? props.inscription_id : "",
            payment_for: '',
            json_request: {},
            total_payment: '',
            amount_fee: '',
            description: '',
            payment_number: '',
            reason: '',
        })
        const route = useRoute()
        const router = useRouter()
        const { find, update, create, fetchAll } = useData();
        // Función para obtener los datos si estamos en edición
        const fetchMembership = async () => {
            const response = await find('athlete/getmembershipfee', props.membership_id);
            if (response.success) {
                obj.value.description = response.data.description
                obj.value.amount_fee = response.data.amount_fee
                obj.value.total = response.data.amount_fee
                obj.value.membership_id = props.membership_id
                obj.value.total_payment = response.data.amount_fee
                obj.value.payment_for = 'membresia'
            }
        };

        const fetchInscription = async () => {
            const response = await find('athlete/getinscription', props.inscription_id);
            // console.log(response.data)
            if (response.success) {
                obj.value.description = response.data.event.description
                obj.value.amount_fee = response.data.amount_fee
                obj.value.total = response.data.amount_fee
                obj.value.inscription_id = props.inscription_id
                obj.value.total_payment = response.data.tariff_inscription ? response.data.tariff_inscription.price : response.data.inscription_fee
                obj.value.payment_for = 'inscription'
            }
        };

        const selectMethodPayment = (method) => {
            if (method == 'transferencia') {
                obj.value.payment_gateway = 'transferencia'
                obj.value.json_request = {
                    "numero_comprobante": obj.value.payment_number,
                    "motivo": obj.value.reason
                }
            }

            if (method == 'vpos') {
                obj.value.payment_gateway = 'vpos';
                obj.value.json_request = ''
            }
        }

        const payment = async () => {
            try {
                const response = await create('athlete/payment/create', obj.value)
                if (response.success) {
                    router.push({
                        name: "Payment",
                        params: { id: props.membership_id ? props.membership_id : props.inscription_id },
                        query: { payment_gateway: obj.value.payment_gateway, response_bancard: response.data.data.process_id }
                    })
                }
            } catch (err) {
                console.error('Error al guardar el registro:', err.message);
            }
        }

        onMounted(async () => {
            if (props.membership_id) {
                await fetchMembership()
            }
            if (props.inscription_id) {
                await fetchInscription()
            }
        })

        watch([() => obj.value.payment_number, () => obj.value.reason], () => {
            if (obj.value.payment_gateway === 'transferencia') {
                obj.value.json_request = {
                    numero_comprobante: obj.value.payment_number,
                    motivo: obj.value.reason
                }
            }
        })

        return {
            obj,
            props,
            payment,
            router,
            selectMethodPayment,
        }
    }
}
</script>


<template>

    <CardComponent>
        <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">{{ props.membership_id ? "Pagar Membresia" :
                "Pagar Inscripción" }}</h3>
        </div>
        <div class="p-7">
            <form @submit.prevent="payment">
                <!-- {{ obj }} -->
                <div class="mb-5.5">
                    <label for="roleSelect" class="mb-4.5 block text-sm font-medium text-black dark:text-white">
                        Seleccione Método de Pago </label>
                    <div class="flex flex-wrap items-center gap-5.5">
                        <div @click="selectMethodPayment('vpos')">
                            <label
                                class="relative flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-black dark:text-white"><input
                                    class="sr-only" type="radio" name="roleSelect" id="Web">
                                <span class="flex h-5 w-5 items-center justify-center rounded-full border" :class="{
                                    'border-primary': obj.payment_gateway == 'vpos',
                                    'border-body': obj.payment_gateway !== 'vpos',
                                }">
                                    <span class="h-2.5 w-2.5 rounded-full bg-primary flex" :class="{
                                        'hidden': obj.payment_gateway !== 'vpos'
                                    }"></span>
                                </span>
                                Tarjeta
                            </label>
                        </div>

                        <div @click="selectMethodPayment('transferencia')">
                            <label
                                class="relative flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-black dark:text-white"><input
                                    class="sr-only" type="radio" name="roleSelect" id="Graphics">
                                <span class="flex h-5 w-5 items-center justify-center rounded-full border " :class="{
                                    'border-primary': obj.payment_gateway == 'transferencia',
                                    'border-body': obj.payment_gateway !== 'transferencia',
                                }">
                                    <span class="h-2.5 w-2.5 rounded-full bg-primary flex" :class="{
                                        'hidden': obj.payment_gateway !== 'transferencia'
                                    }"></span>
                                </span>
                                Transferencia Bancaria
                            </label>
                        </div>
                    </div>
                </div>


                <div :class="{ 'hidden': obj.payment_gateway !== 'transferencia' }">
                    <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div class="w-full">
                            <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                for="number_payment">Cuenta de Transferencia Necesitamos crear una tabla donde pueda
                                registrarse las cuentas de federacion y asociacion </label>
                        </div>
                    </div>

                    <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div class="w-full">
                            <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="reason">Motivo
                                de Transferencia*</label>
                            <input
                                class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text" name="reason" id="reason"
                                placeholder="Inscripcion / Membresia de Nombre Completo de Atleta - CI"
                                v-model="obj.reason">
                        </div>
                    </div>

                    <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div class="w-full">
                            <label class="mb-3 block text-sm font-medium text-black dark:text-white"
                                for="payment_number">Número de Comprobante*</label>
                            <input
                                class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                type="text" name="payment_number" id="payment_number" placeholder="789456123"
                                v-model="obj.payment_number">
                        </div>
                    </div>
                </div>

                <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div class="w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="email">Concepto de
                            Pago: {{ obj.description }}</label>
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white" for="email">Total:
                            {{ obj.total_payment }}</label>
                    </div>


                </div>

                <div class="flex justify-end gap-4.5">
                    <button
                        class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                        type="button" @click="$router.go(-1)"> Cancelar </button>
                    <button
                        class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                        :class="{
                            'disabled:cursor-default disabled:bg-whiter dark:focus:border-primary dark:disabled:bg-primary dark:disabled:opacity-50 ': obj.payment_gateway == 'transferencia' && (!obj.reason || !obj.number_payment)
                        }" type="submit"
                        :disabled="obj.payment_gateway == 'transferencia' && (!obj.reason || !obj.payment_number)">
                        Pagar </button>
                </div>
            </form>
        </div>
    </CardComponent>
</template>