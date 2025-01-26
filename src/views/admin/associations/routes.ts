import FormAssociations from "./components/FormAssociationsComponent.vue";
import AssociationsView from "./AssociationsView.vue";

export default [
    { path: 'associations', name: "ListAssociations", component: AssociationsView },
    { path: 'associations/new', name: "NewAssociation", component: FormAssociations },
    { path: 'associations/:id/edit', name: "EditAssociation", component: FormAssociations, props:true }
]

