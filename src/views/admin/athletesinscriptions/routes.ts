// import FormEvents from "./components/FormEventsComponent.vue";
import AthleteInscriptionFormComponent from "./components/AthleteInscriptionFormComponent.vue";
// import EventsView from "./EventsView.vue";
import RouteMatchBrackets from "../matchbrackets/routes"

export default [
    // { path: 'entrycategories', name: "ListEntryCategories", component: EventsView },
    { path: 'events/:eventid/athleteinscriptions/new', name: "NewAthleteInscription", component: AthleteInscriptionFormComponent, props:true },
    { path: 'events/:eventid/athleteinscriptions/:id/edit', name: "EditAthleteInscription", component: AthleteInscriptionFormComponent, props:true },
    
    ...RouteMatchBrackets
]

