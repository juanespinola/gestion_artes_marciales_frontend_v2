import PaymentComponent from "./components/PaymentComponent.vue";

export default [
    { path: 'paymentsfees/:id/payment', name: "Payment", component: PaymentComponent, props:true },
]