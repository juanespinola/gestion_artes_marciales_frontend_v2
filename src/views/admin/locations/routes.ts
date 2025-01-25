import FormLocationsComponent from "./components/FormLocationsComponent.vue";
import LocationsView from "./LocationsView.vue";

export default [
    { path: 'locations', name: 'ListLocations', component: LocationsView },
    { path: 'locations/new', name: 'NewLocation', component: FormLocationsComponent },
    { path: 'locations/:id/edit', name: 'EditLocation', component: FormLocationsComponent, props:true }
]

