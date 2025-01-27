import FormNewsComponent from "./components/FormNewsComponent.vue";
import NewsView from "./NewsView.vue";

export default [
    { path: 'news', name: 'ListNews', component: NewsView },
    { path: 'news/new', name: 'NewNew', component: FormNewsComponent },
    { path: 'news/:id/edit', name: 'EditNew', component: FormNewsComponent, props:true }
]

