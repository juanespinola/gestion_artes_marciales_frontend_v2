import FormBeltsComponent from "./components/FormBeltsComponent.vue";
import BeltsView from "./BeltsView.vue";

export default [
    { path: 'belts', name: 'ListBelts', component: BeltsView },
    { path: 'belts/new', name: 'NewBelt', component: FormBeltsComponent },
    { path: 'belts/:id/edit', name: 'EditBelt', component: FormBeltsComponent, props:true }
]

