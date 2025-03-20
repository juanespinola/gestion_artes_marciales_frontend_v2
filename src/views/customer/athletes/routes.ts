import AthletesDetail from './AthletesDetail.vue'
import AthletesView from './AthletesView.vue'


export default [
    { path: 'athletes', name: "ListAthlete", component: AthletesView },
    { path: 'athletes/:id/detail', name: "DetailAthlete", component: AthletesDetail, props:true },
    // { path: 'federation/news/:id/detail', name: "NewsAthleteDetail", component: DetailNewsComponent, props:true },
]