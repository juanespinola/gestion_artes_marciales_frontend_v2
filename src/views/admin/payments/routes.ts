import FormPaymentsComponent from "./components/FormPaymentsComponent.vue";
import PaymentsView from "./PaymentsView.vue";

export default [
    { path: 'payments', name: 'ListPayments', component: PaymentsView },
    // { path: 'payments/new', name: 'NewPayments', component: FormPaymentsComponent },
    { path: 'payments/:id/edit', name: 'EditPayments', component: FormPaymentsComponent, props:true }
]

