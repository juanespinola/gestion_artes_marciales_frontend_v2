import FormFederatiosUsers from "./components/FormFederationsUsersComponent.vue";
import FederatiosUsersView from "./FederationsUsersView.vue";

export default [
    { path: 'federationusers', name: "ListFederationsUsers", component: FederatiosUsersView },
    { path: 'federationusers/new', name: "NewFederationsUsers", component: FormFederatiosUsers },
    { path: 'federationusers/:id/edit', name: "EditFederationsUsers", component: FormFederatiosUsers, props:true }
]

