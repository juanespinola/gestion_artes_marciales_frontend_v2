import BeltHistoryFormComponent from './components/BeltHistoryFormComponent.vue'
import ProfileTabsView from './ProfileTabsView.vue'

export default [
    { path: 'profile', name: "Profile", component: ProfileTabsView, props:true },
    { path: 'profile/belthistory/new', name: "NewBeltHistory", component: BeltHistoryFormComponent },
    { path: 'profile/belthistory/:id/edit', name: "EditBeltHistory", component: BeltHistoryFormComponent, props:true },
]