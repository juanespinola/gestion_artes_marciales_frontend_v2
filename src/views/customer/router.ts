import RouteProfile from '@/views/customer/profile/routes'
import RoutePaymentFee from '@/views/customer/paymentsfees/routes'
import RouteAthleteNews from '@/views/customer/news/routes'
import RouteAthleteEvents from '@/views/customer/events/routes'
import RouteRegisterEvents from '@/views/customer/registersevents/routes'
import RouteAthletes from '@/views/customer/athletes/routes'
import RouteRanking from '@/views/customer/ranking/routes'
import FederationDetail from './FederationDetail.vue'



export default [
    ...RouteProfile,
    ...RoutePaymentFee,
    ...RouteAthleteNews,
    ...RouteAthleteEvents,
    ...RouteRegisterEvents,
    ...RouteAthletes,
    ...RouteRanking,
    { path: 'federation/detail', name: "FederationDetail", component: FederationDetail, props:true },
]