// import FormEvents from "./components/FormEventsComponent.vue";
import EventsFormView from "./EventsFormView.vue";
import EventsView from "./EventsView.vue";
import RouteEntryCategories from "../entrycategories/routes";
import RouteAthleteInscriptions from "../athletesinscriptions/routes";

export default [
    { path: 'events', name: "ListEvents", component: EventsView },
    { path: 'events/new', name: "NewEvent", component: EventsFormView },
    { path: 'events/:id/edit', name: "EditEvent", component: EventsFormView, props:true },

    // sub rutas de eventos pero para las entry categories
    ...RouteEntryCategories,
    // sub rutas de eventos pero para las entry categories
    ...RouteAthleteInscriptions,

]

