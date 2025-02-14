import FormCountries from "./components/FormCountriesComponent.vue";
import CountriesView from "./CountriesView.vue";
import FormCitiesComponent from "../cities/components/FormCitiesComponent.vue";

export default [
    { path: 'countries', name: "ListCountries", component: CountriesView },
    { path: 'countries/new', name: "NewCountry", component: FormCountries },
    { path: 'countries/:id/edit', name: "EditCountry", component: FormCountries, props:true },
    { path: 'countries/:countryId/cities/new', name: 'NewCity', component: FormCitiesComponent, props:true },
    { path: 'countries/:countryId/cities/:id/edit', name: 'EditCity', component: FormCitiesComponent, props:true }
]

