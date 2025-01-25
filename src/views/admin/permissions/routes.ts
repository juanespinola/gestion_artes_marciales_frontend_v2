import FormPermissionsComponent from "./components/FormPermissionsComponent.vue";
import PermissionsView from "./PermissionsView.vue";

export default [
    { path: 'permissions', name: 'ListPermissions', component: PermissionsView },
    { path: 'permissions/new', name: 'NewPermission', component: FormPermissionsComponent },
    { path: 'permissions/:id/edit', name: 'EditPermission', component: FormPermissionsComponent, props:true }
]

