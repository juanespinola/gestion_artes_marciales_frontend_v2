import FormCitiesComponent from "./components/FormCitiesComponent.vue";
import CitiesView from "./CitiesView.vue";

export default [
    { path: 'cities', name: 'ListCities', component: CitiesView, props:true },
    { path: 'cities/new', name: 'NewCity', component: FormCitiesComponent },
    { path: 'cities/:id/edit', name: 'EditCity', component: FormCitiesComponent, props:true }
]

