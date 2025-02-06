import FormMinorAuthorizationsComponent from "./components/FormMinorAuthorizationsComponent.vue";
import MinorAuthorizationsView from "./MinorAuthorizationsView.vue";

export default [
    { path: 'minorauthorizations', name: 'ListMinorAuthorization', component: MinorAuthorizationsView },
    // { path: 'minorauthorization/new', name: 'NewRequest', component: FormRequestsComponent },
    { path: 'minorauthorizations/:id/edit', name: 'EditMinorAuthorization', component: FormMinorAuthorizationsComponent, props:true }
]

