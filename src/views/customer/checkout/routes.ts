import CheckoutView from './CheckoutView.vue'

export default [
    { path: 'paymentsfees/:membership_id/checkout', name: "CheckoutMembership", component: CheckoutView, props:true},
    { path: 'paymentsfees/:inscription_id/checkout', name: "CheckoutInscription", component: CheckoutView, props:true },
    // { path: 'profile/belthistory/new', name: "NewBeltHistory", component: BeltHistoryFormComponent },
    // { path: 'profile/belthistory/:id/edit', name: "EditBeltHistory", component: BeltHistoryFormComponent, props:true },
]