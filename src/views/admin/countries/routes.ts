import FormCountries from "./components/FormCountriesComponent.vue";
import CountriesView from "./CountriesView.vue";

export default [
    { path: 'countries', name: "ListCountries", component: CountriesView },
    { path: 'countries/new', name: "NewCountry", component: FormCountries },
    { path: 'countries/:id/edit', name: "EditCountry", component: FormCountries, props:true }
]

