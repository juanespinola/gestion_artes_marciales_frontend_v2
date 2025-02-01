import MatchBracketComponent from './components/MatchBracketsComponent.vue'

export default [
    { path: 'events/:eventid/entrycategory/:entrycategoryid/matchbracket', name: "ListMatchbracket", component: MatchBracketComponent, props:true },
]

