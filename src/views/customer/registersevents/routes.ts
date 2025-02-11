import RegistersEventsView from './RegistersEventsView.vue'
export default [
    { path: 'federation/events/:id/inscription', name: "NewRegisterEvent", component: RegistersEventsView, props:true },
    // { path: 'federation/events/:id/detail', name: "EventsAthleteDetail", component: DetailEventsComponent, props:true },
    // { path: 'federation/events/:id/entrycategory/:entrycategoryid/matchbrackets', name: "EventsAthleteMatchBracket", component: MatchBracketsComponent, props:true },
]