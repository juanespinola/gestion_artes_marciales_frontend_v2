import FormFederations from "./components/FormFederationsComponent.vue";
import FederationsView from "./FederationsView.vue";

export default [
    { path: 'federations', name: "ListFederations", component: FederationsView },
    { path: 'federations/new', name: "NewFederation", component: FormFederations },
    { path: 'federations/:id/edit', name: "EditFederation", component: FormFederations, props:true }
]

