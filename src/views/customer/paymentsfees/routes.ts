import PaymentFeeTabsView from './PaymentFeeTabsView.vue'
import RouteCheckout from '@/views/customer/checkout/routes'

export default [
    { path: 'paymentsfees', name: "TabsPaymentsFee", component: PaymentFeeTabsView, props: true },
    ...RouteCheckout,    
]