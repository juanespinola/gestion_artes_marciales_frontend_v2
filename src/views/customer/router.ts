import RouteProfile from '@/views/customer/profile/routes'
import RoutePaymentFee from '@/views/customer/paymentsfees/routes'
import RouteAthleteNews from '@/views/customer/news/routes'
import RouteAthleteEvents from '@/views/customer/events/routes'
import RouteRegisterEvents from '@/views/customer/registersevents/routes'
import RouteAthletes from '@/views/customer/athletes/routes'
import RouteRanking from '@/views/customer/ranking/routes'


export default [
    ...RouteProfile,
    ...RoutePaymentFee,
    ...RouteAthleteNews,
    ...RouteAthleteEvents,
    ...RouteRegisterEvents,
    ...RouteAthletes,
    ...RouteRanking,
]