import FormRolesComponent from "./components/FormRolesComponent.vue";
import RolesView from "./RolesView.vue";

export default [
    { path: 'roles', name: 'ListRoles', component: RolesView },
    { path: 'roles/new', name: 'NewRole', component: FormRolesComponent },
    { path: 'roles/:id/edit', name: 'EditRole', component: FormRolesComponent, props:true }
]

