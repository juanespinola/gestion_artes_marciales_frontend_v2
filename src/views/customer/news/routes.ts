import DetailNewsComponent from './components/DetailNewsComponent.vue'
import NewsView from './NewsView.vue'


export default [
    { path: 'federation/news', name: "ListAthleteNews", component: NewsView },
    { path: 'federation/news/:id/detail', name: "NewsAthleteDetail", component: DetailNewsComponent, props:true },
]