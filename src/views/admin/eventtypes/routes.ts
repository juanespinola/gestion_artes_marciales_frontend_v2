import FormEventTypesComponent from "./components/FormEventTypesComponent.vue";
import EventTypesView from "./EventTypesView.vue";

export default [
    { path: 'eventtypes', name: 'ListEventTypes', component: EventTypesView },
    { path: 'eventtypes/new', name: 'NewEventTypes', component: FormEventTypesComponent },
    { path: 'eventtypes/:id/edit', name: 'EditEventTypes', component: FormEventTypesComponent, props:true }
]

