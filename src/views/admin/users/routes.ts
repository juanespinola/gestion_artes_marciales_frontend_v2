import FormUsers from "./components/FormUsers.vue";
import ListUsers from "./components/ListUsers.vue";

export default [
    { path: 'users', name: "ListUsers", component: ListUsers },
    { path: 'user/new', name: "NewUser", component: FormUsers },
    { path: 'user/:id/edit', name: "EditUser", component: FormUsers, props:true }
]

