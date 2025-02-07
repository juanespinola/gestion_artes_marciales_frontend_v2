import CheckoutView from './CheckoutView.vue'
import RoutePayment from '../payment/routes'

export default [
    { path: 'paymentsfees/:membership_id/checkout', name: "CheckoutMembership", component: CheckoutView, props:true},
    { path: 'paymentsfees/:inscription_id/checkout', name: "CheckoutInscription", component: CheckoutView, props:true },
    ...RoutePayment
]