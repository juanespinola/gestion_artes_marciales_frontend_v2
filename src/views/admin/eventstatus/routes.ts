import FormEventStatusComponent from "./components/FormEventStatusComponent.vue";
import EventStatusView from "./EventStatusView.vue";

export default [
    { path: 'eventstatus', name: 'ListEventStatus', component: EventStatusView },
    { path: 'eventstatus/new', name: 'NewEventStatus', component: FormEventStatusComponent },
    { path: 'eventstatus/:id/edit', name: 'EditEventStatus', component: FormEventStatusComponent, props:true }
]

