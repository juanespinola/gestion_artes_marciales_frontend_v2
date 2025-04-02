import FormAssociationsUsers from "./components/FormAssociationsUsersComponent.vue";
import AssociationsUsersView from "./AssociationsUsersView.vue";

export default [
    { path: 'associationusers', name: "ListAssociationsUsers", component: AssociationsUsersView },
    { path: 'associationusers/new', name: "NewAssociationsUsers", component: FormAssociationsUsers },
    { path: 'associationusers/:id/edit', name: "EditAssociationsUsers", component: FormAssociationsUsers, props:true }
]

