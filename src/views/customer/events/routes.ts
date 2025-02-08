import DetailEventsComponent from './components/DetailEventsComponent.vue'
import MatchBracketsComponent from './components/MatchBracketsComponent.vue'
import EventsView from './EventsView.vue'


export default [
    { path: 'federation/events', name: "ListAthleteEvents", component: EventsView },
    { path: 'federation/events/:id/detail', name: "EventsAthleteDetail", component: DetailEventsComponent, props:true },
    { path: 'federation/events/:id/entrycategory/:entrycategoryid/matchbrackets', name: "EventsAthleteMatchBracket", component: MatchBracketsComponent, props:true },
]