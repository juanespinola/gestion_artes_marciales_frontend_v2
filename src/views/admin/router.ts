
import RouteUsers from '@/views/admin/users/routes'
import RouteEventStatus from '@/views/admin/eventstatus/routes'
import RouteEventTypes from '@/views/admin/eventtypes/routes'
import RouteLocations from '@/views/admin/locations/routes'
import RoutePermissions from '@/views/admin/permissions/routes'
import RouteRoles from '@/views/admin/roles/routes'
import RouteFederations from '@/views/admin/federations/routes'
import RouteAssociations from '@/views/admin/associations/routes'
import RouteCountries from '@/views/admin/countries/routes'
import RouteCities from '@/views/admin/cities/routes'
import RouteNews from '@/views/admin/news/routes'
import RouteAthletes from '@/views/admin/athletes/routes'
import RouteSanctions from '@/views/admin/sanctions/routes'
import RouteEvents from '@/views/admin/events/routes'
import RouteRequests from '@/views/admin/requests/routes'

export default [
    ...RouteUsers,
    ...RouteEventStatus,
    ...RouteEventTypes,
    ...RouteEventTypes,
    ...RouteLocations,
    ...RoutePermissions,
    ...RouteRoles,
    ...RouteFederations,
    ...RouteAssociations,
    ...RouteCountries,
    ...RouteCities,
    ...RouteNews,
    ...RouteAthletes,
    ...RouteSanctions,
    ...RouteEvents,
    ...RouteRequests,
]