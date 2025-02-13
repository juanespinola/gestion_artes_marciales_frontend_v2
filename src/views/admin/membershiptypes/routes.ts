import FormMembershipTypesComponent from "./components/FormMembershipTypesComponent.vue";
import MembershipTypesView from "./MembershipTypesView.vue";

export default [
    { path: 'membershiptypes', name: "ListMembershipTypes", component: MembershipTypesView },
    { path: 'membershiptypes/new', name: "NewMembershipType", component: FormMembershipTypesComponent },
    { path: 'membershiptypes/:id/edit', name: "EditMembershipType", component: FormMembershipTypesComponent, props:true }
]

