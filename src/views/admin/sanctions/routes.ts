import FormSanctionsComponent from "./components/FormSanctionsComponent.vue";
import SanctionsView from "./SanctionsView.vue";

export default [
    { path: 'athletes/:athleteid/sanctions', name: 'ListSanctions', component: SanctionsView, props:true },
    { path: 'athletes/:athleteid/sanctions/new', name: 'NewSanction', component: FormSanctionsComponent, props:true },
    { path: 'athletes/:athleteid/sanctions/:id/edit', name: 'EditSanction', component: FormSanctionsComponent, props:true }
]

