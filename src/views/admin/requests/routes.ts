import FormRequestsComponent from "./components/FormRequestsComponent.vue";
import RequestsView from "./RequestsView.vue";

export default [
    { path: 'requests', name: 'ListRequests', component: RequestsView },
    { path: 'requests/new', name: 'NewRequest', component: FormRequestsComponent },
    { path: 'requests/:id/edit', name: 'EditRequest', component: FormRequestsComponent, props:true }
]

