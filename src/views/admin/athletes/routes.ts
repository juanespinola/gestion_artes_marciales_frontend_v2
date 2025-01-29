import FormAthletes from "./components/FormAthletesComponent.vue";
import AthletesView from "./AthletesView.vue";

export default [
    { path: 'athletes', name: "ListAthletes", component: AthletesView },
    { path: 'athletes/new', name: "NewAthlete", component: FormAthletes },
    { path: 'athletes/:id/edit', name: "EditAthlete", component: FormAthletes, props:true }
]

