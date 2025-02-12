// import FormEvents from "./components/FormEventsComponent.vue";
import EntryCategoryFormComponent from "./components/EntryCategoryFormComponent.vue";
import TariffCategoryFormComponent from "./components/TariffCategoryFormComponent.vue";


export default [
    // { path: 'entrycategories', name: "ListEntryCategories", component: EventsView },
    { path: 'events/:eventid/entrycategories/new', name: "NewEntryCategory", component: EntryCategoryFormComponent, props:true },
    { path: 'events/:eventid/entrycategories/:id/edit', name: "EditEntryCategory", component: EntryCategoryFormComponent, props:true },
    { path: 'events/:eventid/entrycategories/:id/tariffcategory', name: "NewTariffCategory", component: TariffCategoryFormComponent, props:true },
]

