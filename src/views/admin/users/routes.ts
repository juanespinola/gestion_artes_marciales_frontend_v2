import FormUsers from "./components/FormUsersComponent.vue";
import UsersView from "./UsersView.vue";

export default [
    { path: 'users', name: "ListUsers", component: UsersView },
    { path: 'users/new', name: "NewUser", component: FormUsers },
    { path: 'users/:id/edit', name: "EditUser", component: FormUsers, props:true }
]

